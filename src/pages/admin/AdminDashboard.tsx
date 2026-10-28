import { Link } from "react-router-dom";
import { useAudit } from "../../context/AuditContext";
import { useAuth } from "../../context/AuthContext";
import { useOffenses } from "../../context/OffensesContext";
import { useReports } from "../../context/ReportsContext";
import { useUsers } from "../../context/UsersContext";
import { OFFENSE_CATEGORIES } from "../../data/mockData";
import { ROLE_LABELS, STATUS_LABELS, STATUS_ORDER } from "../../constants";
import StatCard from "../../components/common/StatCard";

// No wireframe for this page. Built from the Super Admin procedure (step 2).
export default function AdminDashboard() {
  const { user } = useAuth();
  const { users } = useUsers();
  const { reports } = useReports();
  const { offenses } = useOffenses();
  const { logs } = useAudit();

  const staff = users.filter((u) => u.role !== "student");
  const roles = ["osa", "opd", "discipline_committee", "super_admin"];
  const blocked = staff.filter((u) => u.accountStatus !== "active").length;
  const failed = logs.filter((l) => l.action === "login_failed").length;

  return (
    <>
      <div className="page-head">
        <h1 className="page-title">Dashboard</h1>
        <span className="track-meta">Signed in as {user.fullName}, Super Admin</span>
      </div>
      <div className="stat-grid">
        <StatCard label="Staff accounts" value={staff.length} />
        <StatCard label="Reports" value={reports.length} />
        <StatCard label="Offense categories" value={OFFENSE_CATEGORIES.length} />
        <StatCard label="Active offenses" value={offenses.filter((o) => o.isActive).length} />
        <StatCard label="Failed logins" value={failed} />
      </div>
      <div className="panel-grid">
        <section className="table-wrap">
          <h2>Users by role</h2>
          <table className="table">
            <thead><tr><th>Role</th><th>Accounts</th></tr></thead>
            <tbody>{roles.map((r) => <tr key={r}><td>{ROLE_LABELS[r]}</td><td>{staff.filter((u) => u.role === r).length}</td></tr>)}</tbody>
          </table>
        </section>
        <section className="table-wrap">
          <h2>Reports by status</h2>
          <table className="table">
            <thead><tr><th>Status</th><th>Reports</th></tr></thead>
            <tbody>{STATUS_ORDER.map((s) => <tr key={s}><td>{STATUS_LABELS[s]}</td><td>{reports.filter((r) => r.status === s).length}</td></tr>)}</tbody>
          </table>
        </section>
      </div>
      <section className="card">
        <h2>System alerts</h2>
        <ul className="bullets">
          <li>{blocked} staff {blocked === 1 ? "account is" : "accounts are"} restricted or deactivated (<Link to="/admin/users">Users &amp; Roles</Link>).</li>
          <li>{failed} failed login {failed === 1 ? "attempt" : "attempts"} this session (<Link to="/admin/audit">Audit Log</Link>).</li>
          <li>Backup status and service alerts come from the server or hosting service. They are not connected in this frontend demo.</li>
        </ul>
      </section>
    </>
  );
}
