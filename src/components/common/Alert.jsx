// type: "error" | "success" | "info"
export default function Alert({ type = "info", children, actions }) {
  return (
    <div className={`alert alert-${type}`} role={type === "error" ? "alert" : "status"}>
      <div>{children}</div>
      {actions && <div className="alert-actions">{actions}</div>}
    </div>
  );
}
