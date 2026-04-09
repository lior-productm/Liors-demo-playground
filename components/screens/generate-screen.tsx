"use client";

import { useState } from "react";
import {
  FileSpreadsheet,
  FileText,
  ArrowUpRight,
  PieChart,
  Sparkles,
  ArrowRight,
  Check,
  Download,
  Clock,
  Building2,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AmiioAiDisclaimerTrigger } from "@/src/components/commercial/AmiioAiDisclaimerTooltip";

interface FileTemplate {
  id: string;
  icon: typeof FileSpreadsheet;
  title: string;
  description: string;
  category: "report" | "analysis" | "projection" | "compliance";
  estimatedTime: string;
  fields: string[];
}

const templates: FileTemplate[] = [
  {
    id: "budget-revision",
    icon: FileSpreadsheet,
    title: "Budget Revision Report",
    description: "Auto-generate a revised budget based on Amiio's detected changes in tenant count, market conditions, and operational costs.",
    category: "report",
    estimatedTime: "~30s",
    fields: ["All assets", "Tenant roll changes", "Market adjustments"],
  },
  {
    id: "tenant-analysis",
    icon: PieChart,
    title: "Tenant Analysis Summary",
    description: "Comprehensive tenant analysis including retention rates, lease expiration schedule, and rental rate benchmarking from Amiio's database.",
    category: "analysis",
    estimatedTime: "~45s",
    fields: ["Tenant mix", "Expiration schedule", "Market comps"],
  },
  {
    id: "cashflow-projection",
    icon: ArrowUpRight,
    title: "Cash Flow Projection (12M)",
    description: "AI-generated 12-month cash flow forecast using historical patterns, market trends, and your portfolio's specific dynamics.",
    category: "projection",
    estimatedTime: "~1m",
    fields: ["NOI projections", "Debt service", "CapEx schedule"],
  },
  {
    id: "portfolio-performance",
    icon: Building2,
    title: "Portfolio Performance Report",
    description: "Board-ready performance report with KPIs, segment analysis, risk assessment, and AI-powered commentary on trends.",
    category: "report",
    estimatedTime: "~40s",
    fields: ["KPI dashboard", "Segment breakdown", "Risk matrix"],
  },
  {
    id: "valuation-update",
    icon: FileText,
    title: "Valuation Update Sheet",
    description: "Updated asset valuations based on current cap rates, comparable transactions, and income approach using live Amiio market data.",
    category: "analysis",
    estimatedTime: "~35s",
    fields: ["Income approach", "Market comps", "DCF model"],
  },
  {
    id: "covenant-compliance",
    icon: FileText,
    title: "Covenant Compliance Report",
    description: "Automated compliance check against all loan covenants, including debt ratios, DSCR, and LTV calculations across the portfolio.",
    category: "compliance",
    estimatedTime: "~20s",
    fields: ["Debt ratios", "DSCR calc", "LTV status"],
  },
];

const proactiveSuggestions = [
  {
    id: "sug-1",
    title: "Tower One Budget Needs Revision",
    reason: "Tenant count grew 40% since 2024, current budget doesn't reflect CAM revenue increase",
    template: "budget-revision",
    asset: "Tower One Office",
  },
  {
    id: "sug-2",
    title: "Logistics Rent Renegotiation Brief",
    reason: "Market rates are 12% above your current rental rates in the Lod corridor",
    template: "tenant-analysis",
    asset: "Mega Logistics Hub",
  },
  {
    id: "sug-3",
    title: "Retail Strategy Consolidation Plan",
    reason: "3 retail assets underperforming - consolidated strategy could recover $450K",
    template: "portfolio-performance",
    asset: "Retail Segment",
  },
];

export function GenerateScreen() {
  const [generating, setGenerating] = useState<string | null>(null);
  const [generated, setGenerated] = useState<Set<string>>(new Set());
  const [customPrompt, setCustomPrompt] = useState("");

  const handleGenerate = (id: string) => {
    setGenerating(id);
    setTimeout(() => {
      setGenerating(null);
      setGenerated((prev) => new Set(prev).add(id));
    }, 2500);
  };

  const handleCustomGenerate = () => {
    if (!customPrompt.trim()) return;
    setGenerating("custom");
    setTimeout(() => {
      setGenerating(null);
      setGenerated((prev) => new Set(prev).add("custom"));
      setCustomPrompt("");
    }, 3000);
  };

  return (
    <div className="flex flex-col gap-3 p-4 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-foreground">
            Generate Financial Files
          </h2>
          <p className="text-[11px] text-muted-foreground">
            AI-powered document generation from your data
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1">
          <AmiioAiDisclaimerTrigger wrapChild>
            <Sparkles className="h-3 w-3 text-primary animate-ai-pulse" />
          </AmiioAiDisclaimerTrigger>
          <span className="text-[10px] font-medium text-primary">
            Amiio AI
          </span>
        </div>
      </div>

      {/* Custom prompt */}
      <div className="rounded-lg border border-border bg-card p-3">
        <p className="mb-2 text-[11px] font-semibold text-foreground">
          Custom Request
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder={'e.g. "Generate Q3 board report for logistics segment"'}
            className="flex-1 rounded-md border border-border bg-background px-2.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/20"
            onKeyDown={(e) => e.key === "Enter" && handleCustomGenerate()}
          />
          <AmiioAiDisclaimerTrigger>
            <button
              type="button"
              onClick={handleCustomGenerate}
              disabled={!customPrompt.trim() || generating === "custom"}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold transition-colors",
                customPrompt.trim() && generating !== "custom"
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-secondary text-muted-foreground"
              )}
            >
              {generating === "custom" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )}
              Generate
            </button>
          </AmiioAiDisclaimerTrigger>
        </div>
        {generated.has("custom") && (
          <div className="mt-2 flex items-center gap-2 rounded-md border border-accent/20 bg-accent/5 px-2.5 py-1.5">
            <FileSpreadsheet className="h-3.5 w-3.5 text-accent" />
            <span className="flex-1 text-[11px] font-medium text-foreground">
              Custom_Report_2026.xlsx
            </span>
            <button type="button" className="text-accent hover:text-accent/80">
              <Download className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Proactive Suggestions */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <AmiioAiDisclaimerTrigger wrapChild>
            <Sparkles className="h-3.5 w-3.5 text-accent" />
          </AmiioAiDisclaimerTrigger>
          <h3 className="text-xs font-semibold text-foreground">
            Suggested by Amiio
          </h3>
          <span className="rounded-full bg-accent/10 px-1.5 py-0.5 text-[9px] font-bold text-accent">
            Based on your data
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {proactiveSuggestions.map((sug) => {
            const isGenerating = generating === sug.id;
            const isGenerated = generated.has(sug.id);
            return (
              <div
                key={sug.id}
                className="rounded-lg border border-accent/20 bg-accent/5 p-2.5 transition-all hover:border-accent/40"
              >
                <div className="flex items-start gap-2">
                  <AmiioAiDisclaimerTrigger
                    wrapChild
                    wrapperClassName="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-accent/10"
                  >
                    <Sparkles className="h-3 w-3 text-accent" />
                  </AmiioAiDisclaimerTrigger>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold text-foreground">{sug.title}</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">{sug.reason}</p>
                    <p className="mt-0.5 text-[9px] text-accent">Asset: {sug.asset}</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleGenerate(sug.id)}
                    disabled={isGenerating || isGenerated}
                    className={cn(
                      "flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[10px] font-semibold transition-colors",
                      isGenerated
                        ? "bg-accent/10 text-accent"
                        : isGenerating
                          ? "bg-primary/10 text-primary"
                          : "bg-accent text-accent-foreground hover:bg-accent/90"
                    )}
                  >
                    {isGenerated ? (
                      <>
                        <Check className="h-3 w-3" />
                        Generated
                      </>
                    ) : isGenerating ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileSpreadsheet className="h-3 w-3" />
                        Generate Now
                      </>
                    )}
                  </button>
                  {isGenerated && (
                    <button
                      type="button"
                      className="flex items-center gap-1 rounded-md border border-border bg-transparent px-2 py-1.5 text-[10px] text-muted-foreground hover:bg-secondary"
                    >
                      <Download className="h-3 w-3" />
                      Download
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Templates */}
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          File Templates
        </h3>
        <div className="flex flex-col gap-2">
          {templates.map((template) => {
            const Icon = template.icon;
            const isGenerating = generating === template.id;
            const isGenerated = generated.has(template.id);
            return (
              <div
                key={template.id}
                className="rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/20"
              >
                <div className="flex items-start gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-foreground">
                        {template.title}
                      </p>
                      <span className="flex items-center gap-0.5 text-[9px] text-muted-foreground">
                        <Clock className="h-2.5 w-2.5" />
                        {template.estimatedTime}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[10px] text-muted-foreground leading-relaxed">
                      {template.description}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {template.fields.map((field) => (
                        <span
                          key={field}
                          className="rounded bg-secondary px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground"
                        >
                          {field}
                        </span>
                      ))}
                    </div>
                    <div className="mt-2 flex items-center gap-1.5">
                      <AmiioAiDisclaimerTrigger>
                        <button
                          type="button"
                          onClick={() => handleGenerate(template.id)}
                          disabled={isGenerating || isGenerated}
                          className={cn(
                            "flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[10px] font-semibold transition-colors",
                            isGenerated
                              ? "bg-accent/10 text-accent"
                              : isGenerating
                                ? "bg-primary/10 text-primary"
                                : "bg-primary text-primary-foreground hover:bg-primary/90"
                          )}
                        >
                          {isGenerated ? (
                            <>
                              <Check className="h-3 w-3" />
                              Ready
                            </>
                          ) : isGenerating ? (
                            <>
                              <Loader2 className="h-3 w-3 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-3 w-3" />
                              Generate
                            </>
                          )}
                        </button>
                      </AmiioAiDisclaimerTrigger>
                      {isGenerated && (
                        <button
                          type="button"
                          className="flex items-center gap-1 rounded-md border border-border bg-transparent px-2 py-1.5 text-[10px] text-muted-foreground hover:bg-secondary"
                        >
                          <Download className="h-3 w-3" />
                          Download .xlsx
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
