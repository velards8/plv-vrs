import { useState } from "react";
import { useOffenses } from "../../context/OffensesContext";
import { formatDateTime } from "../../utils/format";
import { cap } from "../../utils/reports";
import Button from "../common/Button";

// The AI answer is shown as-is and never overwritten. Staff confirm it or pick another offense from the catalog.
export default function AISuggestionPanel({ report, onConfirm, onEdit }) {
  const { offenses, offenseById } = useOffenses();
  const [editId, setEditId] = useState("");
  const [error, setError] = useState("");
  const aiOffense = offenseById(report.aiOffenseId);
  const decided = offenseById(report.classifiedOffenseId);

  const handleEdit = () => {
    if (!editId) { setError("Select an offense from the catalog first."); return; }
    setError("");
    onEdit(Number(editId));
    setEditId("");
  };

  return (
    <section className="ai-panel">
      <h2>AI suggestion</h2>
      <p className="field-hint">Assistive only. Staff must confirm or change it. Guilt and sanctions: OSA and PLV Discipline Committee.</p>
      {aiOffense ? (
        <>
          <dl className="kv">
            <dt>Suggested offense</dt><dd>{aiOffense.name}</dd>
            <dt>Category</dt><dd>{cap(report.aiSeverity)}</dd>
            <dt>Confidence</dt>
            <dd>
              <div className="confidence">
                <div className="bar-track"><div className="bar-fill" style={{ width: `${report.aiConfidence}%` }} /></div>
                <strong>{Math.round(report.aiConfidence)}%</strong>
              </div>
            </dd>
            <dt>Report summary</dt><dd>{report.aiSummary}</dd>
          </dl>
          <div className="btn-row">
            <Button onClick={onConfirm}>Confirm</Button>
            <Button variant="secondary" onClick={handleEdit}>Edit offense</Button>
          </div>
        </>
      ) : (
        <p style={{ margin: "12px 0" }}>No AI suggestion is available. Review the report manually and pick an offense below.</p>
      )}
      <div className="field" style={{ marginBottom: 0 }}>
        <label htmlFor="editOffense" className="field-label">Edit: offense (from catalog)</label>
        <select id="editOffense" className="control" value={editId} onChange={(e) => setEditId(e.target.value)}>
          <option value="">Select from 13 minor / 42 major</option>
          <optgroup label="Minor">{offenses.filter((o) => o.isActive && o.severity === "minor").map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}</optgroup>
          <optgroup label="Major">{offenses.filter((o) => o.isActive && o.severity === "major").map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}</optgroup>
        </select>
        {error && <p className="field-error">{error}</p>}
        {!aiOffense && <div style={{ marginTop: 8 }}><Button variant="secondary" onClick={handleEdit}>Save offense</Button></div>}
      </div>
      {decided && (
        <p className="decision-box">
          <strong>Staff decision: {cap(report.classificationDecision)}.</strong> {decided.name} ({cap(decided.severity)}) by {report.classifiedBy}, {formatDateTime(report.classifiedAt)}.
        </p>
      )}
    </section>
  );
}
