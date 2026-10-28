import { useState } from "react";
import { useAudit } from "../../context/AuditContext";
import { PAGE_SIZE, ROLE_LABELS } from "../../constants";
import { downloadCsv } from "../../utils/csv";
import { formatDateTime, toLocalDateKey } from "../../utils/format";
import Button from "../../components/common/Button";
import ExportMenu from "../../components/common/ExportMenu";
import Field from "../../components/common/Field";
import Pagination from "../../components/common/Pagination";

const NONE = { action: "", from: "", to: "" };
const KNOWN = ["login", "login_failed", "view_report", "view_reporter_identity", "edit_report", "confirm_ai", "verify_report", "status_change", "export", "account_change", "role_change", "catalog_change"];

// Read-only on purpose: there is no edit or delete control.
export default function AuditLog() {
  const { logs } = useAudit();
  const [draft, setDraft] = useState(NONE);
  const [f, setF] = useState(NONE);
  const [page, setPage] = useState(1);

  const actions = [...new Set([...KNOWN, ...logs.map((l) => l.action)])];
  const rows = logs.filter((l) => {
    const day = toLocalDateKey(l.at);
    return (!f.action || l.action === f.action) && (!f.from || day >= f.from) && (!f.to || day <= f.to);
  });
  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const visible = rows.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const who = (l) => `${l.userName}${ROLE_LABELS[l.userRole] ? ` (${ROLE_LABELS[l.userRole]})` : ""}`;

  return (
    <>
      <div className="page-head">
        <div><h1 className="page-title">Audit Log</h1><p className="page-sub">Read-only. Entries cannot be edited or deleted. This demo log is kept in memory.</p></div>
        <ExportMenu onCsv={() => downloadCsv("audit-log.csv", ["Date / time", "User", "Action", "Target", "Details"], rows.map((l) => [formatDateTime(l.at), who(l), l.action, l.target, l.details]))} onPdf={() => window.print()} />
      </div>
      <form className="filters no-print" onSubmit={(e) => { e.preventDefault(); setF(draft); setPage(1); }}>
        <Field id="aAction" label="Action">
          <select id="aAction" className="control" value={draft.action} onChange={(e) => setDraft({ ...draft, action: e.target.value })}><option value="">All actions</option>{actions.map((a) => <option key={a} value={a}>{a}</option>)}</select>
        </Field>
        <Field id="aFrom" label="Date from"><input id="aFrom" type="date" className="control" value={draft.from} onChange={(e) => setDraft({ ...draft, from: e.target.value })} /></Field>
        <Field id="aTo" label="Date to"><input id="aTo" type="date" className="control" value={draft.to} onChange={(e) => setDraft({ ...draft, to: e.target.value })} /></Field>
        <div className="filters-actions"><Button type="submit">Apply filters</Button><Button variant="secondary" onClick={() => { setDraft(NONE); setF(NONE); setPage(1); }}>Clear</Button></div>
      </form>
      <section className="table-wrap">
        <table className="table">
          <thead><tr><th>Date / time</th><th>User</th><th>Action</th><th>Target</th><th>Details</th></tr></thead>
          <tbody>
            {visible.length === 0 && <tr><td colSpan={5}>No entries match.</td></tr>}
            {visible.map((l) => <tr key={l.id}><td>{formatDateTime(l.at)}</td><td>{who(l)}</td><td>{l.action}</td><td>{l.target}</td><td>{l.details}</td></tr>)}
          </tbody>
        </table>
        <Pagination page={current} pages={pages} onChange={(n) => setPage(Math.min(Math.max(1, n), pages))} />
      </section>
    </>
  );
}
