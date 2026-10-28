import type { ReactNode } from "react";

type FieldProps = {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
};

// Label + control + hint + error. `children` is the input/select/textarea (give it the same id).
export default function Field({ id, label, required = false, hint, error, children }: FieldProps) {
  return (
    <div className={`field${error ? " has-error" : ""}`}>
      <label htmlFor={id} className="field-label">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {children}
      {hint && <p className="field-hint">{hint}</p>}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
