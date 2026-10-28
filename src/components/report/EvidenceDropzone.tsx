import { useRef, useState } from "react";
import { EVIDENCE } from "../../constants";
import Button from "../common/Button";

const sizeText = (b: number) => (b < 1024 * 1024 ? `${Math.max(1, Math.round(b / 1024))} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`);

// Frontend-only: files stay in the browser. Nothing is uploaded until the Laravel API exists.
type EvidenceDropzoneProps = { files: File[]; onChange: (files: File[]) => void; error?: string };

export default function EvidenceDropzone({ files, onChange, error }: EvidenceDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [rejected, setRejected] = useState([]);

  const addFiles = (list: FileList | null) => {
    const ok = [];
    const bad = [];
    Array.from(list ?? []).forEach((f: File) => {
      const ext = (f.name.split(".").pop() ?? "").toLowerCase();
      if (!EVIDENCE.extensions.includes(ext)) bad.push(`${f.name}: file type not accepted.`);
      else if (f.size > EVIDENCE.maxBytes) bad.push(`${f.name}: larger than ${EVIDENCE.maxMB} MB.`);
      else ok.push(f);
    });
    setRejected(bad);
    if (ok.length) onChange([...files, ...ok]);
  };

  return (
    <div>
      <div
        className={`dropzone${drag ? " drag" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
      >
        Drop images or documents here
        <br />
        Accepted: images, PDF, Word documents. Up to {EVIDENCE.maxMB} MB each.
      </div>
      <input
        ref={inputRef}
        id="evidence"
        type="file"
        multiple
        accept={EVIDENCE.accept}
        hidden
        onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }}
      />
      <div style={{ marginTop: 8 }}>
        <Button variant="secondary" onClick={() => inputRef.current?.click()}>Choose files</Button>
      </div>
      {files.length > 0 && (
        <ul className="file-list">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`}>
              <span>{f.name} ({sizeText(f.size)})</span>
              <button type="button" className="link-btn" onClick={() => onChange(files.filter((_, j) => j !== i))}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      {rejected.map((m) => <p key={m} className="field-error">{m}</p>)}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
