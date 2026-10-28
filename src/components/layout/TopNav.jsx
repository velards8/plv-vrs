import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../common/Button";

const links = [
  ["/home", "Home"],
  ["/report", "Report a Violation"],
  ["/track", "Track Report"],
  ["/help", "Help / Guidelines"],
];

export default function TopNav() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };
  return (
    <header className="topnav no-print">
      <div className="brand"><span className="brand-logo">PLV</span><span>PLV-VRS</span></div>
      <nav className="topnav-links" aria-label="Main">
        {links.map(([to, label]) => (
          <NavLink key={to} to={to} className={({ isActive }) => (isActive ? "active" : undefined)}>{label}</NavLink>
        ))}
      </nav>
      <Button variant="secondary" onClick={handleLogout}>Log out</Button>
    </header>
  );
}
