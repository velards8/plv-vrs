import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAudit } from "../../context/AuditContext";
import { useOffenses } from "../../context/OffensesContext";
import { useReports } from "../../context/ReportsContext";
import { PAGE_SIZE, STATUS_LABELS, STATUS_ORDER } from "../../constants";
import { downloadCsv } from "../../utils/csv";
import { formatDate, toLocalDateKey } from "../../utils/format";
import { cap, categoryName, reportSeverity } from "../../utils/reports";
import Button from "../../components/common/Button";
import ExportMenu from "../../components/common/ExportMenu";
import Field from "../../components/common/Field";
import Pagination from "../../components/common/Pagination";
import StatusBadge from "../../components/common/StatusBadge";

const NO_FILTER = { status: "", from: "", to: "" };

function offenseCell(r, offenseById) {
  const decided = offenseById(r.classifiedOffenseId);
  if (decided) return `Confirmed: ${decided.name} · ${cap(decided.severity)}`;
  const ai = offenseById(r.aiOffenseId);
  return ai ? `AI: ${ai.name} · ${cap(ai.severity)}` : "No AI suggestion";
}

export default function ReportQueue() {
  const { user } = useAuth();
  const { logAction } = useAudit();
  const { reports } = useReports();
  const { offenseById } = useOffenses();
  const [draft, setDraft] = useState(NO_FILTER);
  const [applied, setApplied] = useState(NO_FILTER);
  const [page, setPage] = useState(1);

  const rows = reports
    .filter((r) => {
      const day = toLocalDateKey(r.submittedAt);
      return (!applied.status || r.status === applied.status) && (!applied.from || day >= applied.from) && (!applied.to || day <= applied.to);
    })
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const visible = rows.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const apply = (e) => { e.preventDefault(); setApplied(draft); setPage(1); };
  const clear = () => { setDraft(NO_FILTER); setApplied(NO_FILTER); setPage(1); };

  // Exports never include reporter identity, only "Anonymous" or "Identified".
  const exportCsv = () => {
    downloadCsv(
      "report-queue.csv",
      ["Tracking ID", "Submitted", "Reporter", "Category", "Offense", "Type", "Status"],
      rows.map((r) => [r.trackingId, formatDate(r.submittedAt), r.isAnonymous ? "Anonymous" : "Identified", categoryName(r.categoryId), offenseCell(r, offenseById), cap(reportSeverity(r, offenseById)), STATUS_LABELS[r.status]])
    );
    logAction({ user, action: "export", target: "report queue", details: `CSV, ${rows.length} rows` });
  };
  const exportPdf = () => {
    logAction({ user, action: "export", target: "report queue", details: "Print / PDF" });
    window.print();
  };

  return (
    <>
      <div className="page-head">
        <h1 className="page-title">Report Queue</h1>
        <ExportMenu onCsv={exportCsv} onPdf={exportPdf} />
      </div>

      <form className="filters no-print" onSubmit={apply}>
        <Field id="fStatus" label="Status">
          <select id="fStatus" className="control" value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })}>
            <option value="">All statuses</option>
            {STATUS_ORDER.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
        </Field>
        <Field id="fFrom" label="Date from">
          <input id="fFrom" type="date" className="control" value={draft.from} max={draft.to || undefined} onChange={(e) => setDraft({ ...draft, from: e.target.value })} />
        </Field>
        <Field id="fTo" label="Date to">
          <input id="fTo" type="date" className="control" value={draft.to} min={draft.from || undefined} onChange={(e) => setDraft({ ...draft, to: e.target.value })} />
        </Field>
        <div className="filters-actions">
          <Button type="submit">Apply filters</Button>
          <Button variant="secondary" onClick={clear}>Clear</Button>
        </div>
        <p className="field-hint" style={{ width: "100%" }}>Basic filters by status and date. Search and offense filters are Phase 2.</p>
      </form>

      <section className="table-wrap">
        <table className="table">
          <thead><tr><th>Tracking ID</th><th>Date</th><th>Reporter</th><th>AI-suggested offense</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {visible.length === 0 && <tr><td colSpan={6}>No reports match these filters. Clear the filters to see all reports.</td></tr>}
            {visible.map((r) => (
              <tr key={r.trackingId}>
                <td>{r.trackingId}</td>
                <td>{formatDate(r.submittedAt)}</td>
                <td>{r.isAnonymous ? "Anonymous" : "Identified"}</td>
                <td>{offenseCell(r, offenseById)}</td>
                <td><StatusBadge status={r.status} /></td>
                <td><Link to={`/staff/queue/${r.trackingId}`}>Review</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination page={current} pages={pages} onChange={(n) => setPage(Math.min(Math.max(1, n), pages))} />
      </section>
    </>
  );
}
