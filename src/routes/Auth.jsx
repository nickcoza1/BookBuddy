import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Auth() {
  const [mode, setMode] = useState("login");
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div className="row" style={{ gap: 8 }}>
        <button className="btn" onClick={() => setMode("login")} disabled={mode==="login"}>Login</button>
        <button className="btn" onClick={() => setMode("register")} disabled={mode==="register"}>Register</button>
      </div>
      {mode === "login" ? <LoginForm /> : <RegisterForm />}
    </div>
  );
}

function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const nav = useNavigate();
  const loc = useLocation();
  const redirectTo = loc.state?.from || "/account";

  return (
    <form className="form" onSubmit={async (e) => {
      e.preventDefault(); setBusy(true); setErr("");
      try { await login(email, password); nav(redirectTo, { replace: true }); }
      catch (e) { setErr(e.message || "Login failed"); }
      finally { setBusy(false); }
    }}>
      <label className="label">Email</label>
      <input className="input" value={email} onChange={e => setEmail(e.target.value)} required />
      <label className="label">Password</label>
      <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      {err && <p style={{ color: "salmon" }}>{err}</p>}
      <button className="btn" disabled={busy}>{busy ? "Logging in…" : "Log in"}</button>
    </form>
  );
}

function RegisterForm() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState("");
  const [err, setErr] = useState("");

  return (
    <form className="form" onSubmit={async (e) => {
      e.preventDefault(); setBusy(true); setErr(""); setOk("");
      try { await register(name, email, password); setOk("Registered! You can log in now if not auto-logged in."); }
      catch (e) { setErr(e.message || "Registration failed"); }
      finally { setBusy(false); }
    }}>
      <label className="label">Name</label>
      <input className="input" value={name} onChange={e => setName(e.target.value)} />
      <label className="label">Email</label>
      <input className="input" value={email} onChange={e => setEmail(e.target.value)} required />
      <label className="label">Password</label>
      <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      {ok && <p style={{ color: "lightgreen" }}>{ok}</p>}
      {err && <p style={{ color: "salmon" }}>{err}</p>}
      <button className="btn" disabled={busy}>{busy ? "Registering…" : "Register"}</button>
    </form>
  );
}
