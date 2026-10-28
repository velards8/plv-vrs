import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/layout/Sidebar";

const links = [
  { to: "/staff/dashboard", label: "Dashboard" },
  { to: "/staff/queue", label: "Report Queue" },
  { to: "/staff/offense-counter", label: "Offense Counter" },
];

export default function StaffLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/staff/login", { replace: true });
  };
  return (
    <div className="shell">
      <Sidebar title="PLV-VRS Staff" links={links} onLogout={handleLogout} />
      <main className="shell-main"><div className="shell-inner"><Outlet /></div></main>
    </div>
  );
}
