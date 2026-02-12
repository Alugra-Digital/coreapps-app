import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "@/api/users";
import type { CurrentUser } from "@/access-control/users/types";

interface AuthContextValue {
  currentUser: CurrentUser | null;
  isLoading: boolean;
  permissions: string[];
  refetch: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refetch = useCallback(async () => {
    const user = await getCurrentUser();
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    let cancelled = false;
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
