import { Link, Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <>
      <header className="topnav no-print">
        <div className="brand"><span className="brand-logo">PLV</span><span>PLV-VRS · Violation Reporting System</span></div>
        <Link to="/help" className="public-link">Help / Guidelines</Link>
      </header>
      <main className="page"><Outlet /></main>
    </>
  );
}
