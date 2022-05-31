import Router from "next/router";
import { createContext, useContext, useMemo, useState } from "react";

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

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post("/sessions", { email, password });
      const { permissions, roles } = response.data;

      setUser({
        email,
        permissions,
        roles,
      });
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
