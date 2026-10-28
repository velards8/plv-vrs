import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useReports } from "../../context/ReportsContext";
import { OFFENSE_CATEGORIES } from "../../data/mockData";
import Alert from "../../components/common/Alert";
import Button from "../../components/common/Button";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Field from "../../components/common/Field";
import EvidenceDropzone from "../../components/report/EvidenceDropzone";

const EMPTY = { category: "", incidentAt: "", location: "", involved: "", description: "" };

export default function ReportViolation() {
  const { user } = useAuth();
  const { addReport } = useReports();
  const navigate = useNavigate();

  const blankReporter = { studentNumber: user.studentNumber || "", fullName: user.fullName || "", section: user.section || "" };
  const [anonymous, setAnonymous] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [reporter, setReporter] = useState(blankReporter);
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmOpen, setConfirmOpen] = useState(false);

  const nowLocal = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const setRep = (key) => (e) => setReporter({ ...reporter, [key]: e.target.value });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.category) e.category = "Please select an offense category.";
    if (!form.incidentAt) e.incidentAt = "Please enter the date and time of the incident.";
    else if (new Date(form.incidentAt) > new Date()) e.incidentAt = "The incident date cannot be in the future.";
    if (!form.location.trim()) e.location = "Please enter where the incident happened.";
    if (!form.description.trim()) e.description = "Please describe what happened.";
    if (anonymous && files.length === 0) e.evidence = "Anonymous reports require supporting evidence.";
    if (!anonymous) {
      if (!reporter.studentNumber.trim()) e.studentNumber = "Student ID number is required.";
      if (!reporter.fullName.trim()) e.fullName = "Full name is required.";
    }
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setConfirmOpen(true);
  };

  const reset = () => {
    setAnonymous(false);
    setForm(EMPTY);
    setReporter(blankReporter);
    setFiles([]);
    setErrors({});
  };

  const confirmSubmit = () => {
    const trackingId = addReport({
      report: {
        isAnonymous: anonymous,
        categoryId: Number(form.category),
        description: form.description.trim(),
        incidentAt: form.incidentAt,
        location: form.location.trim(),
        involved: form.involved.trim(),
        // Original file names are not kept (schema rule 6). Only type and size.
        evidence: files.map((f) => ({ mimeType: f.type || "unknown", size: f.size })),
      },
      reporter: { userId: user.id, studentNumber: reporter.studentNumber.trim(), fullName: reporter.fullName.trim(), section: reporter.section.trim() },
    });
    setConfirmOpen(false);
    navigate("/report/submitted", { state: { trackingId } });
  };

  const errorList = Object.values(errors);
  const evidenceMissing = anonymous && errors.evidence;

  return (
    <>
      <h1 className="page-title">Report a Violation</h1>
      <p className="page-sub">Fields marked * are required.</p>

      {errorList.length > 0 && (
        <Alert
          type="error"
          actions={evidenceMissing && (
            <>
              <Button variant="secondary" onClick={() => { setAnonymous(false); setErrors({}); }}>Switch to identified report</Button>
              <Button variant="secondary" onClick={() => { reset(); navigate("/home"); }}>Cancel report</Button>
            </>
          )}
        >
          {errorList[0]}
          {errorList.length > 1 && ` (${errorList.length - 1} more to fix below)`}
        </Alert>
      )}

      <form className="card" onSubmit={handleSubmit} noValidate>
        <label className="check-row">
          <input type="checkbox" checked={anonymous} onChange={(e) => { setAnonymous(e.target.checked); setErrors({}); }} />
          Submit anonymously
        </label>
        <p className="field-hint">When ticked, the reporter details below are hidden and your identity is never shown to OSA / OPD.</p>

        <div className="form-grid">
          <div>
            <Field id="category" label="Offense category" required error={errors.category}>
              <select id="category" className="control" value={form.category} onChange={set("category")}>
                <option value="">Select category</option>
                {OFFENSE_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field id="incidentAt" label="Date and time of incident" required error={errors.incidentAt}>
              <input id="incidentAt" type="datetime-local" className="control" max={nowLocal} value={form.incidentAt} onChange={set("incidentAt")} />
            </Field>
            <Field id="location" label="Location" required error={errors.location}>
              <input id="location" className="control" placeholder="Building / room / online platform" value={form.location} onChange={set("location")} />
            </Field>
            <Field id="involved" label="Student(s) involved">
              <input id="involved" className="control" placeholder="Name(s), section if known" value={form.involved} onChange={set("involved")} />
            </Field>
          </div>
          <div>
            <Field id="description" label="Report description" required error={errors.description}>
              <textarea id="description" className="control" placeholder="Describe what happened, who was involved, and what you saw." value={form.description} onChange={set("description")} />
            </Field>
            <div className="field">
              <label htmlFor="evidence" className="field-label">
                Evidence upload{anonymous ? " *" : " (optional for identified)"}
              </label>
              <EvidenceDropzone files={files} onChange={setFiles} error={errors.evidence} />
            </div>
          </div>
        </div>

        {!anonymous && (
          <div className="reporter-box">
            <h3>Reporter details (hidden when anonymous)</h3>
            <div className="reporter-grid">
              <Field id="studentNumber" label="Student ID number" required error={errors.studentNumber}>
                <input id="studentNumber" className="control" value={reporter.studentNumber} onChange={setRep("studentNumber")} />
              </Field>
              <Field id="fullName" label="Full name" required error={errors.fullName}>
                <input id="fullName" className="control" value={reporter.fullName} onChange={setRep("fullName")} />
              </Field>
              <Field id="section" label="Section (optional)">
                <input id="section" className="control" value={reporter.section} onChange={setRep("section")} />
              </Field>
            </div>
          </div>
        )}

        <div className="form-actions">
          <Button type="submit">Submit report</Button>
          <Button variant="secondary" onClick={reset}>Clear / Reset</Button>
        </div>
      </form>

      <ConfirmDialog
        open={confirmOpen}
        title="Submit this report?"
        message="You cannot edit it after submission."
        onConfirm={confirmSubmit}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
