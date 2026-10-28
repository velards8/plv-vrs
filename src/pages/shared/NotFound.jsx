import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="page page-narrow">
      <h1 className="page-title">Page not found</h1>
      <p className="page-sub">This page does not exist yet or the address is wrong.</p>
      <Link to="/" className="btn btn-primary">Go to start</Link>
    </div>
  );
}
