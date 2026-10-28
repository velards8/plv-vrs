import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAudit } from "../../context/AuditContext";
import { useOffenses } from "../../context/OffensesContext";
import { useReports } from "../../context/ReportsContext";
import { STATUS_LABELS, STATUS_ORDER } from "../../constants";
import { formatDateTime } from "../../utils/format";
import { categoryName } from "../../utils/reports";
import Alert from "../../components/common/Alert";
import Button from "../../components/common/Button";
import StatusBadge from "../../components/common/StatusBadge";
import AISuggestionPanel from "../../components/report/AISuggestionPanel";
import VerificationPanel from "../../components/report/VerificationPanel";

function ReviewInner({ trackingId }) {
  const { user } = useAuth();
  const { logAction } = useAudit();
  const { findByTrackingId, classifyReport, updateStatus, recordVerification, getIdentifiedReporter } = useReports();
  const { offenseById } = useOffenses();
  const report = findByTrackingId(trackingId);

  const [statusChoice, setStatusChoice] = useState(null); // null = follow the report's current status
  const [note, setNote] = useState("");
  const [visible, setVisible] = useState(true);
  const [statusError, setStatusError] = useState("");
  const [notice, setNotice] = useState("");

  // Log one view per opened report (the ref also prevents a double log in React StrictMode).
  const logged = useRef(null);
  useEffect(() => {
    if (report && logged.current !== report.trackingId) {
      logged.current = report.trackingId;
      logAction({ user, action: "view_report", target: `report ${report.trackingId}` });
    }
  }, [report, user, logAction]);

  if (!report) {
    return (
      <>
        <Alert type="error">No report found for “{trackingId}”.</Alert>
        <Link to="/staff/queue" className="btn btn-secondary">Back to queue</Link>
      </>
    );
  }

  const reporter = getIdentifiedReporter(report); // null for anonymous reports, by design
  const chosen = statusChoice ?? report.status;

  const decide = (offenseId, decision) => {
    classifyReport(report.trackingId, { offenseId, decision, staff: user });
    const offense = offenseById(offenseId);
    logAction({
      user,
      action: decision === "confirmed" ? "confirm_ai" : "edit_report",
      target: `report ${report.trackingId}`,
      details: decision === "confirmed" ? "AI suggestion confirmed" : `Classification edited to ${offense.code}`,
    });
    setStatusChoice(null);
    setNotice(decision === "confirmed" ? "AI suggestion confirmed. This is now the official classification." : "Offense updated. This is now the official classification.");
  };

  const saveStatus = (e) => {
    e.preventDefault();
    setNotice("");
    if (["under_verification", "resolved"].includes(chosen) && !report.classifiedOffenseId) {
      setStatusError("Confirm or edit the offense classification first.");
      return;
    }
    if (chosen === "resolved" && !report.verificationResult) {
      setStatusError("Record the verification result first.");
      return;
    }
    if (chosen === report.status && !note.trim()) {
      setStatusError("Choose a new status or add a staff note.");
      return;
    }
    setStatusError("");
    updateStatus(report.trackingId, { status: chosen, note, visible, staff: user });
    logAction({ user, action: "status_change", target: `report ${report.trackingId}`, details: `${STATUS_LABELS[chosen]}${visible ? "" : " (internal note)"}` });
    setNote("");
    setStatusChoice(null);
    setNotice(visible && note.trim() ? "Status saved. The note is visible on the reporter’s tracking page." : "Status saved.");
  };

  const cancelStatus = () => { setStatusChoice(null); setNote(""); setVisible(true); setStatusError(""); };

  return (
    <>
      <Link to="/staff/queue" className="back-link">‹ Back to queue</Link>
      <div className="page-head">
        <h1 className="page-title">Report {report.trackingId}</h1>
        <StatusBadge status={report.status} />
      </div>
      {notice && <Alert type="success">{notice}</Alert>}

      <div className="review-grid">
        <div className="stack">
          <section className="card">
            <h2>Report details (original, unedited)</h2>
            <dl className="kv">
              <dt>Submitted</dt><dd>{formatDateTime(report.submittedAt)}</dd>
              <dt>Incident date/time</dt><dd>{formatDateTime(report.incidentAt)}</dd>
              <dt>Location</dt><dd>{report.location}</dd>
              <dt>Reporter</dt>
              <dd>{reporter ? `${reporter.fullName} (${reporter.studentNumber})` : "Anonymous (identity hidden)"}</dd>
              <dt>Student(s) involved</dt><dd>{report.involved || "Not stated"}</dd>
              <dt>Category chosen</dt><dd>{categoryName(report.categoryId)}</dd>
              <dt>Description</dt><dd>{report.description}</dd>
            </dl>
            <p className="field-hint" style={{ marginTop: 10 }}>The original report always remains available.</p>
          </section>

          <section className="card">
            <h2>Evidence viewer</h2>
            {report.evidence.length === 0 ? (
              <p className="muted" style={{ marginTop: 8 }}>No evidence attached.</p>
            ) : (
              <div className="tiles">
                {report.evidence.map((f, i) => (
                  <div key={i} className="tile">{f.mimeType.startsWith("image") ? "Image" : "Document"} {i + 1}<br />{Math.max(1, Math.round(f.size / 1024))} KB</div>
                ))}
              </div>
            )}
            <p className="field-hint" style={{ marginTop: 8 }}>File preview needs the backend, where evidence is stored in protected storage.</p>
          </section>

          <section className="card">
            <h2>Status history</h2>
            <ul className="history">
              {report.history.slice().reverse().map((h, i) => (
                <li key={i}>
                  <strong>{STATUS_LABELS[h.status]}</strong>{!h.visible && <span className="internal-tag">internal</span>}
                  <br /><small>{formatDateTime(h.at)} · by {h.by || "system"}{h.note ? ` · ${h.note}` : ""}</small>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="stack">
          <AISuggestionPanel report={report} onConfirm={() => decide(report.aiOffenseId, "confirmed")} onEdit={(id) => decide(id, "edited")} />

          <VerificationPanel
            report={report}
            onSave={(payload) => {
              recordVerification(report.trackingId, { ...payload, staff: user });
              logAction({ user, action: "verify_report", target: `report ${report.trackingId}`, details: payload.result === "verified" ? "Verified" : "Not verified" });
              setNotice("Verification recorded.");
            }}
          />

          <form className="card" onSubmit={saveStatus} noValidate>
            <h2>Update status</h2>
            {statusError && <div style={{ marginTop: 8 }}><Alert type="error">{statusError}</Alert></div>}
            <div className="field" style={{ marginTop: 8 }}>
              <label htmlFor="newStatus" className="field-label">New status</label>
              <select id="newStatus" className="control" value={chosen} onChange={(e) => setStatusChoice(e.target.value)}>
                {STATUS_ORDER.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="staffNote" className="field-label">Staff note</label>
              <textarea id="staffNote" className="control" style={{ minHeight: 80 }} value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
            <label className="check-row" style={{ fontWeight: 400 }}>
              <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} />
              Show this note to the reporter
            </label>
            <div className="form-actions">
              <Button type="submit">Save status</Button>
              <Button variant="secondary" onClick={cancelStatus}>Cancel</Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default function ReportReview() {
  const { trackingId } = useParams();
  return <ReviewInner key={trackingId} trackingId={trackingId} />;
}
