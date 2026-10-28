import { useState } from "react";
import { Link } from "react-router-dom";
import { useUsers } from "../../context/UsersContext";
import Alert from "../../components/common/Alert";
import Button from "../../components/common/Button";
import Field from "../../components/common/Field";

// Not in the wireframes. Mock flow for assumption A8 (verify by PLV email and student number).
// The real system emails a link or code. Here, any 6-digit code is accepted.
export default function Verify() {
  const { checkPendingStudent, markVerified } = useUsers();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [code, setCode] = useState("");
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState("");

  const sendCode = (e) => {
    e.preventDefault();
    const r = checkPendingStudent({ email, studentNumber });
    if (!r.ok) { setError(r.error); return; }
    setError("");
    setUserId(r.id);
    setStep(2);
  };
  const confirmCode = (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(code.trim())) { setError("Enter the 6-digit code."); return; }
    markVerified(userId);
    setError("");
    setStep(3);
  };

  return (
    <div className="card login-card">
      <h1>Account verification</h1>
      <p className="page-sub">Verify your PLV student account before reporting.</p>
      {error && <Alert type="error">{error}</Alert>}
      {step === 1 && (
        <form onSubmit={sendCode} noValidate>
          <Field id="vEmail" label="PLV email" required><input id="vEmail" className="control" placeholder="name@plv.edu.ph" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
          <Field id="vNo" label="Student ID number" required><input id="vNo" className="control" placeholder="e.g. 24-0000" value={studentNumber} onChange={(e) => setStudentNumber(e.target.value)} /></Field>
          <Button type="submit">Send verification code</Button>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={confirmCode} noValidate>
          <Alert type="info">A 6-digit code was sent to {email.trim()} (mock: no email is really sent).</Alert>
          <Field id="vCode" label="Verification code" required><input id="vCode" className="control" inputMode="numeric" maxLength={6} value={code} onChange={(e) => setCode(e.target.value)} /></Field>
          <Button type="submit">Verify account</Button>
        </form>
      )}
      {step === 3 && (
        <>
          <Alert type="success">Your account is verified.</Alert>
          <Link to="/login" className="btn btn-primary">Go to log in</Link>
        </>
      )}
      {step !== 3 && <div className="small-links"><span>Already verified? <Link to="/login">Log in</Link>.</span></div>}
    </div>
  );
}
