import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Alert from "../../components/common/Alert";
import Button from "../../components/common/Button";
import StatusBadge from "../../components/common/StatusBadge";

export default function ReportSubmitted() {
  const trackingId = useLocation().state?.trackingId;
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  if (!trackingId) return <Navigate to="/home" replace />;

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(trackingId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy your tracking ID:", trackingId);
    }
  };

  return (
    <div className="page-narrow" style={{ margin: "0 auto" }}>
      <div className="no-print"><Alert type="success">Your report was submitted.</Alert></div>
      <section className="card">
        <h1 className="page-title" style={{ fontSize: 18 }}>Report submitted</h1>
        <p className="page-sub">Save this tracking ID. It is the only way to follow up on an anonymous report.</p>
        <div className="id-box">{trackingId}</div>
        <div className="btn-row no-print">
          <Button variant="secondary" onClick={copyId}>{copied ? "Copied" : "Copy ID"}</Button>
          {/* Opens the print dialog. Choose "Save as PDF" there. */}
          <Button variant="secondary" onClick={() => window.print()}>Download ID (PDF)</Button>
        </div>
        <div className="status-line">
          <span>Initial status:</span>
          <StatusBadge status="submitted" />
          <span className="muted">OSA / OPD have been notified.</span>
        </div>
        <div className="btn-row no-print">
          <Button onClick={() => navigate(`/track?id=${encodeURIComponent(trackingId)}`)}>Track this report</Button>
          <Link to="/home" className="btn btn-secondary">Back to Home</Link>
        </div>
      </section>
    </div>
  );
}
