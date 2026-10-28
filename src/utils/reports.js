import { OFFENSE_CATEGORIES } from "../data/mockData";

export const categoryName = (id) => OFFENSE_CATEGORIES.find((c) => c.id === id)?.name || "—";
export const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : "—");

// Staff-classified severity wins over the AI suggestion. `offenseById` comes from useOffenses().
export const reportSeverity = (r, offenseById) => offenseById(r.classifiedOffenseId)?.severity || r.aiSeverity || null;

// Assumption A5 (to confirm): flag "Repeat" when reported + OSA-confirmed is 2 or more.
// A flag is for staff review. It is not a finding of guilt.
export const isRepeat = (c) => c.reported + c.confirmed >= 2;
