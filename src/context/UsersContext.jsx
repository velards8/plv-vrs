import { createContext, useContext, useState } from "react";
import { MOCK_USERS } from "../data/mockData";

// MOCK user table (users in the schema). Lives in memory, so changes vanish on refresh.
const UsersContext = createContext(null);
const tempPassword = () => "Temp-" + Math.random().toString(36).slice(2, 8);

export function UsersProvider({ children }) {
  const [users, setUsers] = useState(MOCK_USERS);
  const patch = (id, fn) => setUsers((prev) => prev.map((u) => (u.id === id ? fn(u) : u)));

  const createStaff = ({ fullName, email, role }) => {
    const password = tempPassword();
    const id = Math.max(...users.map((u) => u.id)) + 1;
    setUsers((prev) => [...prev, { id, username: email.split("@")[0], studentNumber: null, fullName, email, password, section: null, role, accountStatus: "active", verified: true }]);
    return { id, password };
  };
  const updateStaff = (id, { fullName, email, role }) => patch(id, (u) => ({ ...u, fullName, email, role }));
  const setAccountStatus = (id, accountStatus) => patch(id, (u) => ({ ...u, accountStatus }));
  const resetPassword = (id) => {
    const password = tempPassword();
    patch(id, (u) => ({ ...u, password }));
    return password;
  };

  // Account verification (assumption A8: by PLV email + student number).
  const checkPendingStudent = ({ email, studentNumber }) => {
    const e = email.trim().toLowerCase();
    if (!e.endsWith("@plv.edu.ph")) return { ok: false, error: "Use your PLV email address (ends with @plv.edu.ph)." };
    const u = users.find((x) => x.role === "student" && x.email.toLowerCase() === e && x.studentNumber === studentNumber.trim());
    if (!u) return { ok: false, error: "No student account matches that email and student ID number." };
    if (u.verified) return { ok: false, error: "This account is already verified. You can log in." };
    return { ok: true, id: u.id };
  };
  const markVerified = (id) => patch(id, (u) => ({ ...u, verified: true }));

  return (
    <UsersContext.Provider value={{ users, createStaff, updateStaff, setAccountStatus, resetPassword, checkPendingStudent, markVerified }}>
      {children}
    </UsersContext.Provider>
  );
}

export function useUsers() {
  return useContext(UsersContext);
}
