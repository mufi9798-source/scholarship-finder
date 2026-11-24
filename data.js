// Scholarship dataset. Rules are simplified from the official schemes and
// MUST be re-checked on the official page before applying (see `link`).
// Rule fields (all optional; omitted = no restriction):
//   levels: ["school","diploma","ug","pg","phd"]   fields: ["tech","medical","science","other"]
//   gender: "female"   categories: ["SC","ST","OBC","EWS","General"]
//   minority: true     disability: true
//   maxIncome: lakh INR per year (family)   minMarks: % in last exam
window.SCHOLARSHIPS = [
  {
    id: "reliance-ug",
    name: "Reliance Foundation Undergraduate Scholarship",
    provider: "Reliance Foundation",
    amountText: "Up to ₹2,00,000 (total)",
    amountValue: 200000,
    rules: { levels: ["ug"], maxIncome: 15 },
    notes: "For first-year undergraduates; selection includes an aptitude test. Check the current cycle for the year-of-study requirement.",
    window: "Usually opens mid-year; check portal",
    link: "https://www.reliancefoundation.org/"
  },
  {
    id: "aicte-pragati",
    name: "AICTE Pragati Scholarship for Girls",
    provider: "AICTE / Govt. of India",
    amountText: "₹50,000 per year",
    amountValue: 50000,
    rules: { levels: ["ug", "diploma"], fields: ["tech"], gender: "female", maxIncome: 8 },
    notes: "Technical degree/diploma in an AICTE-approved institute; limited to two girls per family. First year (or second year via lateral entry).",
    window: "Applications on National Scholarship Portal, typically Aug–Nov",
    link: "https://scholarships.gov.in/"
  },
  {
    id: "aicte-saksham",
    name: "AICTE Saksham Scholarship (Differently-abled)",
    provider: "AICTE / Govt. of India",
    amountText: "₹50,000 per year",
    amountValue: 50000,
    rules: { levels: ["ug", "diploma"], fields: ["tech"], disability: true, maxIncome: 8 },
    notes: "Needs a disability of 40% or more and admission to an AICTE-approved technical course.",
    window: "National Scholarship Portal, typically Aug–Nov",
    link: "https://scholarships.gov.in/"
  },
  {
    id: "csss",
    name: "Central Sector Scheme of Scholarship for College & University Students",
    provider: "Dept. of Higher Education, Govt. of India",
    amountText: "₹12,000–₹20,000 per year",
    amountValue: 20000,
    rules: { levels: ["ug", "pg"], maxIncome: 4.5, minMarks: 80 },
    notes: "Needs a Class 12 score above the 80th percentile in your stream. The marks field here is only a rough proxy; check the cut-off for your board.",
    window: "National Scholarship Portal, typically Aug–Nov",
    link: "https://scholarships.gov.in/"
  },
  {
    id: "pms-sc",
    name: "Post Matric Scholarship for SC Students",
    provider: "Ministry of Social Justice & Empowerment",
    amountText: "Tuition fee + maintenance allowance",
    amountValue: 60000,
    rules: { levels: ["school", "diploma", "ug", "pg", "phd"], categories: ["SC"], maxIncome: 2.5 },
    notes: "For studies after Class 10. Fee and allowance depend on course group.",
    window: "National Scholarship Portal, typically Aug–Nov",
    link: "https://scholarships.gov.in/"
  },
  {
    id: "pms-st",
    name: "Post Matric Scholarship for ST Students",
    provider: "Ministry of Tribal Affairs",
    amountText: "Tuition fee + maintenance allowance",
    amountValue: 60000,
    rules: { levels: ["school", "diploma", "ug", "pg", "phd"], categories: ["ST"], maxIncome: 2.5 },
    notes: "For studies after Class 10. Fee and allowance depend on course group.",
    window: "National Scholarship Portal, typically Aug–Nov",
    link: "https://scholarships.gov.in/"
  },
  {
    id: "pms-minority",
    name: "Post Matric Scholarship for Minorities",
    provider: "Ministry of Minority Affairs",
    amountText: "Admission/tuition fee + maintenance allowance",
    amountValue: 30000,
    rules: { levels: ["school", "diploma", "ug", "pg", "phd"], minority: true, maxIncome: 2, minMarks: 50 },
    notes: "Notified minorities: Muslim, Christian, Sikh, Buddhist, Jain, Parsi. Needs 50% or more in the previous exam.",
    window: "National Scholarship Portal, typically Aug–Nov",
    link: "https://scholarships.gov.in/"
  },
  {
    id: "mcm",
    name: "Merit-cum-Means Scholarship for Professional & Technical Courses (Minorities)",
    provider: "Ministry of Minority Affairs",
    amountText: "Course fee + maintenance allowance (up to ~₹30,000/yr)",
    amountValue: 30000,
    rules: { levels: ["ug", "pg", "diploma"], fields: ["tech", "medical"], minority: true, maxIncome: 2.5, minMarks: 50 },
    notes: "For professional/technical courses at the UG or PG level, including technical diplomas.",
    window: "National Scholarship Portal, typically Aug–Nov",
    link: "https://scholarships.gov.in/"
  },
  {
    id: "inspire-she",
    name: "INSPIRE Scholarship (SHE)",
    provider: "Dept. of Science & Technology",
    amountText: "₹80,000 per year",
    amountValue: 80000,
    rules: { levels: ["ug", "pg"], fields: ["science"] },
    notes: "For B.Sc/BS/Integrated M.Sc in natural and basic sciences. Needs a Class 12 rank in the top 1% of your board, or an eligible JEE/NEET rank; this is not checked here.",
    window: "Check the INSPIRE portal; opens once a year",
    link: "https://online-inspire.gov.in/"
  },
  {
    id: "kotak-kanya",
    name: "Kotak Kanya Scholarship",
    provider: "Kotak Education Foundation",
    amountText: "Up to ₹1,50,000 per year",
    amountValue: 150000,
    rules: { levels: ["ug"], fields: ["tech", "medical"], gender: "female", maxIncome: 6, minMarks: 75 },
    notes: "For meritorious girls entering professional undergraduate courses (e.g. engineering, MBBS). Needs 75% or more in Class 12.",
    window: "Usually opens mid-year; check Buddy4Study",
    link: "https://www.buddy4study.com/"
  },
  {
    id: "hdfc-ecss",
    name: "HDFC Bank Parivartan's ECSS Programme",
    provider: "HDFC Bank / Buddy4Study",
    amountText: "Up to ₹75,000 (varies by level)",
    amountValue: 75000,
    rules: { levels: ["school", "diploma", "ug", "pg"], maxIncome: 2.5, minMarks: 55 },
    notes: "For students facing financial crises. Needs 55% or more in the previous exam.",
    window: "Usually opens mid-year; check Buddy4Study",
    link: "https://www.buddy4study.com/"
  },
  {
    id: "ongc",
    name: "ONGC Foundation Scholarship",
    provider: "ONGC Foundation",
    amountText: "₹48,000 per year",
    amountValue: 48000,
    rules: { levels: ["ug", "pg"], fields: ["tech", "medical"], categories: ["SC", "ST", "OBC", "General"], maxIncome: 4.5, minMarks: 60 },
    notes: "For first-year students in engineering, MBBS, MBA and geology/geophysics, chosen on Class 12 marks. Reserved quotas by category; check the current notice.",
    window: "Check the ONGC Foundation site, usually mid-year",
    link: "https://ongcscholar.org/"
  }
];
