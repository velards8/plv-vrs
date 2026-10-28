import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useAudit } from "../../context/AuditContext";
import { useOffenses } from "../../context/OffensesContext";
import { useReports } from "../../context/ReportsContext";
import { MOCK_STUDENT_CASES } from "../../data/mockData";
import { downloadCsv } from "../../utils/csv";
import { cap, isRepeat } from "../../utils/reports";
import Button from "../../components/common/Button";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import ExportMenu from "../../components/common/ExportMenu";

export default function OffenseCounter() {
  const { user } = useAuth();
  const { logAction } = useAudit();
  const { offenses, offenseById } = useOffenses();
  const { confirmedViolations } = useReports();
  const [selected, setSelected] = useState(null);

  // Demo rows plus every violation staff confirmed through the Verification panel.
  const cases = MOCK_STUDENT_CASES.map((c) => ({ ...c }));
  confirmedViolations.forEach((v) => {
    const row = cases.find((c) => c.studentNumber === v.studentNumber && c.offenseId === v.offenseId);
    if (row) row.confirmed += 1;
    else cases.push({ studentNumber: v.studentNumber, name: v.name, offenseId: v.offenseId, reported: 0, confirmed: 1 });
  });

  const exportCsv = () => {
    downloadCsv(
      "offense-counter.csv",
      ["Student ID", "Name", "Offense", "Type", "Reported (unconfirmed)", "OSA-confirmed", "Flag"],
      cases.map((c) => { const o = offenseById(c.offenseId); return [c.studentNumber, c.name, o?.name, cap(o?.severity), c.reported, c.confirmed, isRepeat(c) ? "Repeat" : ""]; })
    );
    logAction({ user, action: "export", target: "offense counter", details: "CSV" });
  };
  const exportPdf = () => {
    logAction({ user, action: "export", target: "offense counter", details: "Print / PDF" });
    window.print();
  };

  const selOffense = selected && offenseById(selected.offenseId);
  const minor = offenses.filter((o) => o.severity === "minor").length;

  return (
    <>
      <div className="page-head">
        <h1 className="page-title">Offense Counter</h1>
        <ExportMenu onCsv={exportCsv} onPdf={exportPdf} />
      </div>

      <section className="table-wrap" style={{ marginBottom: 16 }}>
        <h2>Repeat-offense flags</h2>
        <p className="field-hint" style={{ marginBottom: 8 }}>
          Reported counts are shown separately from OSA-confirmed counts. Flags are for staff review, not findings of guilt.
          Demo rule: flagged when reported plus confirmed is 2 or more. The first rows are demo data.
        </p>
        <table className="table">
          <thead><tr><th>Student ID / Name</th><th>Offense</th><th>Type</th><th>Reported (unconf.)</th><th>OSA-confirmed</th><th>Flag</th><th>Action</th></tr></thead>
          <tbody>
            {cases.map((c) => {
              const o = offenseById(c.offenseId);
              return (
                <tr key={`${c.studentNumber}-${c.offenseId}`}>
                  <td>{c.studentNumber} · {c.name}</td>
                  <td>{o?.name}</td>
                  <td>{cap(o?.severity)}</td>
                  <td>{c.reported}</td>
                  <td>{c.confirmed}</td>
                  <td>{isRepeat(c) ? <span className="flag">Repeat</span> : "—"}</td>
                  <td><button type="button" className="link-btn" style={{ color: "var(--navy)" }} onClick={() => setSelected(c)}>View cases</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <div className="panel-grid">
        <section className="table-wrap">
          <h2>Offense catalog</h2>
          <p className="field-hint" style={{ marginBottom: 8 }}>Read-only, from the Revised Student Code of Conduct (placeholder entries for now).</p>
          <div className="scroll-box">
            <table className="table">
              <thead><tr><th>No.</th><th>Offense</th><th>Type</th></tr></thead>
              <tbody>{offenses.filter((o) => o.isActive).map((o) => <tr key={o.id}><td>{o.id}</td><td>{o.name}</td><td>{cap(o.severity)}</td></tr>)}</tbody>
            </table>
          </div>
          <p className="field-hint" style={{ marginTop: 8 }}>{minor} minor · {offenses.length - minor} major (including retired offenses)</p>
        </section>
        <section className="card">
          <h2>Export reports</h2>
          <p className="muted">Summary reports (no reporter identities).</p>
          <div className="btn-row no-print">
            <Button variant="secondary" onClick={exportCsv}>Excel / CSV</Button>
            <Button variant="secondary" onClick={exportPdf}>PDF</Button>
          </div>
        </section>
      </div>

      <ConfirmDialog
        open={Boolean(selected)}
        hideCancel
        confirmLabel="Close"
        title={selected ? `${selected.name} (${selected.studentNumber})` : ""}
        message={selected ? `${selOffense?.name}: ${selected.reported} reported (unconfirmed) and ${selected.confirmed} OSA-confirmed. The full case history per student is a Phase 2 feature.` : ""}
        onConfirm={() => setSelected(null)}
        onCancel={() => setSelected(null)}
      />
    </>
  );
}
