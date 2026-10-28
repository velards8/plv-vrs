import { useNavigate } from "react-router-dom";

/** A consistent back button for staff pages. If there is no prior history,
 * return the user to the staff dashboard instead of leaving the staff portal. */
export default function BackButton() {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/staff/dashboard", { replace: true });
    }
  };

  return (
    <button type="button" className="staff-back-button" onClick={handleBack}>
      <span aria-hidden="true">←</span> Back
    </button>
  );
}
