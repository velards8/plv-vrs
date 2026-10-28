import { EVIDENCE, STATUS_HELP, STATUS_ORDER } from "../../constants";
import { OFFENSE_CATEGORIES } from "../../data/mockData";
import StatusBadge from "../../components/common/StatusBadge";

export default function Help() {
  return (
    <>
      <h1 className="page-title">Help / Guidelines</h1>
      <p className="page-sub">Instructions for reporting violations safely.</p>
      <div className="help-grid">
        <section className="card">
          <h2>How to report</h2>
          <p className="muted">Step-by-step guide to the report form.</p>
          <ol className="help-list">
            <li>Log in with your verified PLV account.</li>
            <li>Open Report a Violation and choose anonymous or identified.</li>
            <li>Pick a category, then enter the date, time, and location.</li>
            <li>Describe what happened and name the students involved, if known.</li>
            <li>Attach evidence, then press Submit report and confirm.</li>
            <li>Save your tracking ID.</li>
          </ol>
        </section>

        <section className="card">
          <h2>Anonymous reporting</h2>
          <p className="muted">What staff can and cannot see.</p>
          <ul className="help-list">
            <li>OSA and OPD staff cannot see who filed an anonymous report.</li>
            <li>Your tracking ID is the only way to follow up, so keep it safe.</li>
            <li>Anonymous reports require supporting evidence.</li>
            <li>To address false or prank reports, only the Super Admin can view the reporter’s student number. Each view needs a reason and is recorded in an audit log.</li>
          </ul>
        </section>

        <section className="card">
          <h2>Evidence requirements</h2>
          <p className="muted">Accepted file types and size limits.</p>
          <ul className="help-list">
            <li>Accepted: images (JPG, PNG), PDF, and Word documents.</li>
            <li>Maximum size: {EVIDENCE.maxMB} MB per file (to be confirmed with OSA / OPD).</li>
            <li>Anonymous report: evidence is required.</li>
            <li>Identified report: evidence is optional but helps staff verify faster.</li>
          </ul>
        </section>

        <section className="card">
          <h2>Tracking and statuses</h2>
          <p className="muted">What each status means.</p>
          <ul className="help-statuses">
            {STATUS_ORDER.map((s) => (
              <li key={s}><StatusBadge status={s} /><span>{STATUS_HELP[s]}</span></li>
            ))}
          </ul>
        </section>

        <section className="card help-wide">
          <h2>Offense categories</h2>
          <p className="muted">Minor and major offenses from the Revised Student Code of Conduct.</p>
          <details className="help-details">
            <summary>Show categories</summary>
            <ul>
              {OFFENSE_CATEGORIES.map((c) => <li key={c.id}>{c.name}</li>)}
            </ul>
            <p className="field-hint" style={{ marginTop: 8 }}>
              Placeholder list. The full list of 13 minor and 42 major offenses will be added from the official Code of Conduct.
            </p>
          </details>
        </section>
      </div>
    </>
  );
}
