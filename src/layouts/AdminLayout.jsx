import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/layout/Sidebar";

const links = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/lookup", label: "Report Lookup" },
  { to: "/admin/users", label: "Users & Roles" },
  { to: "/admin/statistics", label: "System Statistics" },
  { to: "/admin/catalog", label: "Offense Catalog" },
  { to: "/admin/audit", label: "Audit Log" },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };
  return (
    <div className="shell">
      <Sidebar title="PLV-VRS Super Admin" links={links} onLogout={handleLogout} />
      <main className="shell-main"><div className="shell-inner"><Outlet /></div></main>
    </div>
  );
}
