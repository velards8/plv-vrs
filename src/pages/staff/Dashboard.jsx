import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useOffenses } from "../../context/OffensesContext";
import { useReports } from "../../context/ReportsContext";
import { MOCK_STUDENT_CASES } from "../../data/mockData";
import { ROLE_LABELS, STATUS_LABELS, STATUS_ORDER } from "../../constants";
import { formatDate } from "../../utils/format";
import { cap, categoryName, isRepeat, reportSeverity } from "../../utils/reports";
import BarRow from "../../components/common/BarRow";
import StatCard from "../../components/common/StatCard";
import StatusBadge from "../../components/common/StatusBadge";

export default function Dashboard() {
  const { user } = useAuth();
  const { reports } = useReports();
  const { offenseById } = useOffenses();

  const counts = STATUS_ORDER.reduce((acc, s) => ({ ...acc, [s]: reports.filter((r) => r.status === s).length }), {});
  const sev = { minor: 0, major: 0 };
  reports.forEach((r) => { const s = reportSeverity(r, offenseById); if (s) sev[s] += 1; });
  const max = Math.max(sev.minor, sev.major, 1);
  const flagged = MOCK_STUDENT_CASES.filter(isRepeat).length;
  const recent = [...reports].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)).slice(0, 5);

  return (
    <>
      <div className="page-head">
        <h1 className="page-title">Dashboard</h1>
        <span className="track-meta">Signed in as {user.fullName}, {ROLE_LABELS[user.role]}</span>
      </div>

      <div className="stat-grid">
        <StatCard label="Total reports" value={reports.length} />
        {STATUS_ORDER.map((s) => <StatCard key={s} label={STATUS_LABELS[s]} value={counts[s]} />)}
      </div>

      <div className="panel-grid">
        <section className="card">
          <h2>Minor vs major offenses</h2>
          <BarRow label="Minor" value={sev.minor} max={max} type="minor" />
          <BarRow label="Major" value={sev.major} max={max} type="major" />
          <p className="field-hint" style={{ marginTop: 10 }}>Uses the staff-confirmed offense, or the AI suggestion until staff decide.</p>
        </section>
        <section className="card">
          <h2>Reports needing attention</h2>
          <p className="muted">Unreviewed reports and repeat-offender flags.</p>
          <ul className="bullets">
            <li>{counts.submitted} new {counts.submitted === 1 ? "report" : "reports"} awaiting first review</li>
            <li>{flagged} {flagged === 1 ? "student" : "students"} flagged for repeated violations (<Link to="/staff/offense-counter">view</Link>)</li>
          </ul>
        </section>
      </div>

      <section className="table-wrap">
        <div className="page-head" style={{ marginBottom: 8 }}>
          <h2>Recent reports</h2>
          <Link to="/staff/queue" className="btn btn-secondary">View all</Link>
        </div>
        <table className="table">
          <thead><tr><th>Tracking ID</th><th>Category</th><th>Type</th><th>Date</th><th>Status</th></tr></thead>
          <tbody>
            {recent.map((r) => (
              <tr key={r.trackingId}>
                <td><Link to={`/staff/queue/${r.trackingId}`}>{r.trackingId}</Link></td>
                <td>{categoryName(r.categoryId)}</td>
                <td>{cap(reportSeverity(r, offenseById))}</td>
                <td>{formatDate(r.submittedAt)}</td>
                <td><StatusBadge status={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
