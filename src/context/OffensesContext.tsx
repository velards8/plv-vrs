import { createContext, useCallback, useContext, useState } from "react";
import { OFFENSES } from "../data/mockData";

// MOCK offense catalog (offenses table). Retired offenses stay so old cases keep their classification.
const OffensesContext = createContext(null);

export function OffensesProvider({ children }) {
  const [offenses, setOffenses] = useState(OFFENSES);

  const offenseById = useCallback((id) => offenses.find((o) => o.id === id) || null, [offenses]);
  const codeTaken = (code, exceptId) => offenses.some((o) => o.code.toLowerCase() === code.trim().toLowerCase() && o.id !== exceptId);

  const saveOffense = ({ id, code, description, severity, isActive }) => {
    const clean = { code: code.trim(), description: description.trim(), severity, isActive };
    const name = `${clean.code}: ${clean.description.slice(0, 50)}`;
    if (id) setOffenses((prev) => prev.map((o) => (o.id === id ? { ...o, ...clean, name } : o)));
    else setOffenses((prev) => [...prev, { id: Math.max(...prev.map((o) => o.id)) + 1, categoryId: null, ...clean, name }]);
  };
  const setActive = (id, isActive) => setOffenses((prev) => prev.map((o) => (o.id === id ? { ...o, isActive } : o)));

  return (
    <OffensesContext.Provider value={{ offenses, offenseById, codeTaken, saveOffense, setActive }}>
      {children}
    </OffensesContext.Provider>
  );
}

export function useOffenses() {
  return useContext(OffensesContext);
}
