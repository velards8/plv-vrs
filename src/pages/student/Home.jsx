import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/common/Button";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trackId, setTrackId] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(trackId.trim() ? `/track?id=${encodeURIComponent(trackId.trim())}` : "/track");
  };

  return (
    <>
      <h1 className="page-title">Welcome, {user.fullName}</h1>
      <p className="page-sub">Report a campus rule violation safely. You may report anonymously.</p>
      <div className="two-col">
        <section className="card">
          <h2>Report a Violation</h2>
          <p className="muted">Choose a category, describe the incident, attach evidence.</p>
          <div style={{ marginTop: 14 }}><Link to="/report" className="btn btn-primary">Start a report</Link></div>
        </section>
        <section className="card">
          <h2>Track a Report</h2>
          <p className="muted">Enter your tracking ID to see its status.</p>
          <form className="inline-form" onSubmit={handleSearch}>
            <input className="control" aria-label="Tracking ID" placeholder="e.g. VRS-2026-00123" value={trackId} onChange={(e) => setTrackId(e.target.value)} />
            <Button type="submit" variant="secondary">Search</Button>
          </form>
        </section>
      </div>
      <section className="card">
        <h2>How anonymous reporting works</h2>
        <div className="steps-box">1. Verify your login · 2. Choose anonymous or identified · 3. Keep your tracking ID</div>
        <Link to="/help" className="btn btn-secondary">Open Help / Guidelines</Link>
      </section>
    </>
  );
}
