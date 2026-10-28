import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useReports } from "../../context/ReportsContext";
import { OFFENSE_CATEGORIES } from "../../data/mockData";
import { formatDate } from "../../utils/format";
import Alert from "../../components/common/Alert";
import Button from "../../components/common/Button";
import StatusStepper from "../../components/common/StatusStepper";
import StatusTimeline from "../../components/report/StatusTimeline";

export default function TrackReport() {
  const [params, setParams] = useSearchParams();
  const { findByTrackingId } = useReports();
  const [input, setInput] = useState(params.get("id") || "");

  const queried = params.get("id") || "";
  const report = queried ? findByTrackingId(queried) : null;
  const category = report ? OFFENSE_CATEGORIES.find((c) => c.id === report.categoryId)?.name : "";

  const handleSearch = (e) => {
    e.preventDefault();
    setParams(input.trim() ? { id: input.trim() } : {});
  };

  return (
    <div className="page-narrow" style={{ margin: "0 auto", maxWidth: 760 }}>
      <h1 className="page-title">Track a Report</h1>
      <p className="page-sub">Enter the tracking ID you received after submitting.</p>

      <form className="card" onSubmit={handleSearch} style={{ marginBottom: 16 }}>
        <label htmlFor="trackingId" className="field-label">Tracking ID</label>
        <div className="inline-form" style={{ marginTop: 4 }}>
          <input id="trackingId" className="control" placeholder="e.g. VRS-2026-00123" value={input} onChange={(e) => setInput(e.target.value)} />
          <Button type="submit">Search</Button>
        </div>
      </form>

      {queried && !report && <Alert type="error">No report found for “{queried}”. Check the ID and try again.</Alert>}

      {report && (
        <section className="card">
          <div className="track-head">
            <h2>{report.trackingId}</h2>
            <span className="track-meta">Submitted: {formatDate(report.submittedAt)} · Category: {category}</span>
          </div>
          <p className="field-label" style={{ marginTop: 10 }}>Current status</p>
          <StatusStepper status={report.status} />
          <p className="field-label">Status timeline</p>
          <StatusTimeline history={report.history} />
        </section>
      )}
    </div>
  );
}
