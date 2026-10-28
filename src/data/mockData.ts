// ============================================================
// MOCK DATA ONLY. Nothing here comes from a real database.
// Replace with Laravel API calls later (see src/services/api.js).
// ============================================================

// PLACEHOLDER categories. The official list is not yet provided.
export const OFFENSE_CATEGORIES = [
  { id: 1, name: "Cyber-related" },
  { id: 2, name: "Bullying / Harassment" },
  { id: 3, name: "AI misuse" },
  { id: 4, name: "Unauthorized recording or posting" },
  { id: 5, name: "Academic dishonesty" },
  { id: 6, name: "Property damage or theft" },
  { id: 7, name: "Other" },
];

// Demo accounts. Passwords sit in the frontend ONLY because this is a mock.
export const MOCK_USERS = [
  {
    id: 1,
    studentNumber: "24-0001",
    fullName: "Juan Dela Cruz",
    email: "juan.delacruz@plv.edu.ph",
    password: "demo1234",
    section: "BSIT 3-3",
    role: "student",
    accountStatus: "active",
    verified: true,
  },
  {
    id: 2,
    studentNumber: "24-0002",
    fullName: "Maria Santos",
    email: "maria.santos@plv.edu.ph",
    password: "demo1234",
    section: "BSIT 3-3",
    role: "student",
    accountStatus: "active",
    verified: false, // demonstrates the "not verified" branch of the flowchart
  },
  {
    id: 3,
    username: "osa.staff",
    studentNumber: null,
    fullName: "Liza Ramos",
    email: "liza.ramos@plv.edu.ph",
    password: "demo1234",
    section: null,
    role: "osa",
    accountStatus: "active",
    verified: true,
  },
  {
    id: 4,
    username: "opd.staff",
    studentNumber: null,
    fullName: "Carlo Bautista",
    email: "carlo.bautista@plv.edu.ph",
    password: "demo1234",
    section: null,
    role: "opd",
    accountStatus: "active",
    verified: true,
  },
  { id: 5, username: "super.admin", studentNumber: null, fullName: "Mario Santiago", email: "mario.santiago@plv.edu.ph", password: "demo1234", section: null, role: "super_admin", accountStatus: "active", verified: true },
  { id: 6, username: "committee.member", studentNumber: null, fullName: "Rica Villanueva", email: "rica.villanueva@plv.edu.ph", password: "demo1234", section: null, role: "discipline_committee", accountStatus: "restricted", verified: true },
  { id: 7, username: "old.osa", studentNumber: null, fullName: "Pablo Garcia", email: "pablo.garcia@plv.edu.ph", password: "demo1234", section: null, role: "osa", accountStatus: "deactivated", verified: true },
];

// Sample reports so the Track page has something to find.
// "visible: false" marks an internal staff note the reporter must not see.
export const SEED_REPORTS = [
  {
    trackingId: "VRS-2026-00123",
    isAnonymous: true,
    categoryId: 1,
    description: "Sample: an offensive post about a classmate was shared in a class group chat.",
    incidentAt: "2026-10-20T14:30",
    location: "Online - class group chat",
    involved: "Names as typed",
    status: "under_review",
    submittedAt: "2026-10-21T09:12:00",
    evidence: [{ mimeType: "image/png", size: 204800 }],
    history: [
      { status: "submitted", at: "2026-10-21T09:12:00", by: null, note: "Report received by OSA / OPD.", visible: true },
      { status: "under_review", at: "2026-10-22T10:05:00", by: "OSA staff", note: "Your report is being reviewed.", visible: true },
    ],
  },
  {
    trackingId: "VRS-2026-00122",
    isAnonymous: false,
    categoryId: 2,
    description: "Sample: repeated teasing of a student near the canteen.",
    incidentAt: "2026-10-15T12:10",
    location: "Canteen",
    involved: "Names as typed",
    status: "under_verification",
    submittedAt: "2026-10-16T08:00:00",
    evidence: [],
    history: [
      { status: "submitted", at: "2026-10-16T08:00:00", by: null, note: "Report received by OSA / OPD.", visible: true },
      { status: "under_review", at: "2026-10-17T09:30:00", by: "OPD staff", note: "Your report is being reviewed.", visible: true },
      { status: "under_verification", at: "2026-10-19T13:45:00", by: "OPD staff", note: "Internal: witness to be interviewed.", visible: false },
      { status: "under_verification", at: "2026-10-19T13:50:00", by: "OPD staff", note: "We are verifying the details of your report.", visible: true },
    ],
  },
  {
    trackingId: "VRS-2026-00121",
    isAnonymous: true,
    categoryId: 4,
    description: "Sample: a student recorded a classmate without consent.",
    incidentAt: "2026-10-23T10:00",
    location: "Room 305",
    involved: "",
    status: "submitted",
    submittedAt: "2026-10-24T07:45:00",
    evidence: [{ mimeType: "application/pdf", size: 98000 }],
    history: [
      { status: "submitted", at: "2026-10-24T07:45:00", by: null, note: "Report received by OSA / OPD.", visible: true },
    ],
  },
  {
    trackingId: "VRS-2026-00120",
    isAnonymous: false,
    categoryId: 5,
    description: "Sample: copied answers during a quiz.",
    incidentAt: "2026-09-30T09:00",
    location: "Room 210",
    involved: "Names as typed",
    status: "resolved",
    submittedAt: "2026-10-01T08:20:00",
    evidence: [],
    history: [
      { status: "submitted", at: "2026-10-01T08:20:00", by: null, note: "Report received by OSA / OPD.", visible: true },
      { status: "under_review", at: "2026-10-02T09:00:00", by: "OSA staff", note: "Your report is being reviewed.", visible: true },
      { status: "resolved", at: "2026-10-12T15:30:00", by: "OSA staff", note: "The case was resolved. Thank you for reporting.", visible: true },
    ],
  },
];

// ============================================================
// Part B additions (still MOCK)
// ============================================================

// PLACEHOLDER catalog: 13 minor + 42 major. Replace with the official Code of Conduct list.
export const OFFENSES = [
  ...Array.from({ length: 13 }, (_, i) => ({ code: `MIN-${String(i + 1).padStart(2, "0")}`, severity: "minor", n: i })),
  ...Array.from({ length: 42 }, (_, i) => ({ code: `MAJ-${String(i + 1).padStart(2, "0")}`, severity: "major", n: i })),
].map((o, i) => {
  const category = OFFENSE_CATEGORIES[o.n % OFFENSE_CATEGORIES.length];
  return {
    id: i + 1,
    code: o.code,
    name: `${category.name} – ${o.code}`,
    description: "Placeholder description. Replace with the Code of Conduct text.",
    severity: o.severity,
    categoryId: category.id,
    isActive: true,
  };
});

// MOCK "AI". The real suggestion will come from one Laravel endpoint that calls the LLM API.
export function mockAiSuggestion(report) {
  const hash = [...report.trackingId].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const pool = OFFENSES.filter((o) => o.categoryId === report.categoryId);
  const offense = pool[hash % pool.length];
  const words = report.description.trim().split(/\s+/);
  const short = words.length > 28 ? words.slice(0, 28).join(" ") + "…" : report.description.trim();
  return {
    aiOffenseId: offense.id,
    aiSeverity: offense.severity,
    aiConfidence: 60 + (hash % 31),
    aiSummary: `[Mock AI summary] ${short}`,
    aiGeneratedAt: report.submittedAt,
  };
}

const SEED_STAFF = {
  "VRS-2026-00123": { decision: "confirmed", by: "Liza Ramos (OSA)", office: "osa", at: "2026-10-22T10:00:00" },
  "VRS-2026-00122": { decision: "edited", by: "Carlo Bautista (OPD)", office: "opd", at: "2026-10-17T09:20:00", offenseId: 16 },
  "VRS-2026-00120": { decision: "confirmed", by: "Liza Ramos (OSA)", office: "osa", at: "2026-10-02T08:50:00" },
};

export function buildSeedReports() {
  return SEED_REPORTS.map((r) => {
    const ai = mockAiSuggestion(r);
    const s = SEED_STAFF[r.trackingId];
    return {
      ...r,
      ...ai,
      classifiedOffenseId: s ? s.offenseId ?? ai.aiOffenseId : null,
      classificationDecision: s ? s.decision : null,
      classifiedBy: s ? s.by : null,
      classifiedAt: s ? s.at : null,
      assignedOffice: s ? s.office : null,
      verificationResult: r.trackingId === "VRS-2026-00120" ? "not_verified" : null,
      disciplinaryActionRequired: r.trackingId === "VRS-2026-00120" ? false : null,
      referredToCommittee: false,
      resolutionNotes: r.trackingId === "VRS-2026-00120" ? "Sample resolution notes." : "",
    };
  });
}

// Reporter "vault". Only the Super Admin reveal flow (Part C) may read anonymous entries.
export const SEED_REPORTERS = {
  "VRS-2026-00123": { userId: 1, studentNumber: "24-0001", fullName: "Juan Dela Cruz", section: "BSIT 3-3" },
  "VRS-2026-00122": { userId: 9, studentNumber: "24-0201", fullName: "Sample Reporter A", section: "BSIT 2-1" },
  "VRS-2026-00121": { userId: 9, studentNumber: "24-0202", fullName: "Sample Reporter B", section: "BSIT 1-2" },
  "VRS-2026-00120": { userId: 9, studentNumber: "24-0203", fullName: "Sample Reporter C", section: "BSIT 4-1" },
};

// MOCK counter data. Reported = unconfirmed allegations, confirmed = OSA-confirmed.
export const MOCK_STUDENT_CASES = [
  { studentNumber: "24-0101", name: "Pedro Reyes", offenseId: 2, reported: 3, confirmed: 1 },
  { studentNumber: "24-0102", name: "Ana Lim", offenseId: 20, reported: 2, confirmed: 2 },
  { studentNumber: "24-0103", name: "Mark Cruz", offenseId: 8, reported: 1, confirmed: 0 },
];

// Sample audit entries so the Audit Log page is not empty. New actions are added on top at runtime.
export const SEED_AUDIT = [
  { id: "seed-1", at: "2026-10-26T09:15:00", userName: "Mario Santiago", userRole: "super_admin", action: "view_reporter_identity", target: "report VRS-2026-00121", details: "Reason: report may be a prank (sample entry)" },
  { id: "seed-2", at: "2026-10-25T14:02:00", userName: "Liza Ramos", userRole: "osa", action: "confirm_ai", target: "report VRS-2026-00123", details: "AI suggestion confirmed (sample entry)" },
  { id: "seed-3", at: "2026-10-24T10:30:00", userName: "Mario Santiago", userRole: "super_admin", action: "role_change", target: "user carlo.bautista", details: "OSA → OPD (sample entry)" },
];
