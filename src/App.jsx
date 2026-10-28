import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { ROLES, ROLE_HOME } from "./constants";
import PublicLayout from "./layouts/PublicLayout";
import StudentLayout from "./layouts/StudentLayout";
import StaffLayout from "./layouts/StaffLayout";
import AdminLayout from "./layouts/AdminLayout";
import PortalLoginLayout from "./layouts/PortalLoginLayout";
import RequireRole from "./components/common/RequireRole";
import Login from "./pages/student/Login";
import Home from "./pages/student/Home";
import ReportViolation from "./pages/student/ReportViolation";
import ReportSubmitted from "./pages/student/ReportSubmitted";
import TrackReport from "./pages/student/TrackReport";
import Help from "./pages/student/Help";
import StaffLogin from "./pages/staff/StaffLogin";
import Dashboard from "./pages/staff/Dashboard";
import ReportQueue from "./pages/staff/ReportQueue";
import ReportReview from "./pages/staff/ReportReview";
import OffenseCounter from "./pages/staff/OffenseCounter";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ReportLookup from "./pages/admin/ReportLookup";
import ReportView from "./pages/admin/ReportView";
import UsersRoles from "./pages/admin/UsersRoles";
import SystemStatistics from "./pages/admin/SystemStatistics";
import OffenseCatalog from "./pages/admin/OffenseCatalog";
import AuditLog from "./pages/admin/AuditLog";
import Verify from "./pages/shared/Verify";
import NotFound from "./pages/shared/NotFound";

// /help is open to everyone: students see the student navigation, visitors see the public header.
function HelpShell() {
  const { user } = useAuth();
  return user?.role === ROLES.STUDENT ? <StudentLayout /> : <PublicLayout />;
}

function Start() {
  const { user } = useAuth();
  return <Navigate to={user ? ROLE_HOME[user.role] || "/login" : "/login"} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Start />} />

      <Route element={<PublicLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<Verify />} />
      </Route>

      <Route element={<HelpShell />}>
        <Route path="/help" element={<Help />} />
      </Route>

      <Route element={<RequireRole roles={[ROLES.STUDENT]} />}>
        <Route element={<StudentLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/report" element={<ReportViolation />} />
          <Route path="/report/submitted" element={<ReportSubmitted />} />
          <Route path="/track" element={<TrackReport />} />
        </Route>
      </Route>

      <Route element={<PortalLoginLayout title="PLV-VRS · Staff Portal" />}>
        <Route path="/staff/login" element={<StaffLogin />} />
      </Route>

      <Route element={<RequireRole roles={[ROLES.OSA, ROLES.OPD]} loginPath="/staff/login" />}>
        <Route element={<StaffLayout />}>
          <Route path="/staff/dashboard" element={<Dashboard />} />
          <Route path="/staff/queue" element={<ReportQueue />} />
          <Route path="/staff/queue/:trackingId" element={<ReportReview />} />
          <Route path="/staff/offense-counter" element={<OffenseCounter />} />
        </Route>
      </Route>

      <Route element={<PortalLoginLayout title="PLV-VRS · Super Admin Portal" />}>
        <Route path="/admin/login" element={<AdminLogin />} />
      </Route>

      <Route element={<RequireRole roles={[ROLES.SUPER_ADMIN]} loginPath="/admin/login" />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/lookup" element={<ReportLookup />} />
          <Route path="/admin/lookup/:trackingId" element={<ReportView />} />
          <Route path="/admin/users" element={<UsersRoles />} />
          <Route path="/admin/statistics" element={<SystemStatistics />} />
          <Route path="/admin/catalog" element={<OffenseCatalog />} />
          <Route path="/admin/audit" element={<AuditLog />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
