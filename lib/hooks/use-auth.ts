"use client";

import { useEffect, useState } from "react";
import { getCurrentUser, fetchUserAttributes } from "aws-amplify/auth";
import type { UserStatus, AccountType } from "@/lib/types/registration";

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  userStatus: UserStatus | null;
  accountType: AccountType | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    userStatus: null,
    accountType: null,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      await getCurrentUser();
      const attributes = await fetchUserAttributes();
      
      setState({
        isLoading: false,
        isAuthenticated: true,
        userStatus: (attributes["custom:status"] as UserStatus) || "registered",
        accountType: (attributes["custom:account_type"] as AccountType) || null,
      });
    } catch {
      setState({
        isLoading: false,
        isAuthenticated: false,
        userStatus: null,
        accountType: null,
      });
    }
  };

  return state;
}
