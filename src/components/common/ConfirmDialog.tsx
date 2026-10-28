import { useEffect } from "react";
import Button from "./Button";

export default function ConfirmDialog({ open, title, message, confirmLabel = "Confirm", cancelLabel = "Cancel", hideCancel = false, onConfirm, onCancel }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onCancel();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;
  return (
    <div className="overlay no-print" onClick={onCancel}>
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="dlg-title" onClick={(e) => e.stopPropagation()}>
        <h2 id="dlg-title">{title}</h2>
        <p>{message}</p>
        <div className="dialog-actions">
          <Button onClick={onConfirm} autoFocus>{confirmLabel}</Button>
          {!hideCancel && <Button variant="secondary" onClick={onCancel}>{cancelLabel}</Button>}
        </div>
      </div>
    </div>
  );
}
