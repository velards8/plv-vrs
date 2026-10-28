import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAudit } from "../../context/AuditContext";
import { useAuth } from "../../context/AuthContext";
import { ROLES, ROLE_HOME } from "../../constants";
import Alert from "../../components/common/Alert";
import Button from "../../components/common/Button";
import Field from "../../components/common/Field";

export default function StaffLogin() {
  const { user, login } = useAuth();
  const { logAction } = useAudit();
  const location = useLocation();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (user) return <Navigate to={location.state?.from?.pathname || ROLE_HOME[user.role] || "/"} replace />;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setError("Enter your staff email or username, and your password.");
      return;
    }
    const result = login(identifier, password, [ROLES.OSA, ROLES.OPD]);
    logAction({ user: result.user || null, action: result.ok ? "login" : "login_failed", target: result.ok ? "staff portal" : identifier.trim(), details: result.ok ? "" : result.error });
    if (!result.ok) setError(result.error);
  };

  return (
    <div className="card login-card">
      <h1>Staff login</h1>
      <p className="page-sub">For authorized personnel only.</p>
      {error && <Alert type="error">{error}</Alert>}
      <form onSubmit={handleSubmit} noValidate>
        <Field id="staffId" label="Staff email / username">
          <input id="staffId" className="control" autoComplete="username" value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
        </Field>
        <Field id="staffPw" label="Password">
          <input id="staffPw" type="password" className="control" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
        <Button type="submit" className="btn-block" style={{ width: "100%" }}>Log in</Button>
      </form>
      <p className="field-hint" style={{ marginTop: 14 }}>Role-based access assigned to your account:</p>
      <div className="chips"><span className="chip">OSA</span><span className="chip">OPD</span></div>
    </div>
  );
}
