import { useState } from "react";
import Button from "./Button";

// "PDF" opens the print dialog. Choose "Save as PDF" there. Real PDF export comes with the backend (DomPDF).
export default function ExportMenu({ onCsv, onPdf, label = "Export CSV / PDF" }) {
  const [open, setOpen] = useState(false);
  const run = (fn) => () => { fn(); setOpen(false); };
  return (
    <div className="export-menu no-print">
      <Button variant="secondary" onClick={() => setOpen(!open)} aria-expanded={open}>{label}</Button>
      {open && (
        <div className="export-pop">
          <button type="button" onClick={run(onCsv)}>Download CSV</button>
          <button type="button" onClick={run(onPdf)}>Print / Save as PDF</button>
        </div>
      )}
    </div>
  );
}
