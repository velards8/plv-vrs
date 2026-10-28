import type { ReactNode } from "react";

type AlertProps = { type?: "error" | "success" | "info"; children: ReactNode; actions?: ReactNode };

export default function Alert({ type = "info", children, actions }: AlertProps) {
  return (
    <div className={`alert alert-${type}`} role={type === "error" ? "alert" : "status"}>
      <div>{children}</div>
      {actions && <div className="alert-actions">{actions}</div>}
    </div>
  );
}
