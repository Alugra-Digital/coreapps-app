import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as apiLogin } from "@/api/auth";
import { getCurrentUser } from "@/api/users";
import { setOnUnauthorized } from "@/lib/api/client";
import { setToken, clearToken, getToken } from "@/lib/api/tokenStore";
import type { CurrentUser } from "@/access-control/users/types";

interface AuthContextValue {
  currentUser: CurrentUser | null;
  isLoading: boolean;
  permissions: string[];
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refetch: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    clearToken();
    setCurrentUser(null);
  }, []);

  const refetch = useCallback(async () => {
    const user = await getCurrentUser();
    setCurrentUser(user);
  }, []);

  const login = useCallback(
    async (username: string, password: string) => {
      const { token, user } = await apiLogin(username, password);
      setToken(token);
      const fullUser = await getCurrentUser();
      setCurrentUser(fullUser ?? (user as CurrentUser));
    },
    []
  );

  useEffect(() => {
    setOnUnauthorized(() => {
      logout();
      navigate("/login");
    });
    return () => setOnUnauthorized(null);
  }, [logout, navigate]);

  useEffect(() => {
    let cancelled = false;
    const token = getToken();
    if (!token) {
      setCurrentUser(null);
      if (!cancelled) setIsLoading(false);
      return;
    }
    getCurrentUser()
      .then((user) => {
        if (!cancelled) setCurrentUser(user);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const permissions = currentUser?.role?.permissionKeys ?? [];

  const value: AuthContextValue = {
    currentUser,
    isLoading,
    permissions,
    login,
    logout,
    refetch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

/** Returns the list of permission keys for the current user's role (for RBAC menu). */
export function usePermissions(): string[] {
  const { permissions } = useAuth();
  return permissions;
}
