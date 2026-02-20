import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as apiLogin } from "@/api/auth";
import { getCurrentUser } from "@/api/users";
import { setOnUnauthorized } from "@/lib/api/client";
import { setToken, clearToken, getToken } from "@/lib/api/tokenStore";
import { ALL_PERMISSION_KEYS } from "@/lib/menuConfig";
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

/** Build synthetic CurrentUser from login response when /me fails */
function buildFallbackUser(loginUser: { id: string | number; username: string; role?: string }): CurrentUser {
  const roleCode = loginUser.role ?? "SUPER_ADMIN";
  return {
    id: String(loginUser.id),
    username: loginUser.username,
    email: "",
    fullName: loginUser.username,
    roleId: "",
    isActive: true,
    role: {
      id: `role-${roleCode}`,
      code: roleCode,
      name: roleCode,
      permissionKeys: roleCode === "SUPER_ADMIN" ? [...ALL_PERMISSION_KEYS] : ["dashboard", "finance", "hr", "access_control"],
    },
  };
}

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
      if (fullUser) {
        setCurrentUser(fullUser);
      } else {
        setCurrentUser(buildFallbackUser(user as { id: string | number; username: string; role?: string }));
      }
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

    const AUTH_CHECK_TIMEOUT_MS = 10_000;

    const timeoutPromise = new Promise<null>((resolve) => {
      setTimeout(() => resolve(null), AUTH_CHECK_TIMEOUT_MS);
    });

    Promise.race([getCurrentUser(), timeoutPromise])
      .then((user) => {
        if (!cancelled) setCurrentUser(user);
      })
      .catch(() => {
        if (!cancelled) setCurrentUser(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const permissions = useMemo(() => {
    const keys = currentUser?.role?.permissionKeys;
    if (keys?.length) return keys;
    if (currentUser?.role?.code === "SUPER_ADMIN") return ALL_PERMISSION_KEYS;
    return [];
  }, [currentUser?.role?.permissionKeys, currentUser?.role?.code]);

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
