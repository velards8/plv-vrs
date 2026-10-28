import { STATUS_LABELS } from "../../constants";
import { formatDateTime } from "../../utils/format";

// Shows only entries marked visible to the reporter (internal staff notes are hidden). Newest first.
export default function StatusTimeline({ history }) {
  const items = history.filter((h) => h.visible).slice().reverse();
  return (
    <ul className="timeline">
      {items.map((h, i) => (
        <li key={i}>
          <strong>{STATUS_LABELS[h.status]}</strong>
          <span>{formatDateTime(h.at)}{h.note ? ` - ${h.note}` : ""}</span>
        </li>
      ))}
    </ul>
  );
}
