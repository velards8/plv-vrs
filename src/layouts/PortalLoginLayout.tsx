import { Outlet } from "react-router-dom";

// Dark-header shell for the staff login now, and the Super Admin login in Part C.
export default function PortalLoginLayout({ title }) {
  return (
    <>
      <header className="portal-header no-print"><span className="brand-logo">PLV</span><span>{title}</span></header>
      <main className="page"><Outlet /></main>
    </>
  );
}
