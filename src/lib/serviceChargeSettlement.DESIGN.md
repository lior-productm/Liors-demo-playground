# Service Charge Settlement — Backend Design Spec (planning artifact)

> **Status:** design only. This repo (`demo/`) is a **frontend-only Next.js prototype** with
> no database, ORM, or API layer — the agent behavior is scripted and state is persisted in the
> browser (`localStorage`). This document specifies the data model, status enum, state machine,
> and API surface for a **future real backend**, so the prototype and the eventual production
> implementation stay aligned. Nothing here is wired to a running server.

The frontend prototype that implements requirements #1–#5 lives in:
- `src/lib/serviceChargeSettlementData.ts` — mock anomalies, assumptions, line items, calc helpers
- `src/components/workflows/ServiceChargeSettlementFlow.tsx` — staged chat + state machine
- `src/components/workflows/ServiceChargeSettlementPreview.tsx` — interactive, recalculating preview
- `src/components/workflows/ServiceChargeProcessFlow.tsx` — 4-stage status stepper
- persistence via `src/lib/workflowSessions.ts` (`localStorage` key `amiio:workflow-sessions`)

---

## 1. Status enum (process state)

```ts
enum SettlementStatus {
  ANOMALY_DETECTION_COMPLETED = "ANOMALY_DETECTION_COMPLETED", // QC scan ran, awaiting review
  PENDING_USER_REVIEW         = "PENDING_USER_REVIEW",         // user reviewing anomalies
  READY_FOR_SETTLEMENT        = "READY_FOR_SETTLEMENT",        // assumptions confirmed
  INITIAL_SETTLEMENT_GENERATED = "INITIAL_SETTLEMENT_GENERATED", // preview generated
  FINALIZED                   = "FINALIZED",                   // Excel/PDF exported (optional)
}
```

Frontend stage ↔ status mapping (the prototype uses the left column; production uses the enum):

| Prototype stage        | Status enum                    |
| ---------------------- | ------------------------------ |
| `anomaly-detection`    | `ANOMALY_DETECTION_COMPLETED`  |
| `data-review`          | `PENDING_USER_REVIEW`          |
| `assumptions`          | `READY_FOR_SETTLEMENT`         |
| `settlement-preview`   | `INITIAL_SETTLEMENT_GENERATED` |
| (export)               | `FINALIZED`                    |

---

## 2. Data schema (proposed — e.g. Prisma / SQL)

```prisma
model SettlementCase {
  id            String            @id @default(cuid())
  propertyId    String
  fiscalYear    Int
  sourceSystem  String            @default("Exact")
  status        SettlementStatus  @default(ANOMALY_DETECTION_COMPLETED)
  ownerUserId   String
  createdAt     DateTime          @default(now())
  updatedAt     DateTime          @updatedAt

  anomalies     SettlementAnomaly[]
  assumptions   AssumptionLog[]
  lineItems     SettlementLineItem[]
  adjustments   SettlementAdjustment[]
  exports       SettlementExport[]
}

model SettlementAnomaly {
  id          String   @id @default(cuid())
  caseId      String
  case        SettlementCase @relation(fields: [caseId], references: [id])
  severity    String   // "error" | "warning" | "info"
  title       String
  detail      String
  reference   String   // account / invoice ref
  reviewed    Boolean  @default(false)
}

model AssumptionLog {
  id          String   @id @default(cuid())
  caseId      String
  case        SettlementCase @relation(fields: [caseId], references: [id])
  key         String   // "vat", "management_fee", "allocation_basis", "ev_allocation", "utilities_basis"
  question    String
  answer      String   // the user's explicit confirmation / choice
  numericValue Float?  // e.g. 0.21 for VAT, 0.05 for fee — drives recalculation
  confirmedByUserId String
  confirmedAt DateTime @default(now())
}

model SettlementLineItem {
  id          String   @id @default(cuid())
  caseId      String
  case        SettlementCase @relation(fields: [caseId], references: [id])
  category    String
  basis       String
  grossAmount Float
  note        String?
  recoverable Boolean  @default(true)
}

model SettlementAdjustment {
  id          String   @id @default(cuid())
  caseId      String
  case        SettlementCase @relation(fields: [caseId], references: [id])
  lineItemId  String?
  instruction String   // free-text user instruction (chat or row-contextual)
  appliedDelta Json?   // structured change applied by the agent
  createdAt   DateTime @default(now())
}

model SettlementExport {
  id        String   @id @default(cuid())
  caseId    String
  case      SettlementCase @relation(fields: [caseId], references: [id])
  kind      String   // "xlsx" | "pdf"
  url       String   // storage URL
  createdAt DateTime @default(now())
}
```

---

## 3. State machine

Allowed transitions (reject anything else with 409):

```
ANOMALY_DETECTION_COMPLETED ──approveReview──▶ PENDING_USER_REVIEW
PENDING_USER_REVIEW         ──confirmData────▶ READY_FOR_SETTLEMENT   (only when all anomalies reviewed)
READY_FOR_SETTLEMENT        ──generate───────▶ INITIAL_SETTLEMENT_GENERATED (only when all assumptions logged)
INITIAL_SETTLEMENT_GENERATED──adjust─────────▶ INITIAL_SETTLEMENT_GENERATED (self-loop, recalculates)
INITIAL_SETTLEMENT_GENERATED──export─────────▶ FINALIZED
```

Guards: `confirmData` requires every anomaly `reviewed = true`; `generate` requires an
`AssumptionLog` row for each required key.

---

## 4. API endpoints (proposed REST)

```
POST   /api/settlements                         -> create case; run anomaly scan; 201 { case, anomalies }
GET    /api/settlements/:id                     -> full case + status (resume point)
POST   /api/settlements/:id/anomalies/scan      -> (re)run scan on Exact postings
POST   /api/settlements/:id/review              -> mark anomalies reviewed -> PENDING_USER_REVIEW
POST   /api/settlements/:id/confirm-data        -> guard -> READY_FOR_SETTLEMENT
PUT    /api/settlements/:id/assumptions         -> upsert AssumptionLog[] (VAT, fee, allocations…)
POST   /api/settlements/:id/generate            -> compute line items -> INITIAL_SETTLEMENT_GENERATED
POST   /api/settlements/:id/adjust              -> apply instruction, recalc, return new preview
POST   /api/settlements/:id/export              -> { kind: "xlsx" | "pdf" } -> SettlementExport
```

Recalculation is deterministic and server-side: `recoverable = Σ recoverable line grossAmounts`,
`managementFee = recoverable × fee%`, `vat = (recoverable + managementFee) × vat%`,
`total = recoverable + managementFee + vat`. The `/adjust` and `/assumptions` endpoints re-run this.

---

## 5. Final output (Excel + PDF)

- **Excel:** generate server-side with a library that supports **embedded formulas** (e.g. `exceljs`).
  Write validated assumptions and allocation notes into a "Notes" sheet, and put live cell formulas
  (e.g. `=SUM(...)`, `=B2*Assumptions!$B$2`) into the settlement sheet so the recipient can audit the
  math. Persist to object storage; return a signed URL via `SettlementExport`.
- **PDF:** a separate service hook renders the finalized settlement (post-Excel) to a customer-facing
  PDF. Phase 2.
- **Prototype stand-in:** the current UI provides "Export to Excel" / "Generate PDF" buttons that
  produce an in-browser mock download and explain the template/formula step, since no server exists.
