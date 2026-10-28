import { STATUS_LABELS, STATUS_ORDER } from "../../constants";

// Past steps are navy, the current step is light blue, later steps are white.
// When the report is Resolved, every step is navy.
export default function StatusStepper({ status }) {
  const current = STATUS_ORDER.indexOf(status);
  const last = STATUS_ORDER.length - 1;
  return (
    <ol className="stepper" aria-label="Report status">
      {STATUS_ORDER.map((s, i) => {
        const cls = current === last || i < current ? "done" : i === current ? "current" : "";
        return (
          <li key={s} className={`step ${cls}`} aria-current={i === current ? "step" : undefined}>
            {STATUS_LABELS[s]}
          </li>
        );
      })}
    </ol>
  );
}
