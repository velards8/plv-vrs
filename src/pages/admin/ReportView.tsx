import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAudit } from "../../context/AuditContext";
import { useAuth } from "../../context/AuthContext";
import { useOffenses } from "../../context/OffensesContext";
import { useReports } from "../../context/ReportsContext";
import { STATUS_LABELS } from "../../constants";
import { formatDateTime } from "../../utils/format";
import { cap, categoryName } from "../../utils/reports";
import Alert from "../../components/common/Alert";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import StatusBadge from "../../components/common/StatusBadge";

// Read-only report view for the Super Admin. The reporter's student number is masked until a logged reveal.
function ViewInner({ trackingId }) {
  const { user } = useAuth();
  const { logAction } = useAudit();
  const { findByTrackingId, reporters } = useReports();
  const { offenseById } = useOffenses();
  const report = findByTrackingId(trackingId);
  const [modal, setModal] = useState(false);
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState("");
  const [revealed, setRevealed] = useState(false);

  const logged = useRef(null);
  useEffect(() => {
    if (report && logged.current !== report.trackingId) {
      logged.current = report.trackingId;
      logAction({ user, action: "view_report", target: `report ${report.trackingId}` });
    }
  }, [report, user, logAction]);

  if (!report) return (<><Alert type="error">No report found for “{trackingId}”.</Alert><Link to="/admin/lookup" className="btn btn-secondary">Back to Report Lookup</Link></>);

  const ai = offenseById(report.aiOffenseId);
  const decided = offenseById(report.classifiedOffenseId);
  const identity = reporters[report.trackingId];

  const reveal = () => {
    if (!reason.trim()) { setReasonError("A reason is required."); return; }
    logAction({ user, action: "view_reporter_identity", target: `report ${report.trackingId}`, details: `Reason: ${reason.trim()}` });
    setRevealed(true);
    setModal(false);
    setReason("");
    setReasonError("");
  };

  return (
    <>
      <Link to="/admin/lookup" className="back-link">‹ Back to Report Lookup</Link>
      <div className="page-head"><h1 className="page-title">Report {report.trackingId}</h1><StatusBadge status={report.status} /></div>
      <div className="review-grid">
        <div className="stack">
          <section className="card">
            <h2>Report details (original, unedited)</h2>
            <dl className="kv">
              <dt>Submitted</dt><dd>{formatDateTime(report.submittedAt)}</dd>
              <dt>Incident date/time</dt><dd>{formatDateTime(report.incidentAt)}</dd>
              <dt>Location</dt><dd>{report.location}</dd>
              <dt>Reporter</dt><dd>{report.isAnonymous ? "Anonymous (identity hidden)" : "Identified"}</dd>
              <dt>Student(s) involved</dt><dd>{report.involved || "Not stated"}</dd>
              <dt>Category chosen</dt><dd>{categoryName(report.categoryId)}</dd>
              <dt>Description</dt><dd>{report.description}</dd>
            </dl>
            <p className="field-hint" style={{ marginTop: 10 }}>The original report always remains available.</p>
          </section>
          <section className="card">
            <h2>Evidence viewer</h2>
            {report.evidence.length === 0 ? <p className="muted" style={{ marginTop: 8 }}>No evidence attached.</p> : (
              <div className="tiles">{report.evidence.map((f, i) => <div key={i} className="tile">{f.mimeType.startsWith("image") ? "Image" : "Document"} {i + 1}<br />{Math.max(1, Math.round(f.size / 1024))} KB</div>)}</div>
            )}
          </section>
          <section className="card">
            <h2>Status history</h2>
            <ul className="history">
              {report.history.slice().reverse().map((h, i) => (
                <li key={i}><strong>{STATUS_LABELS[h.status]}</strong>{!h.visible && <span className="internal-tag">internal</span>}<br /><small>{formatDateTime(h.at)} · by {h.by || "system"}{h.note ? ` · ${h.note}` : ""}</small></li>
              ))}
            </ul>
          </section>
        </div>
        <div className="stack">
          <section className="ai-panel">
            <h2>AI suggestion (read-only)</h2>
            <p className="field-hint">Staff confirm or change it. Super Admin cannot.</p>
            <dl className="kv">
              <dt>Suggested offense</dt><dd>{ai?.name || "None"}</dd>
              <dt>Category</dt><dd>{cap(report.aiSeverity)}</dd>
              <dt>Confidence</dt><dd>{report.aiConfidence ? `${Math.round(report.aiConfidence)}%` : "—"}</dd>
              <dt>Report summary</dt><dd>{report.aiSummary || "—"}</dd>
            </dl>
            <p className="field-hint" style={{ marginTop: 8 }}>Guilt and sanctions: OSA and OPD.</p>
          </section>
          <section className="card">
            <h2>Staff decision (read-only)</h2>
            <dl className="kv">
              <dt>Classified offense</dt><dd>{decided?.name || "Not yet classified"}</dd>
              <dt>Decision</dt><dd>{cap(report.classificationDecision)}</dd>
              <dt>Classified by</dt><dd>{report.classifiedBy || "—"}</dd>
              <dt>Assigned office</dt><dd>{report.assignedOffice ? report.assignedOffice.toUpperCase() : "—"}</dd>
            </dl>
          </section>
        </div>
      </div>

      {report.isAnonymous && (
        <section className="admin-only">
          <div className="admin-only-tag">SUPER ADMIN ONLY</div>
          <div className="admin-only-body">
            <h2>Reporter Identity</h2>
            <p>Student No.&nbsp; {revealed ? <span className="revealed">{identity?.studentNumber || "Not available"}</span> : <span className="masked" aria-label="Hidden">••••••••••••</span>}</p>
            <p className="field-hint" style={{ margin: "6px 0 10px" }}>
              {revealed ? "Read from the verified account. Logged: view_reporter_identity." : "Masked by default. Read from the verified account. Every reveal is logged."}
            </p>
            {revealed ? <Button variant="secondary" onClick={() => setRevealed(false)}>Hide identity</Button> : <Button onClick={() => setModal(true)}>Reveal Identity</Button>}
          </div>
        </section>
      )}

      <Modal open={modal} title="Reveal reporter identity?" onClose={() => { setModal(false); setReasonError(""); }}>
        <p>This action is logged with your name, the report ID, the time, and your reason.</p>
        <label htmlFor="reason" className="field-label">Reason for viewing (required)</label>
        <textarea id="reason" className="control" placeholder="e.g. Report may be a prank; verifying the reporter" value={reason} onChange={(e) => setReason(e.target.value)} />
        {reasonError && <p className="field-error">{reasonError}</p>}
        <p className="field-hint" style={{ margin: "4px 0 12px" }}>Report: {report.trackingId} · Identity read from the verified account</p>
        <div className="dialog-actions"><Button variant="secondary" onClick={() => { setModal(false); setReasonError(""); }}>Cancel</Button><Button onClick={reveal}>Reveal</Button></div>
      </Modal>
    </>
  );
}

export default function ReportView() {
  const { trackingId } = useParams();
  return <ViewInner key={trackingId} trackingId={trackingId} />;
}
