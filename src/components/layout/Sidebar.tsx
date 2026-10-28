import { NavLink } from "react-router-dom";

// links: [{ to, label }]. Used by the staff shell now and the Super Admin shell in Part C.
export default function Sidebar({ title, links, onLogout }) {
  return (
    <aside className="sidebar no-print">
      <div className="sidebar-title">{title}</div>
      <nav aria-label={`${title} menu`}>
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} className={({ isActive }) => (isActive ? "active" : undefined)}>{l.label}</NavLink>
        ))}
        <button type="button" className="sidebar-btn" onClick={onLogout}>Log Out</button>
      </nav>
    </aside>
  );
}
