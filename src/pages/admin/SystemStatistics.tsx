import { useState } from "react";
import { useAudit } from "../../context/AuditContext";
import { useAuth } from "../../context/AuthContext";
import { useOffenses } from "../../context/OffensesContext";
import { useReports } from "../../context/ReportsContext";
import { STATUS_LABELS, STATUS_ORDER } from "../../constants";
import { downloadCsv } from "../../utils/csv";
import { toLocalDateKey } from "../../utils/format";
import BarRow from "../../components/common/BarRow";
import Button from "../../components/common/Button";
import ExportMenu from "../../components/common/ExportMenu";
import Field from "../../components/common/Field";
import StatCard from "../../components/common/StatCard";

const NONE = { from: "", to: "", status: "", offense: "", office: "" };

export default function SystemStatistics() {
  const { user } = useAuth();
  const { logAction } = useAudit();
  const { reports } = useReports();
  const { offenses, offenseById } = useOffenses();
  const [draft, setDraft] = useState(NONE);
  const [f, setF] = useState(NONE);

  const offenseOf = (r) => offenseById(r.classifiedOffenseId || r.aiOffenseId);
  const rows = reports.filter((r) => {
    const day = toLocalDateKey(r.submittedAt);
    const office = r.assignedOffice || "unassigned";
    return (!f.from || day >= f.from) && (!f.to || day <= f.to) && (!f.status || r.status === f.status) && (!f.offense || offenseOf(r)?.id === Number(f.offense)) && (!f.office || office === f.office);
  });

  const sev = (s) => rows.filter((r) => offenseOf(r)?.severity === s).length;
  const offices = [["osa", "OSA"], ["opd", "OPD"], ["unassigned", "Unassigned"]];
  const table = [...offices.map(([k, label]) => ({ label, list: rows.filter((r) => (r.assignedOffice || "unassigned") === k) })), { label: "All offices", list: rows }];
  const countBy = (list, s) => list.filter((r) => r.status === s).length;

  const byOffense: Record<string, number> = {};
  rows.forEach((r) => { const o = offenseOf(r); if (o) byOffense[o.id] = (byOffense[o.id] || 0) + 1; });
  const top = Object.entries(byOffense).map(([id, n]) => ({ o: offenseById(Number(id)), n })).sort((a, b) => b.n - a.n).slice(0, 8);
  const max = Math.max(1, ...top.map((t) => t.n));

  // No reporter identities in this export.
  const exportCsv = () => {
    downloadCsv("system-statistics.csv", ["Office", ...STATUS_ORDER.map((s) => STATUS_LABELS[s]), "Total"], table.map((t) => [t.label, ...STATUS_ORDER.map((s) => countBy(t.list, s)), t.list.length]));
    logAction({ user, action: "export", target: "system statistics", details: "CSV" });
  };
  const exportPdf = () => { logAction({ user, action: "export", target: "system statistics", details: "Print / PDF" }); window.print(); };

  return (
    <>
      <div className="page-head">
        <div><h1 className="page-title">System Statistics</h1><p className="page-sub">System-wide totals for monitoring. No reporter identities appear here.</p></div>
        <ExportMenu onCsv={exportCsv} onPdf={exportPdf} />
      </div>
      <form className="filters no-print" onSubmit={(e) => { e.preventDefault(); setF(draft); }}>
        <Field id="sFrom" label="Date from"><input id="sFrom" type="date" className="control" value={draft.from} onChange={(e) => setDraft({ ...draft, from: e.target.value })} /></Field>
        <Field id="sTo" label="Date to"><input id="sTo" type="date" className="control" value={draft.to} onChange={(e) => setDraft({ ...draft, to: e.target.value })} /></Field>
        <Field id="sStatus" label="Status">
          <select id="sStatus" className="control" value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })}><option value="">All</option>{STATUS_ORDER.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}</select>
        </Field>
        <Field id="sOffense" label="Offense">
          <select id="sOffense" className="control" value={draft.offense} onChange={(e) => setDraft({ ...draft, offense: e.target.value })}><option value="">All</option>{offenses.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}</select>
        </Field>
        <Field id="sOffice" label="Office">
          <select id="sOffice" className="control" value={draft.office} onChange={(e) => setDraft({ ...draft, office: e.target.value })}><option value="">All</option>{offices.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
        </Field>
        <div className="filters-actions"><Button type="submit">Apply filters</Button><Button variant="secondary" onClick={() => { setDraft(NONE); setF(NONE); }}>Clear</Button></div>
      </form>
      <div className="stat-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        <StatCard label="Total reports" value={rows.length} />
        <StatCard label="Minor offenses" value={sev("minor")} />
        <StatCard label="Major offenses" value={sev("major")} />
        <StatCard label="Resolved" value={countBy(rows, "resolved")} />
      </div>
      <section className="table-wrap" style={{ marginBottom: 16 }}>
        <table className="table">
          <thead><tr><th>Office</th>{STATUS_ORDER.map((s) => <th key={s}>{STATUS_LABELS[s]}</th>)}<th>Total</th></tr></thead>
          <tbody>{table.map((t) => <tr key={t.label}><td>{t.label}</td>{STATUS_ORDER.map((s) => <td key={s}>{countBy(t.list, s)}</td>)}<td>{t.list.length}</td></tr>)}</tbody>
        </table>
      </section>
      <section className="card">
        <h2>Reports by offense</h2>
        {top.length === 0 ? <p className="muted" style={{ marginTop: 8 }}>No reports match the filters.</p> : top.map((t) => <BarRow key={t.o.id} label={t.o.code} value={t.n} max={max} type={t.o.severity} />)}
        <p className="field-hint" style={{ marginTop: 10 }}>Top 8 offenses. Uses the staff-confirmed offense, or the AI suggestion until staff decide.</p>
      </section>
    </>
  );
}
