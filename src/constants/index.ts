// Values match the database enums in the Lab 6 data dictionary.
export const ROLES = {
  STUDENT: "student",
  OSA: "osa",
  OPD: "opd",
  COMMITTEE: "discipline_committee",
  SUPER_ADMIN: "super_admin",
};

export const STATUS_ORDER = ["submitted", "under_review", "under_verification", "resolved"];

export const STATUS_LABELS = {
  submitted: "Submitted",
  under_review: "Under Review",
  under_verification: "Under Verification",
  resolved: "Resolved",
};

export const STATUS_HELP = {
  submitted: "OSA / OPD received your report.",
  under_review: "Staff are reading your report and checking the evidence.",
  under_verification: "Staff are verifying details. They may leave a note for you.",
  resolved: "The case is closed. The final note appears on the timeline.",
};

// Placeholder rule: the real maximum file size is still to be confirmed with OSA / OPD.
export const EVIDENCE = {
  maxMB: 10,
  maxBytes: 10 * 1024 * 1024,
  extensions: ["jpg", "jpeg", "png", "pdf", "doc", "docx"],
  accept: ".jpg,.jpeg,.png,.pdf,.doc,.docx",
};

// Where each role lands after login. Staff and admin pages are built in Parts B and C.
export const ROLE_HOME = {
  student: "/home",
  osa: "/staff/dashboard",
  opd: "/staff/dashboard",
  super_admin: "/admin/dashboard",
};

export const ROLE_LABELS = {
  student: "Student",
  osa: "OSA",
  opd: "OPD",
  discipline_committee: "Discipline Committee",
  super_admin: "Super Admin",
};

// Rows per page in staff tables. Kept small so pagination is visible with demo data.
export const PAGE_SIZE = 4;
