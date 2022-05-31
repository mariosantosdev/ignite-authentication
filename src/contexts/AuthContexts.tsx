import Router from "next/router";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { parseCookies, setCookie } from "nookies";

import { api } from "../services/api";

type User = {
  email: string;
  permissions: string[];
  roles: string[];
};

type SignInCredentials = {
  email: string;
  password: string;
};

type AuthContextData = {
  user: User;
  signIn(credentials: SignInCredentials): Promise<void>;
  isAuthenticated: boolean;
};

type AuthProvidedrProps = {
  children: React.ReactNode;
};

const AuthContext = createContext({} as AuthContextData);

export function AuthContextProvider({ children }: AuthProvidedrProps) {
  const [user, setUser] = useState<User>();
  const isAuthenticated = useMemo(() => Boolean(user), [user]);

  useEffect(() => {
    const { "auth.token": token } = parseCookies();

    async function loadInitialData() {
      if (!token) return;
      const response = await api.get("/me");
      const { email, permissions, roles } = response.data;

      setUser({
        email,
        permissions,
        roles,
      });
    }

    loadInitialData();
  }, []);

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post("/sessions", { email, password });
      const { token, refreshToken, permissions, roles } = response.data;

      setCookie(undefined, "auth.token", token, {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: "/",
      });
      setCookie(undefined, "auth.refreshToken", refreshToken, {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: "/",
      });

      setUser({
        email,
        permissions,
        roles,
      });

      api.defaults.headers["Authorization"] = `Bearer ${token}`;

      Router.push("/dashboard");
    } catch (error) {
      alert("Falha na autenticação, verifique seus dados");
      console.error(error);
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
