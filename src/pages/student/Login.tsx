import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAudit } from "../../context/AuditContext";
import { useAuth } from "../../context/AuthContext";
import { ROLES, ROLE_HOME } from "../../constants";
import Alert from "../../components/common/Alert";
import Button from "../../components/common/Button";
import Field from "../../components/common/Field";

export default function Login() {
  const { user, login } = useAuth();
  const { logAction } = useAudit();
  const location = useLocation();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [needsVerify, setNeedsVerify] = useState(false);

  if (user) return <Navigate to={location.state?.from?.pathname || ROLE_HOME[user.role] || "/"} replace />;

  const handleSubmit = (e) => {
    e.preventDefault();
    setNeedsVerify(false);
    if (!identifier.trim() || !password) {
      setError("Enter your student ID number or PLV email, and your password.");
      return;
    }
    const result = login(identifier, password, [ROLES.STUDENT]);
    logAction({ user: result.user || null, action: result.ok ? "login" : "login_failed", target: result.ok ? "student portal" : identifier.trim(), details: result.ok ? "" : result.error });
    if (!result.ok) {
      setError(result.error);
      setNeedsVerify(Boolean(result.needsVerification));
    }
  };

  return (
    <div className="card login-card">
      <h1>Log in</h1>
      <p className="page-sub">Use your verified PLV student account.</p>
      {error && (
        <Alert type="error" actions={needsVerify && <Link className="btn btn-secondary" to="/verify">Verify account</Link>}>
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit} noValidate>
        <Field id="identifier" label="Student ID number / PLV email">
          <input id="identifier" className="control" placeholder="e.g. 24-0000" autoComplete="username" value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
        </Field>
        <Field id="password" label="Password">
          <div className="pw-wrap">
            <input id="password" className="control" type={show ? "text" : "password"} placeholder="Enter your password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" className="pw-toggle" onClick={() => setShow(!show)} aria-pressed={show}>{show ? "Hide" : "Show"}</button>
          </div>
        </Field>
        <Button type="submit">Log in</Button>
      </form>
      <div className="small-links">
        <span>Staff (OSA / OPD)? Use the <Link to="/staff/login">separate staff login</Link>.</span>
        <span>Super Admin? Use the <Link to="/admin/login">Super Admin login</Link>.</span>
        <span>Not verified yet? <Link to="/verify">Verify your account</Link>.</span>
      </div>
    </div>
  );
}
