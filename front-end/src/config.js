export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
export const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL || "http://localhost:5174";

// Calls the backend and sends/receives the httpOnly auth cookie.
export async function apiPost(path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
}
