import { useState } from "react";
import { Link } from "react-router-dom";
import { useReports } from "../../context/ReportsContext";
import { PAGE_SIZE, STATUS_LABELS, STATUS_ORDER } from "../../constants";
import { formatDate } from "../../utils/format";
import Button from "../../components/common/Button";
import Field from "../../components/common/Field";
import Pagination from "../../components/common/Pagination";
import StatusBadge from "../../components/common/StatusBadge";

const NONE = { id: "", status: "" };

export default function ReportLookup() {
  const { reports } = useReports();
  const [draft, setDraft] = useState(NONE);
  const [applied, setApplied] = useState(NONE);
  const [page, setPage] = useState(1);

  const rows = reports
    .filter((r) => (!applied.id || r.trackingId.toLowerCase().includes(applied.id.trim().toLowerCase())) && (!applied.status || r.status === applied.status))
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const visible = rows.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <>
      <h1 className="page-title">Report Lookup</h1>
      <p className="page-sub">Find a report by tracking ID. Reporter identity is not shown in this list. Every report view is logged.</p>
      <form className="filters" onSubmit={(e) => { e.preventDefault(); setApplied(draft); setPage(1); }}>
        <Field id="lId" label="Tracking ID"><input id="lId" className="control" placeholder="VRS-2026-00123" value={draft.id} onChange={(e) => setDraft({ ...draft, id: e.target.value })} /></Field>
        <Field id="lStatus" label="Status">
          <select id="lStatus" className="control" value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })}>
            <option value="">All statuses</option>
            {STATUS_ORDER.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
        </Field>
        <div className="filters-actions">
          <Button type="submit">Search</Button>
          <Button variant="secondary" onClick={() => { setDraft(NONE); setApplied(NONE); setPage(1); }}>Clear</Button>
        </div>
      </form>
      <section className="table-wrap">
        <table className="table">
          <thead><tr><th>Tracking ID</th><th>Date</th><th>Reporter</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {visible.length === 0 && <tr><td colSpan={5}>No reports found.</td></tr>}
            {visible.map((r) => (
              <tr key={r.trackingId}>
                <td>{r.trackingId}</td><td>{formatDate(r.submittedAt)}</td>
                <td>{r.isAnonymous ? "Anonymous" : "Identified"}</td>
                <td><StatusBadge status={r.status} /></td>
                <td><Link to={`/admin/lookup/${r.trackingId}`}>Open</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination page={current} pages={pages} onChange={(n) => setPage(Math.min(Math.max(1, n), pages))} />
        <p className="field-hint" style={{ marginTop: 8 }}>Read-only. Super Admin does not confirm, edit, or resolve reports.</p>
      </section>
    </>
  );
}
