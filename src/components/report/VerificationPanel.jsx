import { useState } from "react";
import { formatDateTime } from "../../utils/format";
import Button from "../common/Button";
import Field from "../common/Field";

// Added from the flowchart (not in the wireframes): verification result, disciplinary action, referral, resolution notes.
// Findings and sanctions belong to the authorized OSA/OPD officials and the PLV Discipline Committee. Staff record their decision here.
export default function VerificationPanel({ report, onSave }) {
  const [f, setF] = useState({ result: "", studentNumber: "", fullName: "", sanction: "", action: "", referred: false, notes: "" });
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  if (report.verificationResult) {
    return (
      <section className="card">
        <h2>Verification &amp; resolution</h2>
        <dl className="kv">
          <dt>Result</dt><dd>{report.verificationResult === "verified" ? "Verified" : "Not verified"}</dd>
          <dt>Disciplinary action</dt><dd>{report.disciplinaryActionRequired ? "Required" : "Not required"}</dd>
          <dt>Referred to Committee</dt><dd>{report.referredToCommittee ? "Yes" : "No"}</dd>
          <dt>Resolution notes</dt><dd>{report.resolutionNotes || "None"}</dd>
        </dl>
        <p className="field-hint" style={{ marginTop: 8 }}>Recorded. Set the status to Resolved when the case is closed.</p>
      </section>
    );
  }

  const submit = (e) => {
    e.preventDefault();
    const err = {};
    if (!report.classifiedOffenseId) err.general = "Confirm or edit the offense classification first.";
    if (!f.result) err.result = "Choose the verification result.";
    if (f.result === "verified" && !f.studentNumber.trim()) err.studentNumber = "Student ID number is required.";
    if (f.result === "verified" && !f.fullName.trim()) err.fullName = "Student name is required.";
    if (!f.action) err.action = "Answer: disciplinary action required?";
    setErrors(err);
    if (Object.keys(err).length) return;
    onSave({
      result: f.result,
      disciplinaryRequired: f.action === "yes",
      referred: f.action === "yes" && f.referred,
      notes: f.notes,
      sanction: f.sanction,
      student: f.result === "verified" ? { studentNumber: f.studentNumber.trim(), fullName: f.fullName.trim() } : null,
    });
  };

  return (
    <form className="card" onSubmit={submit} noValidate>
      <h2>Verification &amp; resolution</h2>
      <p className="field-hint">Record the outcome after review. Findings and sanctions are decided by the authorized OSA/OPD officials and the PLV Discipline Committee.</p>
      {errors.general && <p className="field-error" style={{ marginTop: 6 }}>{errors.general}</p>}
      <div style={{ marginTop: 10 }}>
        <Field id="vResult" label="Verification result" required error={errors.result}>
          <select id="vResult" className="control" value={f.result} onChange={set("result")}>
            <option value="">Select result</option>
            <option value="verified">Verified</option>
            <option value="not_verified">Not verified</option>
          </select>
        </Field>
        {f.result === "verified" && (
          <>
            <Field id="vStudent" label="Student found responsible: ID number" required error={errors.studentNumber}>
              <input id="vStudent" className="control" value={f.studentNumber} onChange={set("studentNumber")} />
            </Field>
            <Field id="vName" label="Student found responsible: full name" required error={errors.fullName}>
              <input id="vName" className="control" value={f.fullName} onChange={set("fullName")} />
            </Field>
            <Field id="vSanction" label="Approved sanction (if already decided)">
              <input id="vSanction" className="control" value={f.sanction} onChange={set("sanction")} />
            </Field>
          </>
        )}
        <fieldset className="radio-group">
          <legend className="field-label">Disciplinary action required? *</legend>
          <label><input type="radio" name="action" value="yes" checked={f.action === "yes"} onChange={set("action")} /> Yes</label>
          <label><input type="radio" name="action" value="no" checked={f.action === "no"} onChange={set("action")} /> No</label>
          {errors.action && <p className="field-error">{errors.action}</p>}
        </fieldset>
        {f.action === "yes" && (
          <label className="check-row" style={{ fontWeight: 400, margin: "8px 0 12px" }}>
            <input type="checkbox" checked={f.referred} onChange={(e) => setF({ ...f, referred: e.target.checked })} />
            Refer to the PLV Discipline Committee
          </label>
        )}
        <Field id="vNotes" label="Resolution notes">
          <textarea id="vNotes" className="control" style={{ minHeight: 70 }} value={f.notes} onChange={set("notes")} />
        </Field>
      </div>
      <Button type="submit">Save verification</Button>
    </form>
  );
}
