import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAudit } from "../../context/AuditContext";
import { useAuth } from "../../context/AuthContext";
import { ROLES, ROLE_HOME } from "../../constants";
import Alert from "../../components/common/Alert";
import Button from "../../components/common/Button";
import Field from "../../components/common/Field";

export default function AdminLogin() {
  const { user, login } = useAuth();
  const { logAction } = useAudit();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (user) return <Navigate to={location.state?.from?.pathname || ROLE_HOME[user.role] || "/"} replace />;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password) { setError("Enter your email and password."); return; }
    const result = login(email, password, [ROLES.SUPER_ADMIN]);
    logAction({ user: result.user || null, action: result.ok ? "login" : "login_failed", target: result.ok ? "super admin portal" : email.trim(), details: result.ok ? "" : result.error });
    if (!result.ok) setError(result.error);
  };

  return (
    <div className="card login-card">
      <h1>Super Admin Login</h1>
      <p className="page-sub">Authorized system administrators only. This portal is separate from the OSA / OPD portal.</p>
      {error && <Alert type="error">{error}</Alert>}
      <form onSubmit={handleSubmit} noValidate>
        <Field id="saEmail" label="Email"><input id="saEmail" className="control" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
        <Field id="saPw" label="Password"><input id="saPw" type="password" className="control" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
        <Button type="submit" style={{ width: "100%" }}>Log in</Button>
      </form>
      <p className="field-hint" style={{ marginTop: 12 }}>Failed login attempts are recorded for monitoring.</p>
    </div>
  );
}
