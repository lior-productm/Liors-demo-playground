/**
 * Commercial dashboard CONTENT translations (KPIs, chart titles, AI summary/trends).
 * Keys are the English source strings. Building/tenant names stay English.
 */
export const commercialHe: Record<string, string> = {
  // Dashboard chrome (title + tabs)
  "Commercial Dashboard": "לוח בקרה מסחרי",
  Overview: "סקירה כללית",
  "Rent Roll": "רשימת שוכרים",

  // Overview trend chart titles
  "Rental Income Trend": "הכנסות שכירות נטו",
  "WALT Trend": "מגמת WAULT",
  "Occupancy Trend": "מגמת תפוסה",
  "Lease Expiry": "פקיעת חוזי שכירות",

  // Performance vs budget rows + heading
  "Performance vs budget": "ביצועים מול תקציב",
  "Income (GRI)": "הכנסה (GRI)",
  NOI: "NOI",
  OPEX: "OPEX",
  CAPEX: "CAPEX",
  "Debt service": "שירות החוב",

  // Portfolio overview — top KPI metrics
  "Total Assets": "מספר נכסים",
  "Current Valuation": "שווי נוכחי",
  "Total Tenants": "מספר שוכרים",
  WAULT: "יתרת תקופת השכירות הממוצעת",
  "Occupancy Rate": "שיעור תפוסה",
  "Vacancy Rate": "שיעור שטחים פנויים",
  "Properties in portfolio": "נכסים בתיק",
  "vs last period": "לעומת שנה קודמת",

  // Portfolio overview — minor metrics
  "Tenant Retention Rate": "שיעור שימור שוכרים",
  "Net Absorption": "ספיגה נטו",
  "Average Rent per m2": 'דמי שכירות ממוצעים למ"ר',
  "Total GRI": "סך הכנסות שכירות ברוטו",
  "Net Rental Income": "הכנסות שכירות נטו",
  "vs previous year": "לעומת שנה קודמת",

  // AI summary card titles + chrome
  "Entity Summary": "סיכום ישות",
  "Portfolio Summary": "סיכום תיק",
  "Key trends": "מגמות מרכזיות",
  "Read more": "קרא עוד",

  // AI summary — entity scope (split around inline figures)
  "Entity is portfolio outperformer with occupancy at 89%":
    "הישות מובילה בתיק עם תפוסה של 89%",
  "exceeding portfolio average of 87%. GRI growth of":
    "העולה על ממוצע התיק של 87%. צמיחת GRI של",
  "demonstrates strong operational execution. Entity represents 32% of portfolio value and remains a strategic focus area.":
    "מעידה על ביצוע תפעולי חזק. הישות מהווה 32% משווי התיק ונותרת תחום מיקוד אסטרטגי.",

  // AI summary — portfolio scope
  "Portfolio performing strongly with occupancy reaching 87%":
    "התיק מציג ביצועים חזקים עם תפוסה המגיעה ל-87%",
  "and GRI exceeding budget by EUR 1.2M. Strong pricing momentum is visible with rent/sqm up 2.1%, driven by 8 new leases signed. WAULT continues to decline and needs close monitoring.":
    'וה-GRI עולה על התקציב ב-1.2 מיליון אירו. ניכרת מגמת תמחור חזקה עם עלייה של 2.1% בשכר הדירה למ"ר, המונעת מ-8 חוזי שכירות חדשים שנחתמו. ה-WAULT ממשיך לרדת ומחייב מעקב צמוד.',

  // Key trends — entity scope
  "Occupancy outperforming: 89% vs portfolio 87%":
    "תפוסה עדיפה: 89% מול 87% בתיק",
  "GRI growth strong: +6.2% vs portfolio +5.8%":
    "צמיחת GRI חזקה: ‎+6.2% מול ‎+5.8% בתיק",
  "WAULT declining:": "WAULT בירידה:",
  "but still above portfolio average": "אך עדיין מעל ממוצע התיק",

  // Key trends — portfolio scope
  "Occupancy improving:": "התפוסה משתפרת:",
  "to 87% with strong leasing momentum": "ל-87% עם מומנטום השכרה חזק",
  "Pricing strength: rent/sqm up": 'חוזק תמחור: שכר דירה למ"ר עלה ב-',
  "to 3.2 years, monitor expirations": "ל-3.2 שנים, יש לעקוב אחר פקיעות",

  // Rent Roll — table column headers
  Units: "יחידות",
  "Tenant Name": "שם השוכר",
  "Start Date": "תאריך תחילה",
  "End Date": "תאריך סיום",
  "Next Indexation": "מועד ההצמדה הבא",
  "Notice Period": "תקופת ההודעה",
  "Invoice Period": "תקופת חיוב",

  // Rent Roll — invoice cadence badges
  Quarterly: "רבעוני",
  Monthly: "חודשי",

  // Rent Roll — subtotal + section labels
  "Sub Total Leased": "סכום ביניים מושכר",
  Vacancy: "שטחים פנויים",
  "GRAND TOTAL": "סך הכול",
  "Total Rent Roll": "סך דוח השכירויות",
  "Total Signed Lease": "סך חוזים חתומים",
  "Sub Total Lease": "סכום ביניים לשכירות",
  "After Start Signed Leases": "חוזים חתומים לאחר התחלה",
  Type: "סוג",
  'Area (m²)/Unit': 'שטח (מ"ר)/יחידה',
  WALT: "WALT",
  "Total GRI (excl. parking)": "סך GRI (ללא חניה)",
  "Total GRI (incl. parking)": "סך GRI (כולל חניה)",
  Spaces: "שטחים",
  Years: "שנים",

  // Rent Roll — toolbar + editing controls
  "Select date": "בחר תאריך",
  "Signed Leased": "חוזים חתומים",
  Edit: "עריכה",
  "Done Editing": "סיום עריכה",
  "Add Row": "הוסף שורה",
  "Editing mode — click a row to edit, or use the action buttons":
    "מצב עריכה — לחץ על שורה לעריכה, או השתמש בכפתורי הפעולה",
};

export const commercialNl: Record<string, string> = {
  // Dashboard chrome (title + tabs)
  "Commercial Dashboard": "Commercieel dashboard",
  Overview: "Overzicht",
  "Rent Roll": "Huurstaat",

  // Overview trend chart titles
  "Rental Income Trend": "Trend huurinkomsten",
  "WALT Trend": "WALT-trend",
  "Occupancy Trend": "Bezettingstrend",
  "Lease Expiry": "Aflopende huurcontracten",

  // Performance vs budget rows + heading
  "Performance vs budget": "Prestatie versus budget",
  "Income (GRI)": "Inkomsten (GRI)",
  NOI: "NOI",
  OPEX: "OPEX",
  CAPEX: "CAPEX",
  "Debt service": "Schuldendienst",

  // Portfolio overview — top KPI metrics
  "Total Assets": "Totaal activa",
  "Current Valuation": "Huidige waardering",
  "Total Tenants": "Totaal huurders",
  WAULT: "WAULT",
  "Occupancy Rate": "Bezettingsgraad",
  "Vacancy Rate": "Leegstandspercentage",
  "Properties in portfolio": "Objecten in portefeuille",
  "vs last period": "t.o.v. vorige periode",

  // Portfolio overview — minor metrics
  "Tenant Retention Rate": "Retentiegraad huurders",
  "Net Absorption": "Netto-absorptie",
  "Average Rent per m2": "Gemiddelde huur per m²",
  "Total GRI": "Totale GRI",
  "Net Rental Income": "Netto huurinkomsten",
  "vs previous year": "t.o.v. vorig jaar",

  // AI summary card titles + chrome
  "Entity Summary": "Entiteitssamenvatting",
  "Portfolio Summary": "Portefeuillesamenvatting",
  "Key trends": "Belangrijkste trends",
  "Read more": "Lees meer",

  // AI summary — entity scope (split around inline figures)
  "Entity is portfolio outperformer with occupancy at 89%":
    "De entiteit presteert bovengemiddeld in de portefeuille met een bezetting van 89%",
  "exceeding portfolio average of 87%. GRI growth of":
    "boven het portefeuillegemiddelde van 87%. Een GRI-groei van",
  "demonstrates strong operational execution. Entity represents 32% of portfolio value and remains a strategic focus area.":
    "toont een sterke operationele uitvoering. De entiteit vertegenwoordigt 32% van de portefeuillewaarde en blijft een strategisch aandachtsgebied.",

  // AI summary — portfolio scope
  "Portfolio performing strongly with occupancy reaching 87%":
    "De portefeuille presteert sterk met een bezetting die 87% bereikt",
  "and GRI exceeding budget by EUR 1.2M. Strong pricing momentum is visible with rent/sqm up 2.1%, driven by 8 new leases signed. WAULT continues to decline and needs close monitoring.":
    "en de GRI overtreft het budget met EUR 1,2 mln. Er is een sterk prijsmomentum zichtbaar met een stijging van 2,1% in huur per m², gedreven door 8 nieuw getekende huurcontracten. De WAULT blijft dalen en vereist nauwlettende monitoring.",

  // Key trends — entity scope
  "Occupancy outperforming: 89% vs portfolio 87%":
    "Bezetting presteert beter: 89% versus 87% portefeuille",
  "GRI growth strong: +6.2% vs portfolio +5.8%":
    "Sterke GRI-groei: +6,2% versus +5,8% portefeuille",
  "WAULT declining:": "WAULT daalt:",
  "but still above portfolio average":
    "maar nog steeds boven het portefeuillegemiddelde",

  // Key trends — portfolio scope
  "Occupancy improving:": "Bezetting verbetert:",
  "to 87% with strong leasing momentum":
    "naar 87% met sterk verhuurmomentum",
  "Pricing strength: rent/sqm up": "Prijssterkte: huur per m² gestegen met",
  "to 3.2 years, monitor expirations": "naar 3,2 jaar, monitor afloopdata",

  // Rent Roll — table column headers
  Units: "Eenheden",
  "Tenant Name": "Naam huurder",
  "Start Date": "Startdatum",
  "End Date": "Einddatum",
  "Next Indexation": "Volgende indexering",
  "Notice Period": "Opzegtermijn",
  "Invoice Period": "Factuurperiode",

  // Rent Roll — invoice cadence badges
  Quarterly: "Per kwartaal",
  Monthly: "Maandelijks",

  // Rent Roll — subtotal + section labels
  "Sub Total Leased": "Subtotaal verhuurd",
  Vacancy: "Leegstand",
  "GRAND TOTAL": "EINDTOTAAL",
  "Total Rent Roll": "Totaal huurstaat",
  "Total Signed Lease": "Totaal getekende huur",
  "Sub Total Lease": "Subtotaal huur",
  "After Start Signed Leases": "Na start getekende huurcontracten",
  Type: "Type",
  "Area (m²)/Unit": "Oppervlakte (m²)/eenheid",
  WALT: "WALT",
  "Total GRI (excl. parking)": "Totale GRI (excl. parkeren)",
  "Total GRI (incl. parking)": "Totale GRI (incl. parkeren)",
  Spaces: "Ruimtes",
  Years: "Jaar",

  // Rent Roll — toolbar + editing controls
  "Select date": "Selecteer datum",
  "Signed Leased": "Getekende huur",
  Edit: "Bewerken",
  "Done Editing": "Klaar met bewerken",
  "Add Row": "Rij toevoegen",
  "Editing mode — click a row to edit, or use the action buttons":
    "Bewerkmodus — klik op een rij om te bewerken, of gebruik de actieknoppen",
};
