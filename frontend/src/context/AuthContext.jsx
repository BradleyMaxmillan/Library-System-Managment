import { useEffect, useMemo, useState } from "react";
import { fetchMe, loginUser, registerUser } from "../api/auth.js";
import AuthContext from "./authContext.js";

const getStoredToken = () => {
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
};

const setStoredToken = (token) => {
  try {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  } catch {
    // ignore storage errors
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(getStoredToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const me = await fetchMe();
        setUser(me);
      } catch {
        setUser(null);
        setToken(null);
        setStoredToken(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [token]);

  const login = async (payload) => {
    const data = await loginUser(payload);
    setToken(data.token);
    setStoredToken(data.token);
    setUser({ _id: data._id, name: data.name, email: data.email });
  };

  const register = async (payload) => {
    const data = await registerUser(payload);
    setToken(data.token);
    setStoredToken(data.token);
    setUser({ _id: data._id, name: data.name, email: data.email });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setStoredToken(null);
  };

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
