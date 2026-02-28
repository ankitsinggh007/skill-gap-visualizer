const rawBase = import.meta.env.VITE_API_BASE || "";
const API_BASE = rawBase.replace(/\/$/, "");

export default function apiUrl(path) {
  const safePath = path.startsWith("/") ? path : `/${path}`;
  return API_BASE ? `${API_BASE}${safePath}` : safePath;
}
