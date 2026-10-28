import { useState } from "react";
import { useAudit } from "../../context/AuditContext";
import { useAuth } from "../../context/AuthContext";
import { useOffenses } from "../../context/OffensesContext";
import { cap } from "../../utils/reports";
import Alert from "../../components/common/Alert";
import Button from "../../components/common/Button";
import Field from "../../components/common/Field";
import Pagination from "../../components/common/Pagination";

const BLANK = { id: null, code: "", description: "", severity: "minor", isActive: true };
const PER_PAGE = 10;

export default function OffenseCatalog() {
  const { user } = useAuth();
  const { logAction } = useAudit();
  const { offenses, codeTaken, saveOffense, setActive } = useOffenses();
  const [form, setForm] = useState(BLANK);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [notice, setNotice] = useState("");

  const minor = offenses.filter((o) => o.severity === "minor").length;
  const pages = Math.max(1, Math.ceil(offenses.length / PER_PAGE));
  const current = Math.min(page, pages);
  const visible = offenses.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const save = (e) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!form.code.trim()) err.code = "Offense code is required.";
    else if (form.code.trim().length > 20) err.code = "Use 20 characters or fewer.";
    else if (codeTaken(form.code, form.id)) err.code = "This code is already used. Codes must be unique.";
    if (!form.description.trim()) err.description = "Description is required.";
    setErrors(err);
    if (Object.keys(err).length) return;
    saveOffense(form);
    logAction({ user, action: "catalog_change", target: `offense ${form.code.trim()}`, details: form.id ? "Offense edited" : "Offense added" });
    setNotice(form.id ? "Offense updated." : "Offense added.");
    setForm(BLANK);
  };
  const toggle = (o) => {
    setActive(o.id, !o.isActive);
    logAction({ user, action: "catalog_change", target: `offense ${o.code}`, details: o.isActive ? "Offense retired" : "Offense activated" });
    setNotice(`${o.code} ${o.isActive ? "retired" : "activated"}.`);
  };

  return (
    <>
      <div className="page-head">
        <div><h1 className="page-title">Offense Catalog</h1><p className="page-sub">Based on the Revised Student Code of Conduct. {minor} minor · {offenses.length - minor} major. Placeholder entries until the official list is loaded.</p></div>
        <Button onClick={() => { setForm(BLANK); setErrors({}); document.getElementById("oc")?.focus(); }}>+ Add offense</Button>
      </div>
      {notice && <Alert type="success">{notice}</Alert>}
      <div className="two-panel">
        <section className="table-wrap">
          <table className="table">
            <thead><tr><th>No.</th><th>Code</th><th>Description</th><th>Type</th><th>Action</th></tr></thead>
            <tbody>
              {visible.map((o) => (
                <tr key={o.id} style={o.isActive ? undefined : { opacity: 0.6 }}>
                  <td>{o.id}</td><td>{o.code}</td><td>{o.description}{!o.isActive && " (retired)"}</td><td>{cap(o.severity)}</td>
                  <td><div className="row-actions"><button type="button" onClick={() => { setForm({ id: o.id, code: o.code, description: o.description, severity: o.severity, isActive: o.isActive }); setErrors({}); }}>Edit</button><button type="button" onClick={() => toggle(o)}>{o.isActive ? "Retire" : "Activate"}</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination page={current} pages={pages} onChange={(n) => setPage(Math.min(Math.max(1, n), pages))} />
        </section>
        <form className="card" onSubmit={save} noValidate>
          <h2>{form.id ? "Edit offense" : "Add offense"}</h2>
          <div style={{ marginTop: 10 }}>
            <Field id="oc" label="Offense code (unique)" error={errors.code}><input id="oc" className="control" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} /></Field>
            <Field id="od" label="Description" error={errors.description}><textarea id="od" className="control" style={{ minHeight: 90 }} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
            <p className="field-label">Type</p>
            <div className="toggle-group" role="group" aria-label="Type" style={{ marginBottom: 12 }}>
              <button type="button" aria-pressed={form.severity === "minor"} onClick={() => setForm({ ...form, severity: "minor" })}>Minor</button>
              <button type="button" aria-pressed={form.severity === "major"} onClick={() => setForm({ ...form, severity: "major" })}>Major</button>
            </div>
            <label className="check-row" style={{ fontWeight: 400 }}><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />Active (retire instead of delete)</label>
            <p className="field-hint" style={{ marginTop: 6 }}>Code must be unique (duplicate check). Change is recorded as catalog_change.</p>
          </div>
          <div className="form-actions"><Button type="submit">Validate &amp; save</Button><Button variant="secondary" onClick={() => { setForm(BLANK); setErrors({}); }}>Cancel</Button></div>
        </form>
      </div>
    </>
  );
}
