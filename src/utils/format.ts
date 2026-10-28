export const formatDateTime = (iso) =>
  iso ? new Date(iso).toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" }) : "—";

export const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-PH", { dateStyle: "medium" }) : "—";

// yyyy-mm-dd in the viewer's local time, for date filters.
export const toLocalDateKey = (iso) => new Date(iso).toLocaleDateString("en-CA");
