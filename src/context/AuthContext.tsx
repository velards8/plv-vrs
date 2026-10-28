import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useUsers } from "./UsersContext";

// MOCK AUTH: no real authentication, tokens, or server. Demo only.
// A restricted or deactivated account is signed out automatically.
const AuthContext = createContext(null);
const KEY = "plvvrs_mock_session";

function strip(found) {
  const safe = { ...found };
  delete safe.password;
  return safe;
}

function loadId() {
  try {
    const id = JSON.parse(sessionStorage.getItem(KEY));
    return typeof id === "number" ? id : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const { users } = useUsers();
  const [userId, setUserId] = useState(loadId);
  const found = users.find((u) => u.id === userId) || null;
  const user = useMemo(() => (found && found.accountStatus === "active" ? strip(found) : null), [found]);

  const login = useCallback(
    (identifier, password, allowedRoles) => {
      const id = identifier.trim().toLowerCase();
      const match = users.find(
        (u) =>
          (u.studentNumber && u.studentNumber.toLowerCase() === id) ||
          (u.username && u.username.toLowerCase() === id) ||
          u.email.toLowerCase() === id
      );
      if (!match || match.password !== password) return { ok: false, error: "Incorrect ID / email or password." };
      if (!allowedRoles.includes(match.role)) return { ok: false, error: "This account cannot sign in here. Use the login page for your role." };
      if (match.accountStatus !== "active") return { ok: false, error: "This account is restricted or deactivated. Contact the administrator." };
      if (match.role === "student" && !match.verified) {
        return { ok: false, needsVerification: true, error: "Your PLV account is not verified yet. Complete account verification first." };
      }
      try {
        sessionStorage.setItem(KEY, JSON.stringify(match.id));
      } catch {
        /* storage unavailable: the session lasts until refresh */
      }
      setUserId(match.id);
      return { ok: true, user: strip(match) };
    },
    [users]
  );

  const logout = useCallback(() => {
    try {
      sessionStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    setUserId(null);
  }, []);

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
