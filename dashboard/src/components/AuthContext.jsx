import React, { createContext, useContext, useEffect, useState } from "react";

import api, { LANDING_URL } from "../api";

// Global auth state: the logged-in user (and their role) is available to every component.
const AuthContext = createContext({ user: null, logout: () => {} });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // A 401 here is handled by the api interceptor (redirect to login).
    api.get("/auth/me").then((res) => setUser(res.data.user)).catch(() => {});
  }, []);

  const logout = async () => {
    await api.post("/auth/logout").catch(() => {});
    window.location.href = LANDING_URL;
  };

  if (!user) {
    return <div className="auth-loading">Checking your session…</div>;
  }

  return <AuthContext.Provider value={{ user, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
