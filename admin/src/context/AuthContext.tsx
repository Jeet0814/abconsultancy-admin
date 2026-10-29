import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "staff";
};

type AuthContextType = {
  user: AdminUser | null;
  loading: boolean;
  login: (tokenData: { user: AdminUser }) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await api.get<{ user: AdminUser }>("/api/auth/me");
      if (res.data?.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = (data: { user: AdminUser }) => {
    setUser(data.user);
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
    } finally {
      setUser(null);
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser: checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
