import { AuditProvider } from "./AuditContext";
import { AuthProvider } from "./AuthContext";
import { OffensesProvider } from "./OffensesContext";
import { ReportsProvider } from "./ReportsContext";
import { UsersProvider } from "./UsersContext";

// All mock data stores in one place. When the Laravel API exists, these become API-backed.
export default function AppProviders({ children }) {
  return (
    <UsersProvider>
      <AuthProvider>
        <OffensesProvider>
          <ReportsProvider>
            <AuditProvider>{children}</AuditProvider>
          </ReportsProvider>
        </OffensesProvider>
      </AuthProvider>
    </UsersProvider>
  );
}
