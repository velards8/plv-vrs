import { createContext, useCallback, useContext, useState } from "react";
import { SEED_AUDIT } from "../data/mockData";

// MOCK audit log kept in memory. The real one is the audit_logs table (written by Laravel, read-only).
const AuditContext = createContext(null);

export function AuditProvider({ children }) {
  const [logs, setLogs] = useState(SEED_AUDIT);

  const logAction = useCallback(({ user, action, target = "", details = "" }) => {
    setLogs((prev) => [
      {
        id: `${Date.now()}-${prev.length}`,
        at: new Date().toISOString(),
        userName: user ? user.fullName : "Not signed in",
        userRole: user ? user.role : "none",
        action,
        target,
        details,
      },
      ...prev,
    ]);
  }, []);

  return <AuditContext.Provider value={{ logs, logAction }}>{children}</AuditContext.Provider>;
}

export function useAudit() {
  return useContext(AuditContext);
}
