/**
 * Secondary surfaces CONTENT translations (Insights dashboard, workflows catalog,
 * financial sub-panels). Keys are the English source strings.
 */
export const secondaryHe: Record<string, string> = {
  // --- Insights dashboard (INSIGHTS_SEED) ---
  // Titles (proper nouns like "Z C.V." / "X Ltd" stay English)
  "Rental income decrease": "ירידה בהכנסות משכירות",
  "Expenses increase (general)": "עלייה בהוצאות (כללי)",
  "OPEX trend": "מגמת OPEX",
  "Service Charges discrepancy": "אי-התאמה בדמי ניהול",
  "Expense increase (Z C.V.)": "עלייה בהוצאות (Z C.V.)",
  "Delayed payment tenant X Ltd": "תשלום באיחור של השוכר X Ltd",
  "Vacancy spike — logistics cluster": "זינוק בשטחים פנויים — אשכול לוגיסטי",
  "Rent indexation batch due Q1": "מנת הצמדת שכר דירה לביצוע ברבעון הראשון",
  // Subtitles
  "Decrease of 5% with minimum of €3.000": "ירידה של 5% עם מינימום של €3.000",
  "Increase of 5% with minimum of €3.000": "עלייה של 5% עם מינימום של €3.000",
  "Consecutive months of OPEX Increase": "חודשים רצופים של עלייה ב-OPEX",
  "10% YTD gap between advances and expenses":
    "פער של 10% מתחילת השנה בין מקדמות להוצאות",
  "Any increase in expenses for Z C.V.": "כל עלייה בהוצאות עבור Z C.V.",
  "Notification of any late payment of tenant X Ltd":
    "התראה על כל תשלום באיחור של השוכר X Ltd",
  "Portfolio vacancy 2.1pp above threshold on three assets":
    "שיעור השטחים הפנויים בתיק גבוה ב-2.1 נק׳ אחוז מהסף בשלושה נכסים",
  "Twelve leases eligible — model c. €180K indexed rent uplift":
    "שנים-עשר חוזי שכירות זכאים — מודל של כ-€180K תוספת שכר דירה מוצמד",
  // Tags (chrome already owns "Financial" / "Commercial")
  "P&L": "רווח והפסד",
  "Service Charge": "דמי ניהול",
  General: "כללי",
  Occupancy: "תפוסה",
  Leasing: "השכרה",
  // Updated / triggered labels (prefix "עודכן " is stripped on the Triggered column)
  "Updated 1 hour ago": "עודכן לפני שעה",
  "Updated 2 hours ago": "עודכן לפני שעתיים",
  "Updated 1 sec ago": "עודכן לפני שנייה",
  "Updated on 20 Aug 2025": "עודכן ב-20 באוג׳ 2025",
  "Updated on 10 Aug 2025": "עודכן ב-10 באוג׳ 2025",
  "Updated on 30 Jul 2025": "עודכן ב-30 ביולי 2025",
  "Updated 4 hours ago": "עודכן לפני 4 שעות",
  "Updated 6 hours ago": "עודכן לפני 6 שעות",

  // --- Workflows catalog ---
  "Lease Renewal": "חידוש חוזה שכירות",
  "Helps you prepare, draft, and review renewal proposals for selected tenants.":
    "עוזר לכם להכין, לנסח ולבדוק הצעות חידוש עבור שוכרים נבחרים.",
  "Service Charge Settlement": "התחשבנות דמי ניהול",
  "Validate postings, confirm assumptions, and generate an interactive service charge settlement.":
    "אימות רישומים, אישור הנחות עבודה והפקת התחשבנות דמי ניהול אינטראקטיבית.",
  "Market Research": "מחקר שוק",
  "Analyze property performance, comps, and market trends across your portfolio.":
    "ניתוח ביצועי נכסים, עסקאות השוואה ומגמות שוק בכל התיק שלכם.",
  "Financial Forecasting": "חיזוי פיננסי",
  "Forecast cash flows, rank assets by risk, and model scenario outcomes.":
    "חיזוי תזרימי מזומנים, דירוג נכסים לפי סיכון ומידול תוצאות תרחישים.",
  "Track sustainability metrics, compliance, and ESG reporting for your assets.":
    "מעקב אחר מדדי קיימות, עמידה בדרישות ודיווח ESG עבור הנכסים שלכם.",

  // --- Financial dashboard sub-tab labels ("Financial Dashboard" lives in chrome) ---
  Overview: "סקירה כללית",
  "Debt Compliance": "עמידה בתנאי חוב",
  Budgeting: "תקצוב",
  "Capex & CF": "השקעות הון ותזרים",

  // --- Shared across financial sub-panels ---
  Actions: "פעולות",
  "Input Sources": "מקורות נתונים",
  "View all": "הצגת הכול",
  "Analyse with Amiio": "ניתוח עם Amiio",
  Budget: "תקציב",
  Spent: "הוצא",
  utilized: "מנוצל",
  complete: "הושלם",
  "Operating Expenses": "הוצאות תפעול",

  // --- Debt Compliance panel ---
  "All Covenants Compliant": "עמידה בכל אמות המידה הפיננסיות",
  "Covenant Summary": "סיכום אמות מידה פיננסיות",
  Compliant: "עומד בדרישות",
  "Loan Details": "פרטי הלוואה",
  "Facility Amount": "סכום המסגרת",
  "Outstanding Balance": "יתרה לתשלום",
  "Interest Rate": "שיעור ריבית",
  "Maturity Date": "מועד פירעון",
  "Next Payment": "התשלום הבא",
  "Payment Amount": "סכום התשלום",
  "Facility is senior secured on the portfolio with quarterly covenant testing. Stress DSCR under downside rent and rate scenarios in chat.":
    "המסגרת מובטחת בשעבוד בכיר על התיק עם בדיקת אמות מידה רבעונית. ניתן לבצע מבחני עקה ל-DSCR בתרחישי ירידה בשכר דירה ובריבית בצ'אט.",
  "Upcoming Debt Service Payments": "תשלומי שירות חוב קרובים",
  Date: "תאריך",
  Principal: "קרן",
  Interest: "ריבית",
  "Total Payment": "סך התשלום",
  "Balance After": "יתרה לאחר מכן",
  "Trailing twelve-month DSCR is comfortably above the facility floor. Amiio flags no near-term breach risk under base-case cashflow.":
    "ה-DSCR ל-12 החודשים האחרונים גבוה בנוחות מרצפת המסגרת. Amiio אינו מזהה סיכון הפרה בטווח הקרוב בתרחיש הבסיס.",
  "Current LTV reflects latest independent valuation and outstanding balance. Headroom remains versus covenant cap.":
    "ה-LTV הנוכחי משקף את השמאות העצמאית העדכנית ואת היתרה לתשלום. נותר מרווח ביטחון מול תקרת אמת המידה.",
  "Interest cover includes scheduled amortisation and floating-rate stress per facility definition.":
    "כיסוי הריבית כולל סילוקין מתוכנן ומבחן עקה לריבית משתנה בהתאם להגדרת המסגרת.",
  "Portfolio-weighted occupancy per lender reporting pack; excludes units under refurbishment per side letter.":
    "תפוסה משוקללת לתיק לפי חבילת הדיווח למלווה; אינה כוללת יחידות בשיפוץ בהתאם למכתב הנלווה.",
  "Bank Covenant Update": "עדכון אמות מידה בנקאיות",
  "Bank Call Transcript": "תמלול שיחת בנק",
  "AM Note: Refinancing": "הערת מנהל נכסים: מימון מחדש",
  "Latest covenant compliance letter from relationship bank confirming all tests passed for Q1 reporting.":
    "מכתב עמידה באמות מידה עדכני מהבנק המלווה המאשר שכל הבדיקות עברו לדיווח הרבעון הראשון.",
  "Transcript of quarterly lender call covering refi timeline and consent process for capex spend.":
    "תמלול שיחת המלווה הרבעונית הכולל לוח זמנים למימון מחדש ותהליך הסכמה להוצאות הון.",
  "Executed facility agreement including schedules for covenants, events of default, and reporting.":
    "הסכם מסגרת חתום הכולל נספחים לאמות מידה, אירועי כשל ומחויבות דיווח.",
  "Internal asset management memo on refinancing options and lender mapping for 2027 window.":
    "תזכיר פנימי של ניהול הנכסים על אפשרויות מימון מחדש ומיפוי מלווים לחלון 2027.",

  // --- Budgeting panel ---
  "Annual Budget": "תקציב שנתי",
  "YTD Actual": "ביצוע מתחילת השנה",
  "Remaining Budget": "תקציב שנותר",
  "Forecast Variance": "סטיית תחזית",
  "+0.04% vs budget": "+0.04% מול התקציב",
  "75% remaining": "75% נותרו",
  "0.7% favorable": "0.7% לטובה",
  "Budget vs Actual by Category": "תקציב מול ביצוע לפי קטגוריה",
  "Rental Income": "הכנסות משכירות",
  "Service Charges": "דמי ניהול",
  "Capital Expenditure": "הוצאות הוניות",
  "Rental income is tracking in line with FY profile after indexation and one short vacancy in Q1. Amiio can stress renewal probability for the top three expiries.":
    "הכנסות השכירות נעות בהתאם לפרופיל השנתי לאחר הצמדה ותקופת פינוי קצרה ברבעון הראשון. Amiio יכול לבצע מבחן עקה להסתברות החידוש של שלושת החוזים הפגים המובילים.",
  "Service charge recovery is slightly ahead of seasonal curve due to utilities true-up invoices posted early.":
    "גביית דמי הניהול מקדימה מעט את העקומה העונתית בשל חשבוניות התחשבנות שירותים שנרשמו מוקדם.",
  "OPEX reflects property management fees and insurance renewals; no material one-offs flagged versus budget phasing.":
    "ה-OPEX משקף דמי ניהול נכסים וחידושי ביטוח; לא זוהו חריגות מהותיות חד-פעמיות מול שלבי התקציב.",
  "No capex drawdowns booked yet; approved projects are scheduled from Q2. Monitor commitment timing vs covenant reporting.":
    "טרם נרשמו משיכות הון; הפרויקטים המאושרים מתוכננים מהרבעון השני. יש לעקוב אחר עיתוי ההתחייבויות מול דיווח אמות המידה.",
  "Monthly Budget Tracking": "מעקב תקציב חודשי",
  "Save Budget": "שמירת תקציב",
  "Edit Budget": "עריכת תקציב",
  Month: "חודש",
  Actual: "ביצוע",
  Variance: "סטייה",
  Complete: "הושלם",
  Pending: "ממתין",
  "Budget Approval": "אישור תקציב",
  "AM Note: Q1 Review": "הערת מנהל נכסים: סקירת רבעון ראשון",
  "PM Budget Meeting": "פגישת תקציב עם מנהל הנכס",
  "Board-approved FY 2026 budget workbook with phasing by cost centre and property.":
    "חוברת תקציב לשנת 2026 שאושרה בדירקטוריון עם פריסה לפי מרכז עלות ונכס.",
  "Email chain confirming IC sign-off and variance thresholds for quarterly reforecast.":
    "שרשור דוא\"ל המאשר את אישור ועדת ההשקעות ואת ספי הסטייה לתחזית הרבעונית.",
  "Asset management narrative on Q1 performance vs budget and drivers for the next reforecast.":
    "סקירת ניהול נכסים על ביצועי הרבעון הראשון מול התקציב והגורמים לתחזית הבאה.",
  "Notes from property management budget alignment — opex and capex timing for H1.":
    "סיכום פגישת תיאום התקציב עם ניהול הנכס — עיתוי הוצאות תפעול והון למחצית הראשונה.",

  // --- Capex & CF panel ---
  "Total Capex Budget": "סך תקציב השקעות הון",
  "Spent YTD": "הוצא מתחילת השנה",
  "Net Cash Flow YTD": "תזרים מזומנים נקי מתחילת השנה",
  "Cash Reserve": "רזרבת מזומנים",
  "63% utilized": "63% מנוצל",
  "3.2 months coverage": "כיסוי ל-3.2 חודשים",
  "Capital Expenditure Projects": "פרויקטי השקעות הון",
  "Cash Flow Projection": "תחזית תזרים מזומנים",
  "Cash Flow Statement - Q1 2026": "דוח תזרים מזומנים - רבעון ראשון 2026",
  "HVAC System Upgrade": "שדרוג מערכת HVAC",
  "Lobby Renovation": "שיפוץ הלובי",
  "Roof Repairs": "תיקוני גג",
  "Energy Efficiency (LED)": "התייעלות אנרגטית (LED)",
  "Main contractor completed plant-room replacement and controls integration is underway. Delivery on track for June handover.":
    "הקבלן הראשי השלים את החלפת חדר המכונות ושילוב הבקרה בעיצומו. המסירה בלוח הזמנים למועד המסירה ביוני.",
  "Work package closed and signed off. Spend finalized at budget with no change orders.":
    "חבילת העבודה נסגרה ואושרה. ההוצאה הסופית עמדה בתקציב ללא שינויי הזמנה.",
  "Phase one patching complete. Remaining works depend on weather windows in Q2.":
    "שלב הטלאי הראשון הושלם. העבודות הנותרות תלויות בחלונות מזג אוויר ברבעון השני.",
  "Procurement list prepared; installation starts after tenant coordination in April.":
    "רשימת הרכש הוכנה; ההתקנה מתחילה לאחר תיאום עם השוכרים באפריל.",
  Completed: "הושלם",
  "In Progress": "בתהליך",
  Planned: "מתוכנן",
  "Cash Inflow": "תזרים נכנס",
  "Cash Outflow": "תזרים יוצא",
  Export: "ייצוא",
  Item: "פריט",
  "Q1 Total": "סך רבעון ראשון",
  "Operating Cash Inflow": "תזרים מזומנים תפעולי נכנס",
  "Debt Service": "שירות חוב",
  "Net Operating CF": "תזרים תפעולי נקי",
  "Capex Outflow": "תזרים יוצא להשקעות הון",
  "Net Cash Flow": "תזרים מזומנים נקי",
  "Contractor Invoice": "חשבונית קבלן",
  "AM Note: Roof Repair": "הערת מנהל נכסים: תיקון גג",
  "PM Site Visit Notes": "סיכום ביקור מנהל הנכס באתר",
  "Vendor quote and scope schedule for HVAC replacement package.":
    "הצעת מחיר מספק ולוח היקף עבודה לחבילת החלפת ה-HVAC.",
  "Invoice batch for MEP progress payment and associated retention.":
    "אצוות חשבוניות לתשלום התקדמות מערכות (MEP) ולעיכבון הנלווה.",
  "Asset manager note on roof contractor sequencing and budget contingency.":
    "הערת מנהל הנכסים על רצף עבודת קבלן הגג ורזרבת התקציב.",
  "Site walk summary covering punch list, safety actions, and next milestones.":
    "סיכום סיור באתר הכולל רשימת תיקונים, פעולות בטיחות ואבני דרך הבאות.",
};

export const secondaryNl: Record<string, string> = {
  // --- Insights dashboard (INSIGHTS_SEED) ---
  "Rental income decrease": "Daling huurinkomsten",
  "Expenses increase (general)": "Stijging uitgaven (algemeen)",
  "OPEX trend": "OPEX-trend",
  "Service Charges discrepancy": "Discrepantie servicekosten",
  "Expense increase (Z C.V.)": "Uitgavenstijging (Z C.V.)",
  "Delayed payment tenant X Ltd": "Betalingsachterstand huurder X Ltd",
  "Vacancy spike — logistics cluster": "Piek in leegstand — logistiek cluster",
  "Rent indexation batch due Q1": "Batch huurindexatie te verwerken in Q1",
  "Decrease of 5% with minimum of €3.000": "Daling van 5% met een minimum van €3.000",
  "Increase of 5% with minimum of €3.000": "Stijging van 5% met een minimum van €3.000",
  "Consecutive months of OPEX Increase": "Opeenvolgende maanden met OPEX-stijging",
  "10% YTD gap between advances and expenses":
    "10% YTD-verschil tussen voorschotten en uitgaven",
  "Any increase in expenses for Z C.V.": "Elke stijging van de uitgaven voor Z C.V.",
  "Notification of any late payment of tenant X Ltd":
    "Melding van elke late betaling van huurder X Ltd",
  "Portfolio vacancy 2.1pp above threshold on three assets":
    "Portefeuilleleegstand 2,1 procentpunt boven drempel bij drie objecten",
  "Twelve leases eligible — model c. €180K indexed rent uplift":
    "Twaalf huurcontracten in aanmerking — model ca. €180K geïndexeerde huurstijging",
  "P&L": "W&V",
  "Service Charge": "Servicekosten",
  General: "Algemeen",
  Occupancy: "Bezetting",
  Leasing: "Verhuur",
  "Updated 1 hour ago": "Bijgewerkt 1 uur geleden",
  "Updated 2 hours ago": "Bijgewerkt 2 uur geleden",
  "Updated 1 sec ago": "Bijgewerkt 1 sec geleden",
  "Updated on 20 Aug 2025": "Bijgewerkt op 20 aug 2025",
  "Updated on 10 Aug 2025": "Bijgewerkt op 10 aug 2025",
  "Updated on 30 Jul 2025": "Bijgewerkt op 30 jul 2025",
  "Updated 4 hours ago": "Bijgewerkt 4 uur geleden",
  "Updated 6 hours ago": "Bijgewerkt 6 uur geleden",

  // --- Workflows catalog ---
  "Lease Renewal": "Huurverlenging",
  "Helps you prepare, draft, and review renewal proposals for selected tenants.":
    "Helpt je bij het voorbereiden, opstellen en beoordelen van verlengingsvoorstellen voor geselecteerde huurders.",
  "Service Charge Settlement": "Afrekening servicekosten",
  "Validate postings, confirm assumptions, and generate an interactive service charge settlement.":
    "Valideer boekingen, bevestig aannames en genereer een interactieve afrekening van servicekosten.",
  "Market Research": "Marktonderzoek",
  "Analyze property performance, comps, and market trends across your portfolio.":
    "Analyseer objectprestaties, referentietransacties en markttrends binnen je portefeuille.",
  "Financial Forecasting": "Financiële prognose",
  "Forecast cash flows, rank assets by risk, and model scenario outcomes.":
    "Prognosticeer kasstromen, rangschik objecten op risico en modelleer scenario-uitkomsten.",
  "Track sustainability metrics, compliance, and ESG reporting for your assets.":
    "Volg duurzaamheidsindicatoren, compliance en ESG-rapportage voor je objecten.",

  // --- Financial dashboard sub-tab labels ---
  Overview: "Overzicht",
  "Debt Compliance": "Naleving convenanten",
  Budgeting: "Budgettering",
  "Capex & CF": "Capex & kasstroom",

  // --- Shared across financial sub-panels ---
  Actions: "Acties",
  "Input Sources": "Inputbronnen",
  "View all": "Alles weergeven",
  "Analyse with Amiio": "Analyseren met Amiio",
  Budget: "Budget",
  Spent: "Besteed",
  utilized: "benut",
  complete: "voltooid",
  "Operating Expenses": "Operationele uitgaven",

  // --- Debt Compliance panel ---
  "All Covenants Compliant": "Alle convenanten nageleefd",
  "Covenant Summary": "Samenvatting convenanten",
  Compliant: "Nageleefd",
  "Loan Details": "Leninggegevens",
  "Facility Amount": "Faciliteitsbedrag",
  "Outstanding Balance": "Openstaand saldo",
  "Interest Rate": "Rentepercentage",
  "Maturity Date": "Vervaldatum",
  "Next Payment": "Volgende betaling",
  "Payment Amount": "Betalingsbedrag",
  "Facility is senior secured on the portfolio with quarterly covenant testing. Stress DSCR under downside rent and rate scenarios in chat.":
    "De faciliteit is senior gedekt op de portefeuille met driemaandelijkse convenanttoetsing. Stress de DSCR onder neerwaartse huur- en rentescenario's in de chat.",
  "Upcoming Debt Service Payments": "Aankomende schulddienstbetalingen",
  Date: "Datum",
  Principal: "Hoofdsom",
  Interest: "Rente",
  "Total Payment": "Totale betaling",
  "Balance After": "Saldo daarna",
  "Trailing twelve-month DSCR is comfortably above the facility floor. Amiio flags no near-term breach risk under base-case cashflow.":
    "De DSCR over de laatste twaalf maanden ligt ruim boven de ondergrens van de faciliteit. Amiio signaleert geen breukrisico op korte termijn in het basisscenario.",
  "Current LTV reflects latest independent valuation and outstanding balance. Headroom remains versus covenant cap.":
    "De huidige LTV weerspiegelt de meest recente onafhankelijke taxatie en het openstaande saldo. Er blijft marge ten opzichte van de convenantgrens.",
  "Interest cover includes scheduled amortisation and floating-rate stress per facility definition.":
    "De rentedekking omvat geplande aflossing en een stress op variabele rente conform de faciliteitsdefinitie.",
  "Portfolio-weighted occupancy per lender reporting pack; excludes units under refurbishment per side letter.":
    "Portefeuillegewogen bezetting volgens het rapportagepakket van de kredietverstrekker; exclusief units in renovatie conform side letter.",
  "Bank Covenant Update": "Update bankconvenanten",
  "Bank Call Transcript": "Transcript bankgesprek",
  "AM Note: Refinancing": "AM-notitie: Herfinanciering",
  "Latest covenant compliance letter from relationship bank confirming all tests passed for Q1 reporting.":
    "Meest recente convenantnalevingsbrief van de huisbank die bevestigt dat alle toetsen zijn geslaagd voor de Q1-rapportage.",
  "Transcript of quarterly lender call covering refi timeline and consent process for capex spend.":
    "Transcript van het driemaandelijkse gesprek met de kredietverstrekker over de herfinancieringstijdlijn en het goedkeuringsproces voor capex-uitgaven.",
  "Executed facility agreement including schedules for covenants, events of default, and reporting.":
    "Ondertekende faciliteitsovereenkomst inclusief bijlagen voor convenanten, events of default en rapportage.",
  "Internal asset management memo on refinancing options and lender mapping for 2027 window.":
    "Interne assetmanagementmemo over herfinancieringsopties en kredietverstrekkersoverzicht voor het venster van 2027.",

  // --- Budgeting panel ---
  "Annual Budget": "Jaarbudget",
  "YTD Actual": "Werkelijk YTD",
  "Remaining Budget": "Resterend budget",
  "Forecast Variance": "Prognoseverschil",
  "+0.04% vs budget": "+0,04% t.o.v. budget",
  "75% remaining": "75% resterend",
  "0.7% favorable": "0,7% gunstig",
  "Budget vs Actual by Category": "Budget versus werkelijk per categorie",
  "Rental Income": "Huurinkomsten",
  "Service Charges": "Servicekosten",
  "Capital Expenditure": "Kapitaaluitgaven",
  "Rental income is tracking in line with FY profile after indexation and one short vacancy in Q1. Amiio can stress renewal probability for the top three expiries.":
    "De huurinkomsten lopen in lijn met het FY-profiel na indexatie en één korte leegstand in Q1. Amiio kan de verlengingskans van de top drie afloopdata stressen.",
  "Service charge recovery is slightly ahead of seasonal curve due to utilities true-up invoices posted early.":
    "De inning van servicekosten loopt iets voor op de seizoenscurve door vroeg geboekte afrekeningsfacturen voor nutsvoorzieningen.",
  "OPEX reflects property management fees and insurance renewals; no material one-offs flagged versus budget phasing.":
    "OPEX weerspiegelt beheerkosten en verzekeringsverlengingen; geen materiële eenmalige posten gesignaleerd ten opzichte van de budgetfasering.",
  "No capex drawdowns booked yet; approved projects are scheduled from Q2. Monitor commitment timing vs covenant reporting.":
    "Nog geen capex-opnames geboekt; goedgekeurde projecten staan gepland vanaf Q2. Bewaak de timing van verplichtingen ten opzichte van de convenantrapportage.",
  "Monthly Budget Tracking": "Maandelijkse budgetbewaking",
  "Save Budget": "Budget opslaan",
  "Edit Budget": "Budget bewerken",
  Month: "Maand",
  Actual: "Werkelijk",
  Variance: "Verschil",
  Complete: "Voltooid",
  Pending: "In afwachting",
  "Budget Approval": "Budgetgoedkeuring",
  "AM Note: Q1 Review": "AM-notitie: Q1-review",
  "PM Budget Meeting": "PM-budgetoverleg",
  "Board-approved FY 2026 budget workbook with phasing by cost centre and property.":
    "Door het bestuur goedgekeurd FY 2026-budgetwerkboek met fasering per kostenplaats en object.",
  "Email chain confirming IC sign-off and variance thresholds for quarterly reforecast.":
    "E-mailketen die de goedkeuring door het IC en de verschildrempels voor de driemaandelijkse herprognose bevestigt.",
  "Asset management narrative on Q1 performance vs budget and drivers for the next reforecast.":
    "Assetmanagementtoelichting op de Q1-prestaties ten opzichte van budget en de drivers voor de volgende herprognose.",
  "Notes from property management budget alignment — opex and capex timing for H1.":
    "Notities van de budgetafstemming met het vastgoedbeheer — timing van opex en capex voor H1.",

  // --- Capex & CF panel ---
  "Total Capex Budget": "Totaal capexbudget",
  "Spent YTD": "Besteed YTD",
  "Net Cash Flow YTD": "Netto kasstroom YTD",
  "Cash Reserve": "Kasreserve",
  "63% utilized": "63% benut",
  "3.2 months coverage": "3,2 maanden dekking",
  "Capital Expenditure Projects": "Kapitaaluitgavenprojecten",
  "Cash Flow Projection": "Kasstroomprognose",
  "Cash Flow Statement - Q1 2026": "Kasstroomoverzicht - Q1 2026",
  "HVAC System Upgrade": "Upgrade HVAC-systeem",
  "Lobby Renovation": "Renovatie lobby",
  "Roof Repairs": "Dakreparaties",
  "Energy Efficiency (LED)": "Energie-efficiëntie (LED)",
  "Main contractor completed plant-room replacement and controls integration is underway. Delivery on track for June handover.":
    "De hoofdaannemer heeft de vervanging van de technische ruimte afgerond en de integratie van de besturing is gaande. Oplevering op schema voor overdracht in juni.",
  "Work package closed and signed off. Spend finalized at budget with no change orders.":
    "Werkpakket afgesloten en goedgekeurd. Besteding definitief binnen budget zonder meerwerk.",
  "Phase one patching complete. Remaining works depend on weather windows in Q2.":
    "Eerste fase van het herstel is afgerond. Resterende werkzaamheden zijn afhankelijk van weersvensters in Q2.",
  "Procurement list prepared; installation starts after tenant coordination in April.":
    "Inkooplijst opgesteld; installatie start na afstemming met huurders in april.",
  Completed: "Voltooid",
  "In Progress": "In uitvoering",
  Planned: "Gepland",
  "Cash Inflow": "Kasinstroom",
  "Cash Outflow": "Kasuitstroom",
  Export: "Exporteren",
  Item: "Post",
  "Q1 Total": "Q1-totaal",
  "Operating Cash Inflow": "Operationele kasinstroom",
  "Debt Service": "Schulddienst",
  "Net Operating CF": "Netto operationele kasstroom",
  "Capex Outflow": "Capex-uitstroom",
  "Net Cash Flow": "Netto kasstroom",
  "Contractor Invoice": "Aannemersfactuur",
  "AM Note: Roof Repair": "AM-notitie: Dakreparatie",
  "PM Site Visit Notes": "PM-notities locatiebezoek",
  "Vendor quote and scope schedule for HVAC replacement package.":
    "Offerte van leverancier en scope-schema voor het HVAC-vervangingspakket.",
  "Invoice batch for MEP progress payment and associated retention.":
    "Factuurbatch voor MEP-termijnbetaling en bijbehorende inhouding.",
  "Asset manager note on roof contractor sequencing and budget contingency.":
    "Notitie van de assetmanager over de fasering van de dakaannemer en de budgetreserve.",
  "Site walk summary covering punch list, safety actions, and next milestones.":
    "Samenvatting van de locatieronde met restpuntenlijst, veiligheidsacties en volgende mijlpalen.",
};
