const FALLBACK = "https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api";
const BASE = (import.meta.env.VITE_API_BASE || FALLBACK).replace(/\/$/, "");

async function request(path, { method = "GET", token, json, params } = {}) {
  const url = new URL(path.startsWith("http") ? path : BASE + path);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const headers = { Accept: "application/json" };
  let body;
  if (json) { headers["Content-Type"] = "application/json"; body = JSON.stringify(json); }
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url.toString(), { method, headers, body });
  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try { const data = await res.json(); message = data.error || data.message || message; } catch {}
    const err = new Error(message); err.status = res.status; throw err;
  }
  return res.status === 204 ? null : res.json();
}

export const get = (p, opts) => request(p, { ...opts, method: "GET" });
export const post = (p, opts) => request(p, { ...opts, method: "POST" });
export const del = (p, opts) => request(p, { ...opts, method: "DELETE" });
export const put = (p, opts) => request(p, { ...opts, method: "PUT" });
