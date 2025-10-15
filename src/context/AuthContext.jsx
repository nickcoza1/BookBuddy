import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as authApi from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("bb_token") || "");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!token);

  useEffect(() => {
    if (!token) { setUser(null); return; }
    setLoading(true);
    authApi.getMe(token)
      .then(setUser)
      .catch(() => { setToken(""); localStorage.removeItem("bb_token"); })
      .finally(() => setLoading(false));
  }, [token]);

  const login = async (email, password) => {
    const { token } = await authApi.login({ email, password });
    setToken(token);
    localStorage.setItem("bb_token", token);
    setUser(await authApi.getMe(token));
  };

  const register = async (name, email, password) => {
    const out = await authApi.register({ name, email, password });
    if (out?.token) {
      setToken(out.token);
      localStorage.setItem("bb_token", out.token);
      setUser(await authApi.getMe(out.token));
    }
    return out;
  };

  const logout = () => { setUser(null); setToken(""); localStorage.removeItem("bb_token"); };

  const value = useMemo(() => ({ token, user, loading, login, register, logout }), [token, user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
