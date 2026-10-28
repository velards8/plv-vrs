import { createContext, useContext, useState } from "react";
import { SEED_REPORTERS, buildSeedReports, mockAiSuggestion } from "../data/mockData";

// MOCK STORE: reports live in memory and disappear on refresh.
// Reporter identity sits in a separate "vault" (like report_reporters in the schema).
// Staff pages must use getIdentifiedReporter(), which returns nothing for anonymous reports.
// Only the Super Admin reveal flow (Part C) may read `reporters` directly.
const ReportsContext = createContext(null);

function newTrackingId(taken) {
  let id;
  do {
    id = "VRS-2026-" + String(Math.floor(10000 + Math.random() * 90000));
  } while (taken.has(id));
  return id;
}

const staffLabel = (staff) => `${staff.fullName} (${staff.role.toUpperCase()})`;

export function ReportsProvider({ children }) {
  const [reports, setReports] = useState(buildSeedReports);
  const [reporters, setReporters] = useState(SEED_REPORTERS);
  const [confirmedViolations, setConfirmedViolations] = useState([]);

  const patch = (trackingId, fn) =>
    setReports((prev) => prev.map((r) => (r.trackingId === trackingId ? fn(r) : r)));

  const addReport = ({ report, reporter }) => {
    const trackingId = newTrackingId(new Set(reports.map((r) => r.trackingId)));
    const now = new Date().toISOString();
    const base = { ...report, trackingId, submittedAt: now };
    const created = {
      ...base,
      ...mockAiSuggestion(base),
      status: "submitted",
      classifiedOffenseId: null,
      classificationDecision: null,
      classifiedBy: null,
      classifiedAt: null,
      assignedOffice: null,
      verificationResult: null,
      disciplinaryActionRequired: null,
      referredToCommittee: false,
      resolutionNotes: "",
      history: [{ status: "submitted", at: now, by: null, note: "Report received by OSA / OPD.", visible: true }],
    };
    setReports((prev) => [created, ...prev]);
    setReporters((prev) => ({ ...prev, [trackingId]: reporter }));
    return trackingId;
  };

  const findByTrackingId = (id) => {
    const wanted = (id || "").trim().toUpperCase();
    return reports.find((r) => r.trackingId === wanted) || null;
  };

  // Staff confirm or edit the offense. The AI columns are never overwritten.
  // After the first decision on a Submitted report, the status moves to Under Review (per the flowchart).
  const classifyReport = (trackingId, { offenseId, decision, staff }) => {
    const now = new Date().toISOString();
    patch(trackingId, (r) => {
      const next = {
        ...r,
        classifiedOffenseId: offenseId,
        classificationDecision: decision,
        classifiedBy: staffLabel(staff),
        classifiedAt: now,
        assignedOffice: r.assignedOffice || staff.role,
      };
      if (r.status === "submitted") {
        next.status = "under_review";
        next.history = [...r.history, { status: "under_review", at: now, by: staffLabel(staff), note: "Your report is being reviewed.", visible: true }];
      }
      return next;
    });
  };

  const updateStatus = (trackingId, { status, note, visible, staff }) => {
    const now = new Date().toISOString();
    patch(trackingId, (r) => ({
      ...r,
      status,
      assignedOffice: r.assignedOffice || staff.role,
      resolvedAt: status === "resolved" ? now : r.resolvedAt,
      history: [...r.history, { status, at: now, by: staffLabel(staff), note: note.trim(), visible }],
    }));
  };

  // Records the verification result. A confirmed violation (used by the offense counter) exists only when verified.
  const recordVerification = (trackingId, { result, disciplinaryRequired, referred, notes, student, sanction, staff }) => {
    const now = new Date().toISOString();
    const report = reports.find((r) => r.trackingId === trackingId);
    patch(trackingId, (r) => ({
      ...r,
      verificationResult: result,
      disciplinaryActionRequired: disciplinaryRequired,
      referredToCommittee: referred,
      resolutionNotes: notes.trim(),
      history: [...r.history, { status: r.status, at: now, by: staffLabel(staff), note: `Internal: verification recorded (${result === "verified" ? "verified" : "not verified"}).`, visible: false }],
    }));
    if (result === "verified" && student && report) {
      setConfirmedViolations((prev) => [...prev, { id: `${trackingId}-${prev.length}`, trackingId, studentNumber: student.studentNumber, name: student.fullName, offenseId: report.classifiedOffenseId, confirmedBy: staffLabel(staff), sanction: (sanction || "").trim(), confirmedAt: now }]);
    }
  };

  const getIdentifiedReporter = (report) => (report.isAnonymous ? null : reporters[report.trackingId] || null);

  return (
    <ReportsContext.Provider value={{ reports, reporters, confirmedViolations, recordVerification, addReport, findByTrackingId, classifyReport, updateStatus, getIdentifiedReporter }}>
      {children}
    </ReportsContext.Provider>
  );
}

export function useReports() {
  return useContext(ReportsContext);
}
