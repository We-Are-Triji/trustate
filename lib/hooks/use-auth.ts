"use client";

import { useEffect, useState, useCallback } from "react";
import { getCurrentUser, fetchUserAttributes } from "aws-amplify/auth";
import type { UserStatus, AccountType } from "@/lib/types/registration";

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  userStatus: UserStatus | null;
  accountType: AccountType | null;
  email: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    userStatus: null,
    accountType: null,
    email: null,
  });

  const checkAuth = useCallback(async () => {
    try {
      await getCurrentUser();
      const attributes = await fetchUserAttributes();
      
      setState({
        isLoading: false,
        isAuthenticated: true,
        userStatus: (attributes["custom:status"] as UserStatus) || "registered",
        accountType: (attributes["custom:account_type"] as AccountType) || null,
        email: attributes.email || null,
      });
    } catch {
      setState({
        isLoading: false,
        isAuthenticated: false,
        userStatus: null,
        accountType: null,
        email: null,
      });
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return { ...state, refetch: checkAuth };
}
