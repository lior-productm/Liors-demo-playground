/**
 * AI Analysts CONTENT translations (analyst descriptions, templates, tasks, sources).
 * Keys are the English source strings. Proper nouns (entity/property/tenant/people names) stay English.
 */
export const analystsHe: Record<string, string> = {
  /* ---------------------------------------------------------------- */
  /*  Analyst titles + short names                                    */
  /* ---------------------------------------------------------------- */
  "Financial Analyst": "אנליסט פיננסי",
  "Commercial Analyst": "אנליסט מסחרי",
  "Technical Analyst": "אנליסט טכני",
  "Debt Analyst": "אנליסט חוב",
  "Service Charges Analyst": "אנליסט דמי ניהול",
  // "Financial" / "Commercial" short names live in the chrome dictionary.
  Technical: "טכני",
  Debt: "חוב",
  "Service Charges": "דמי ניהול",

  /* ---------------------------------------------------------------- */
  /*  Analyst descriptions                                            */
  /* ---------------------------------------------------------------- */
  "Analyzes financial performance across assets and portfolios, explains budget variances, and highlights what is driving NOI, income, expenses, and returns.":
    "מנתח ביצועים פיננסיים על פני נכסים ותיקים, מסביר סטיות מהתקציב, ומדגיש מה מניע את ה-NOI, ההכנסות, ההוצאות והתשואות.",
  "Reviews commercial performance, tenant exposure, occupancy movements, rent roll trends, and leasing activity to identify risks and opportunities.":
    "בוחן ביצועים מסחריים, חשיפה לשוכרים, שינויים בתפוסה, מגמות ברשימת השכירות ופעילות השכרה כדי לזהות סיכונים והזדמנויות.",
  "Supports building & facilities operations — maintenance, work orders, CapEx planning, and building systems performance across the portfolio.":
    "תומך בתפעול המבנים והמתקנים — תחזוקה, הזמנות עבודה, תכנון CapEx וביצועי מערכות הבניין על פני התיק.",
  "Tracks debt exposure, maturities, covenants, refinancing risks, interest costs, and debt performance across the portfolio.":
    "עוקב אחר חשיפת החוב, מועדי הפירעון, הקובננטים, סיכוני המימון מחדש, עלויות הריבית וביצועי החוב על פני התיק.",
  "Reconciles service charge costs against tenant advances, tracks cost developments per m², and prepares annual settlements ready for review.":
    "מתאם בין עלויות דמי הניהול לבין מקדמות השוכרים, עוקב אחר התפתחות העלויות למ״ר, ומכין התחשבנויות שנתיות המוכנות לבדיקה.",

  /* ---------------------------------------------------------------- */
  /*  Template-example-only chips (not full template names)           */
  /* ---------------------------------------------------------------- */
  "Tenant Signals": "איתותי שוכרים",
  "Compliance Monitoring": "ניטור ציות",

  /* ---------------------------------------------------------------- */
  /*  Template names                                                  */
  /* ---------------------------------------------------------------- */
  "Monthly Closing Review": "סקירת סגירה חודשית",
  "Anomaly Detection": "זיהוי חריגות",
  "AR Monitoring": "ניטור חייבים",
  "Budget vs. Actuals": "תקציב מול ביצוע",
  "Annual Budgeting": "תקצוב שנתי",
  "Capex / Cashflow": "השקעות הון / תזרים מזומנים",
  "Upcoming Expiry Watchlist": "רשימת מעקב לפקיעות קרובות",
  "Tenant Satisfaction Signals": "איתותי שביעות רצון שוכרים",
  "External Tenant Signals": "איתותי שוכרים חיצוניים",
  "Vacancy Monitoring": "ניטור שטחים פנויים",
  "Technical Compliance Monitoring": "ניטור ציות טכני",
  "Work Order Summary": "סיכום הזמנות עבודה",
  "CapEx Planning": "תכנון CapEx",
  "Maintenance Alerts": "התראות תחזוקה",
  "Covenant Monitoring": "ניטור קובננטים",
  "Maturity Calendar": "לוח מועדי פירעון",
  "Refinancing Risk": "סיכון מימון מחדש",
  "Interest Cost Review": "סקירת עלויות ריבית",
  "Service Charge Settlement": "התחשבנות דמי ניהול",
  "Service Charge Monitoring": "ניטור דמי ניהול",
  "Advance Reconciliation": "התאמת מקדמות",
  "Cost Trend Analysis": "ניתוח מגמות עלויות",

  /* ---------------------------------------------------------------- */
  /*  Template descriptions                                           */
  /* ---------------------------------------------------------------- */
  "Reviews monthly figures against expectations, flags anomalies and missing entries, and highlights what needs attention before you close the books.":
    "בוחן את הנתונים החודשיים מול הציפיות, מסמן חריגות ורישומים חסרים, ומדגיש למה צריך לשים לב לפני סגירת הספרים.",
  "Amiio flags duplicates, unusual amounts and wrong allocations in your financial postings before they affect your figures.":
    "Amiio מסמן כפילויות, סכומים חריגים והקצאות שגויות ברישומים הפיננסיים שלך לפני שהם משפיעים על הנתונים.",
  "Track accounts receivable and arrears per tenant and flag overdue balances.":
    "עקוב אחר חייבים ופיגורים לכל שוכר וסמן יתרות באיחור.",
  "Compare actuals against budget and explain the variances across the portfolio.":
    "השווה בין הביצוע בפועל לתקציב והסבר את הסטיות על פני התיק.",
  "Prepare the annual budget per property using prior-year actuals and assumptions.":
    "הכן את התקציב השנתי לכל נכס על בסיס ביצועי השנה הקודמת והנחות.",
  "Monitor capital expenditure and cashflow across the portfolio on a weekly basis.":
    "נטר את השקעות ההון ותזרים המזומנים על פני התיק על בסיס שבועי.",
  "Monitors leases expiring within a chosen scope and summarizes tenants entering the renewal window, incl. WAULT impact and current vs. market indexation.":
    "מנטר חוזי שכירות הפוקעים בתחום הנבחר ומסכם את השוכרים הנכנסים לחלון החידוש, כולל השפעת ה-WAULT והשוואת האינדקסציה הנוכחית לשוק.",
  "Reads every service request and work order, analyzes tone and sentiment, and flags tenants showing signs of frustration before it turns into a non-renewal.":
    "קורא כל פנייה לשירות והזמנת עבודה, מנתח את הטון והסנטימנט, ומסמן שוכרים המגלים סימני תסכול לפני שהדבר הופך לאי-חידוש.",
  "Scans public online sources for tenant developments — bankruptcy filings, restructurings, expansions, acquisitions — that matter for your assets.":
    "סורק מקורות מקוונים פומביים אחר התפתחויות אצל שוכרים — בקשות פשיטת רגל, הבראות, הרחבות ורכישות — הרלוונטיות לנכסים שלך.",
  "Tracks every vacant unit, monitors days-on-market and letting progress against targets, and flags units that are stalling.":
    "עוקב אחר כל יחידה פנויה, מנטר את ימי החשיפה בשוק ואת התקדמות ההשכרה מול היעדים, ומסמן יחידות שתקועות.",
  "Tracks all technical certifications across your assets — from elevator inspections to energy labels — and flags upcoming renewals well before they expire.":
    "עוקב אחר כל האישורים הטכניים בנכסים שלך — ממבדקי מעליות ועד תוויות אנרגיה — ומסמן חידושים קרבים הרבה לפני שהם פוקעים.",
  "Summarizes open work orders, aging tickets, and operational bottlenecks across the selected scope.":
    "מסכם הזמנות עבודה פתוחות, קריאות מתיישנות וצווארי בקבוק תפעוליים בתחום הנבחר.",
  "Surfaces CapEx priorities, planned projects, and spend risk by asset so budgets stay on plan.":
    "מציף עדיפויות CapEx, פרויקטים מתוכננים וסיכון הוצאה לפי נכס כדי שהתקציבים יישארו במסלול.",
  "Flags overdue maintenance and building systems that need attention soon.":
    "מסמן תחזוקה באיחור ומערכות בניין הזקוקות לטיפול בקרוב.",
  "Monitors debt covenants against live portfolio data and documentation, flagging headroom changes and potential breaches before they become problems.":
    "מנטר קובננטים של חוב מול נתוני התיק והתיעוד בזמן אמת, ומסמן שינויים במרווח הביטחון והפרות אפשריות לפני שהן הופכות לבעיה.",
  "Surfaces upcoming debt maturities and refinancing windows across the book so nothing catches you by surprise.":
    "מציף מועדי פירעון חוב קרבים וחלונות מימון מחדש על פני התיק כדי ששום דבר לא יפתיע אותך.",
  "Assesses refinancing risk, rate exposure, and lender concentration across your facilities.":
    "מעריך סיכון מימון מחדש, חשיפה לריבית וריכוזיות מלווים על פני מסגרות האשראי שלך.",
  "Summarizes interest costs and what is driving changes in debt service, ICR, and DSCR.":
    "מסכם את עלויות הריבית ואת הגורמים לשינויים בשירות החוב, ב-ICR וב-DSCR.",
  "Reconciles actual costs against advances paid, allocates them across tenants, and prepares annual settlements — with full flexibility to adjust before finalizing.":
    "מתאם בין העלויות בפועל למקדמות ששולמו, מקצה אותן בין השוכרים, ומכין התחשבנויות שנתיות — עם גמישות מלאה להתאמה לפני הסופיות.",
  "Continuously tracks actual service charge costs against tenant advances and analyzes cost developments per m², flagging overruns while there's still time to act.":
    "עוקב באופן רציף אחר עלויות דמי הניהול בפועל מול מקדמות השוכרים ומנתח את התפתחות העלויות למ״ר, ומסמן חריגות בעודו ניתן לפעול.",
  "Matches advance payments per tenant against actual ledgers and highlights under- or over-recovery early.":
    "מתאים את תשלומי המקדמה לכל שוכר מול הספרים בפועל ומדגיש גבייה בחסר או ביתר בשלב מוקדם.",
  "Analyzes cost developments per m² and flags unusual trends across your assets.":
    "מנתח את התפתחות העלויות למ״ר ומסמן מגמות חריגות על פני הנכסים שלך.",

  /* ---------------------------------------------------------------- */
  /*  Seed task descriptions                                          */
  /* ---------------------------------------------------------------- */
  "Scan ledgers for unusual transactions and surface anomalies for review.":
    "סרוק את הספרים לאיתור תנועות חריגות והצף חריגות לבדיקה.",
  "Review the monthly close and draft IC-ready commentary.":
    "סקור את הסגירה החודשית ונסח פרשנות מוכנה לוועדת ההשקעות.",
  "Monitors leases expiring within the portfolio and summarizes tenants entering the renewal window.":
    "מנטר חוזי שכירות הפוקעים בתיק ומסכם את השוכרים הנכנסים לחלון החידוש.",

  /* ---------------------------------------------------------------- */
  /*  Seed task + subtask instructions                                */
  /* ---------------------------------------------------------------- */
  "Flag any transaction that deviates more than 10% from the trailing three-month average and summarise the likely cause.":
    "סמן כל תנועה הסוטה ביותר מ-10% מהממוצע הנע של שלושת החודשים האחרונים וסכם את הסיבה הסבירה.",
  "Summarise the monthly close, highlight the three largest variances and draft commentary suitable for the investment committee.":
    "סכם את הסגירה החודשית, הדגש את שלוש הסטיות הגדולות ביותר ונסח פרשנות המתאימה לוועדת ההשקעות.",
  "Focus on leases expiring in the next 18 months and include the WAULT impact per entity.":
    "התמקד בחוזי שכירות הפוקעים ב-18 החודשים הקרובים וכלול את השפעת ה-WAULT לכל ישות.",
  "Pay special attention to service charge postings.":
    "שים לב במיוחד לרישומי דמי ניהול.",
  "Only review capex-related ledgers for this property.":
    "סקור רק ספרים הקשורים ל-CapEx עבור נכס זה.",

  /* ---------------------------------------------------------------- */
  /*  Subtask name (property name stays English, interpolated)        */
  /* ---------------------------------------------------------------- */
  "{name} anomalies": "חריגות ב-{name}",

  /* ---------------------------------------------------------------- */
  /*  Output names (month/week kept, task name translated)            */
  /* ---------------------------------------------------------------- */
  "Anomaly Detection — August": "זיהוי חריגות — אוגוסט",
  "Anomaly Detection — September": "זיהוי חריגות — ספטמבר",
  "Monthly Closing Review — August": "סקירת סגירה חודשית — אוגוסט",
  "Upcoming Expiry Watchlist — Week 32": "רשימת מעקב לפקיעות קרובות — שבוע 32",

  /* ---------------------------------------------------------------- */
  /*  Output summaries                                                */
  /* ---------------------------------------------------------------- */
  "2 anomalies flagged across 3 properties.": "סומנו 2 חריגות ב-3 נכסים.",
  "No anomalies above threshold this period.": "לא נמצאו חריגות מעל הסף בתקופה זו.",
  "Close complete. Three variances explained.": "הסגירה הושלמה. שלוש סטיות הוסברו.",
  "4 leases enter the renewal window this month.":
    "4 חוזי שכירות נכנסים לחלון החידוש החודש.",

  /* ---------------------------------------------------------------- */
  /*  Sources (the .pdf filename stays English via fallback)          */
  /* ---------------------------------------------------------------- */
  "Market benchmarks": "מדדי שוק",
  "Reporting guidelines": "הנחיות דיווח",
  "Always report figures in EUR thousands and round to one decimal place.":
    "דווח תמיד נתונים באלפי אירו ועגל לספרה עשרונית אחת.",
};

export const analystsNl: Record<string, string> = {
  /* ---------------------------------------------------------------- */
  /*  Analyst titles + short names                                    */
  /* ---------------------------------------------------------------- */
  "Financial Analyst": "Financieel analist",
  "Commercial Analyst": "Commercieel analist",
  "Technical Analyst": "Technisch analist",
  "Debt Analyst": "Schuldanalist",
  "Service Charges Analyst": "Servicekostenanalist",
  // "Financial" / "Commercial" short names live in the chrome dictionary.
  Technical: "Technisch",
  Debt: "Schuld",
  "Service Charges": "Servicekosten",

  /* ---------------------------------------------------------------- */
  /*  Analyst descriptions                                            */
  /* ---------------------------------------------------------------- */
  "Analyzes financial performance across assets and portfolios, explains budget variances, and highlights what is driving NOI, income, expenses, and returns.":
    "Analyseert de financiële prestaties van objecten en portefeuilles, verklaart budgetafwijkingen en laat zien wat de NOI, inkomsten, kosten en rendementen bepaalt.",
  "Reviews commercial performance, tenant exposure, occupancy movements, rent roll trends, and leasing activity to identify risks and opportunities.":
    "Beoordeelt de commerciële prestaties, huurdersblootstelling, bezettingsontwikkelingen, trends in de huurlijst en verhuuractiviteit om risico's en kansen te signaleren.",
  "Supports building & facilities operations — maintenance, work orders, CapEx planning, and building systems performance across the portfolio.":
    "Ondersteunt het beheer van gebouwen en faciliteiten — onderhoud, werkorders, CapEx-planning en de prestaties van gebouwsystemen binnen de portefeuille.",
  "Tracks debt exposure, maturities, covenants, refinancing risks, interest costs, and debt performance across the portfolio.":
    "Volgt de schuldblootstelling, looptijden, convenanten, herfinancieringsrisico's, rentelasten en schuldprestaties binnen de portefeuille.",
  "Reconciles service charge costs against tenant advances, tracks cost developments per m², and prepares annual settlements ready for review.":
    "Verrekent de servicekosten met de voorschotten van huurders, volgt de kostenontwikkeling per m² en stelt jaarlijkse afrekeningen op die klaar zijn voor beoordeling.",

  /* ---------------------------------------------------------------- */
  /*  Template-example-only chips (not full template names)           */
  /* ---------------------------------------------------------------- */
  "Tenant Signals": "Huurdersignalen",
  "Compliance Monitoring": "Compliancebewaking",

  /* ---------------------------------------------------------------- */
  /*  Template names                                                  */
  /* ---------------------------------------------------------------- */
  "Monthly Closing Review": "Beoordeling maandafsluiting",
  "Anomaly Detection": "Anomaliedetectie",
  "AR Monitoring": "Debiteurenbewaking",
  "Budget vs. Actuals": "Budget versus realisatie",
  "Annual Budgeting": "Jaarlijkse budgettering",
  "Capex / Cashflow": "Capex / cashflow",
  "Upcoming Expiry Watchlist": "Watchlist aflopende contracten",
  "Tenant Satisfaction Signals": "Signalen huurderstevredenheid",
  "External Tenant Signals": "Externe huurdersignalen",
  "Vacancy Monitoring": "Leegstandbewaking",
  "Technical Compliance Monitoring": "Technische compliancebewaking",
  "Work Order Summary": "Overzicht werkorders",
  "CapEx Planning": "CapEx-planning",
  "Maintenance Alerts": "Onderhoudsmeldingen",
  "Covenant Monitoring": "Convenantbewaking",
  "Maturity Calendar": "Looptijdenkalender",
  "Refinancing Risk": "Herfinancieringsrisico",
  "Interest Cost Review": "Beoordeling rentelasten",
  "Service Charge Settlement": "Afrekening servicekosten",
  "Service Charge Monitoring": "Bewaking servicekosten",
  "Advance Reconciliation": "Afstemming voorschotten",
  "Cost Trend Analysis": "Analyse kostentrends",

  /* ---------------------------------------------------------------- */
  /*  Template descriptions                                           */
  /* ---------------------------------------------------------------- */
  "Reviews monthly figures against expectations, flags anomalies and missing entries, and highlights what needs attention before you close the books.":
    "Toetst de maandcijfers aan de verwachtingen, markeert anomalieën en ontbrekende boekingen en laat zien wat aandacht vereist voordat u de boeken sluit.",
  "Amiio flags duplicates, unusual amounts and wrong allocations in your financial postings before they affect your figures.":
    "Amiio markeert dubbele boekingen, ongebruikelijke bedragen en onjuiste toewijzingen in uw financiële boekingen voordat ze uw cijfers beïnvloeden.",
  "Track accounts receivable and arrears per tenant and flag overdue balances.":
    "Volg debiteuren en achterstanden per huurder en markeer achterstallige saldi.",
  "Compare actuals against budget and explain the variances across the portfolio.":
    "Vergelijk de realisatie met het budget en verklaar de afwijkingen binnen de portefeuille.",
  "Prepare the annual budget per property using prior-year actuals and assumptions.":
    "Stel het jaarbudget per object op aan de hand van de realisatie van het voorgaande jaar en aannames.",
  "Monitor capital expenditure and cashflow across the portfolio on a weekly basis.":
    "Bewaak de investeringsuitgaven en cashflow binnen de portefeuille op wekelijkse basis.",
  "Monitors leases expiring within a chosen scope and summarizes tenants entering the renewal window, incl. WAULT impact and current vs. market indexation.":
    "Bewaakt huurcontracten die binnen een gekozen scope aflopen en vat samen welke huurders het verlengingsvenster ingaan, incl. WAULT-impact en huidige versus marktindexatie.",
  "Reads every service request and work order, analyzes tone and sentiment, and flags tenants showing signs of frustration before it turns into a non-renewal.":
    "Leest elk serviceverzoek en elke werkorder, analyseert toon en sentiment en signaleert huurders die tekenen van frustratie vertonen voordat het tot niet-verlenging leidt.",
  "Scans public online sources for tenant developments — bankruptcy filings, restructurings, expansions, acquisitions — that matter for your assets.":
    "Scant openbare online bronnen op ontwikkelingen bij huurders — faillissementsaanvragen, herstructureringen, uitbreidingen, overnames — die van belang zijn voor uw objecten.",
  "Tracks every vacant unit, monitors days-on-market and letting progress against targets, and flags units that are stalling.":
    "Volgt elke leegstaande unit, bewaakt de dagen op de markt en de verhuurvoortgang ten opzichte van de doelen en markeert units die stokken.",
  "Tracks all technical certifications across your assets — from elevator inspections to energy labels — and flags upcoming renewals well before they expire.":
    "Volgt alle technische certificeringen van uw objecten — van liftkeuringen tot energielabels — en signaleert aankomende verlengingen ruim voordat ze verlopen.",
  "Summarizes open work orders, aging tickets, and operational bottlenecks across the selected scope.":
    "Vat openstaande werkorders, verouderende tickets en operationele knelpunten binnen de geselecteerde scope samen.",
  "Surfaces CapEx priorities, planned projects, and spend risk by asset so budgets stay on plan.":
    "Brengt CapEx-prioriteiten, geplande projecten en uitgaverisico per object in beeld, zodat budgetten op koers blijven.",
  "Flags overdue maintenance and building systems that need attention soon.":
    "Signaleert achterstallig onderhoud en gebouwsystemen die binnenkort aandacht nodig hebben.",
  "Monitors debt covenants against live portfolio data and documentation, flagging headroom changes and potential breaches before they become problems.":
    "Bewaakt schuldconvenanten aan de hand van actuele portefeuillegegevens en documentatie en signaleert veranderingen in de marge en mogelijke schendingen voordat ze problemen worden.",
  "Surfaces upcoming debt maturities and refinancing windows across the book so nothing catches you by surprise.":
    "Brengt aankomende aflossingsdata en herfinancieringsvensters binnen de portefeuille in beeld, zodat niets u verrast.",
  "Assesses refinancing risk, rate exposure, and lender concentration across your facilities.":
    "Beoordeelt het herfinancieringsrisico, renteblootstelling en kredietverstrekkerconcentratie binnen uw faciliteiten.",
  "Summarizes interest costs and what is driving changes in debt service, ICR, and DSCR.":
    "Vat de rentelasten samen en wat de veranderingen in schuldendienst, ICR en DSCR veroorzaakt.",
  "Reconciles actual costs against advances paid, allocates them across tenants, and prepares annual settlements — with full flexibility to adjust before finalizing.":
    "Verrekent de werkelijke kosten met de betaalde voorschotten, verdeelt ze over de huurders en stelt jaarlijkse afrekeningen op — met volledige flexibiliteit om aan te passen vóór de definitieve vaststelling.",
  "Continuously tracks actual service charge costs against tenant advances and analyzes cost developments per m², flagging overruns while there's still time to act.":
    "Volgt continu de werkelijke servicekosten ten opzichte van de voorschotten van huurders en analyseert de kostenontwikkeling per m², waarbij overschrijdingen worden gemarkeerd zolang er nog tijd is om in te grijpen.",
  "Matches advance payments per tenant against actual ledgers and highlights under- or over-recovery early.":
    "Koppelt de voorschotbetalingen per huurder aan de werkelijke grootboeken en signaleert onder- of overdekking in een vroeg stadium.",
  "Analyzes cost developments per m² and flags unusual trends across your assets.":
    "Analyseert de kostenontwikkeling per m² en signaleert ongebruikelijke trends binnen uw objecten.",

  /* ---------------------------------------------------------------- */
  /*  Seed task descriptions                                          */
  /* ---------------------------------------------------------------- */
  "Scan ledgers for unusual transactions and surface anomalies for review.":
    "Scan de grootboeken op ongebruikelijke transacties en breng anomalieën naar voren voor beoordeling.",
  "Review the monthly close and draft IC-ready commentary.":
    "Beoordeel de maandafsluiting en stel IC-gerede toelichting op.",
  "Monitors leases expiring within the portfolio and summarizes tenants entering the renewal window.":
    "Bewaakt huurcontracten die binnen de portefeuille aflopen en vat samen welke huurders het verlengingsvenster ingaan.",

  /* ---------------------------------------------------------------- */
  /*  Seed task + subtask instructions                                */
  /* ---------------------------------------------------------------- */
  "Flag any transaction that deviates more than 10% from the trailing three-month average and summarise the likely cause.":
    "Markeer elke transactie die meer dan 10% afwijkt van het voortschrijdend driemaandsgemiddelde en vat de waarschijnlijke oorzaak samen.",
  "Summarise the monthly close, highlight the three largest variances and draft commentary suitable for the investment committee.":
    "Vat de maandafsluiting samen, licht de drie grootste afwijkingen uit en stel een toelichting op die geschikt is voor de beleggingscommissie.",
  "Focus on leases expiring in the next 18 months and include the WAULT impact per entity.":
    "Richt u op huurcontracten die in de komende 18 maanden aflopen en neem de WAULT-impact per entiteit op.",
  "Pay special attention to service charge postings.":
    "Besteed bijzondere aandacht aan boekingen van servicekosten.",
  "Only review capex-related ledgers for this property.":
    "Beoordeel alleen de CapEx-gerelateerde grootboeken voor dit object.",

  /* ---------------------------------------------------------------- */
  /*  Subtask name (property name stays English, interpolated)        */
  /* ---------------------------------------------------------------- */
  "{name} anomalies": "Anomalieën in {name}",

  /* ---------------------------------------------------------------- */
  /*  Output names (month/week kept, task name translated)            */
  /* ---------------------------------------------------------------- */
  "Anomaly Detection — August": "Anomaliedetectie — augustus",
  "Anomaly Detection — September": "Anomaliedetectie — september",
  "Monthly Closing Review — August": "Beoordeling maandafsluiting — augustus",
  "Upcoming Expiry Watchlist — Week 32": "Watchlist aflopende contracten — week 32",

  /* ---------------------------------------------------------------- */
  /*  Output summaries                                                */
  /* ---------------------------------------------------------------- */
  "2 anomalies flagged across 3 properties.": "2 anomalieën gemarkeerd in 3 objecten.",
  "No anomalies above threshold this period.":
    "Geen anomalieën boven de drempel in deze periode.",
  "Close complete. Three variances explained.":
    "Afsluiting voltooid. Drie afwijkingen verklaard.",
  "4 leases enter the renewal window this month.":
    "4 huurcontracten gaan deze maand het verlengingsvenster in.",

  /* ---------------------------------------------------------------- */
  /*  Sources (the .pdf filename stays English via fallback)          */
  /* ---------------------------------------------------------------- */
  "Market benchmarks": "Marktbenchmarks",
  "Reporting guidelines": "Rapportagerichtlijnen",
  "Always report figures in EUR thousands and round to one decimal place.":
    "Rapporteer bedragen altijd in duizenden euro's en rond af op één decimaal.",
};
