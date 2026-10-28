import { useState } from "react";
import { useAudit } from "../../context/AuditContext";
import { useAuth } from "../../context/AuthContext";
import { useUsers } from "../../context/UsersContext";
import { PAGE_SIZE, ROLE_LABELS } from "../../constants";
import Alert from "../../components/common/Alert";
import Button from "../../components/common/Button";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Field from "../../components/common/Field";
import Pagination from "../../components/common/Pagination";

const STAFF_ROLES = ["osa", "opd", "discipline_committee", "super_admin"];
const STATUS_TEXT = { active: "Active", restricted: "Restricted", deactivated: "Deactivated" };
const NONE = { search: "", role: "", status: "" };
const BLANK = { id: null, fullName: "", email: "", role: "" };

export default function UsersRoles() {
  const { user: me } = useAuth();
  const { logAction } = useAudit();
  const { users, createStaff, updateStaff, setAccountStatus, resetPassword } = useUsers();
  const [draft, setDraft] = useState(NONE);
  const [applied, setApplied] = useState(NONE);
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(BLANK);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const staff = users.filter((u) => u.role !== "student");
  const rows = staff.filter((u) => {
    const q = applied.search.trim().toLowerCase();
    return (!q || u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) && (!applied.role || u.role === applied.role) && (!applied.status || u.accountStatus === applied.status);
  });
  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const visible = rows.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const editing = Boolean(form.id);

  const save = (e) => {
    e.preventDefault();
    const err = {};
    const email = form.email.trim();
    if (!form.fullName.trim()) err.fullName = "Full name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) err.email = "Enter a valid email address.";
    else if (users.some((u) => u.email.toLowerCase() === email.toLowerCase() && u.id !== form.id)) err.email = "This email is already used.";
    if (!form.role) err.role = "Select one role.";
    const old = editing ? users.find((u) => u.id === form.id) : null;
    if (old && old.id === me.id && old.role !== form.role) err.role = "You cannot change your own role.";
    setErrors(err);
    if (Object.keys(err).length) return;

    if (editing) {
      updateStaff(form.id, { fullName: form.fullName.trim(), email, role: form.role });
      const roleChanged = old.role !== form.role;
      logAction({ user: me, action: roleChanged ? "role_change" : "account_change", target: `user ${old.username || old.email}`, details: roleChanged ? `${ROLE_LABELS[old.role]} → ${ROLE_LABELS[form.role]}` : "Account details edited" });
      setNotice({ type: "success", text: "Account updated." });
    } else {
      const created = createStaff({ fullName: form.fullName.trim(), email, role: form.role });
      logAction({ user: me, action: "account_change", target: `user ${email}`, details: `Created staff account (${ROLE_LABELS[form.role]})` });
      setNotice({ type: "success", text: `Account created. Temporary password (mock): ${created.password}. The real system will email a setup link.` });
    }
    setForm(BLANK);
  };

  const startEdit = (u) => {
    setForm({ id: u.id, fullName: u.fullName, email: u.email, role: u.role });
    setErrors({});
    document.getElementById("staffForm")?.scrollIntoView({ behavior: "smooth" });
  };

  const ask = (type, u) => {
    if (u.id === me.id && type !== "reset") { setNotice({ type: "error", text: "You cannot restrict or deactivate your own account." }); return; }
    setConfirm({ type, u });
  };
  const doConfirm = () => {
    const { type, u } = confirm;
    if (type === "reset") {
      const pw = resetPassword(u.id);
      setNotice({ type: "success", text: `Password reset for ${u.fullName}. Temporary password (mock): ${pw}.` });
      logAction({ user: me, action: "account_change", target: `user ${u.username || u.email}`, details: "Password reset" });
    } else {
      const status = { restrict: "restricted", deactivate: "deactivated", activate: "active" }[type];
      setAccountStatus(u.id, status);
      logAction({ user: me, action: "account_change", target: `user ${u.username || u.email}`, details: `Account ${status}` });
      setNotice({ type: "success", text: `${u.fullName}: account ${status}.` });
    }
    setConfirm(null);
  };
  const messages = { reset: "Reset the password for", restrict: "Restrict the account of", deactivate: "Deactivate the account of", activate: "Activate the account of" };

  return (
    <>
      <div className="page-head">
        <div><h1 className="page-title">Users &amp; Roles</h1><p className="page-sub">Staff accounts only. One role per account.</p></div>
        <Button onClick={() => { setForm(BLANK); setErrors({}); document.getElementById("staffForm")?.scrollIntoView({ behavior: "smooth" }); document.getElementById("fn")?.focus(); }}>+ Create Staff account</Button>
      </div>
      {notice && <Alert type={notice.type}>{notice.text}</Alert>}

      <form className="filters" onSubmit={(e) => { e.preventDefault(); setApplied(draft); setPage(1); }}>
        <Field id="uSearch" label="Search"><input id="uSearch" className="control" placeholder="Name or email" value={draft.search} onChange={(e) => setDraft({ ...draft, search: e.target.value })} /></Field>
        <Field id="uRole" label="Role">
          <select id="uRole" className="control" value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })}><option value="">All roles</option>{STAFF_ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}</select>
        </Field>
        <Field id="uStatus" label="Status">
          <select id="uStatus" className="control" value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })}><option value="">All</option>{Object.entries(STATUS_TEXT).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
        </Field>
        <div className="filters-actions"><Button type="submit">Apply filters</Button><Button variant="secondary" onClick={() => { setDraft(NONE); setApplied(NONE); setPage(1); }}>Clear</Button></div>
      </form>

      <section className="table-wrap" style={{ marginBottom: 16 }}>
        <table className="table">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {visible.length === 0 && <tr><td colSpan={5}>No accounts match.</td></tr>}
            {visible.map((u) => (
              <tr key={u.id}>
                <td>{u.fullName}</td><td>{u.email}</td><td>{ROLE_LABELS[u.role]}</td><td>{STATUS_TEXT[u.accountStatus]}</td>
                <td>
                  <div className="row-actions">
                    <button type="button" onClick={() => startEdit(u)}>Edit</button>
                    <button type="button" onClick={() => ask("reset", u)}>Reset</button>
                    {u.accountStatus !== "restricted" && <button type="button" onClick={() => ask("restrict", u)}>Restrict</button>}
                    {u.accountStatus !== "deactivated" && <button type="button" onClick={() => ask("deactivate", u)}>Deactivate</button>}
                    {u.accountStatus !== "active" && <button type="button" onClick={() => ask("activate", u)}>Activate</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination page={current} pages={pages} onChange={(n) => setPage(Math.min(Math.max(1, n), pages))} />
      </section>

      <form id="staffForm" className="card" onSubmit={save} noValidate>
        <h2>{editing ? "Edit staff account" : "Create staff account"}</h2>
        <div className="reporter-grid" style={{ marginTop: 10 }}>
          <Field id="fn" label="Full name" required error={errors.fullName}><input id="fn" className="control" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></Field>
          <Field id="fe" label="Email" required error={errors.email}><input id="fe" className="control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
          <Field id="fr" label="Role (one only)" required error={errors.role}>
            <select id="fr" className="control" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option value="">Select one role</option>{STAFF_ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}</select>
          </Field>
        </div>
        <p className="field-hint">Every account change is recorded in the audit log.</p>
        <div className="form-actions"><Button type="submit">Save account</Button><Button variant="secondary" onClick={() => { setForm(BLANK); setErrors({}); }}>Cancel</Button></div>
      </form>

      <ConfirmDialog open={Boolean(confirm)} title="Please confirm" message={confirm ? `${messages[confirm.type]} ${confirm.u.fullName}?` : ""} onConfirm={doConfirm} onCancel={() => setConfirm(null)} />
    </>
  );
}
