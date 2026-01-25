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
  firstName: string | null;
  lastName: string | null;
  userId: string | null;
  brokerType: "individual" | "firm" | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    userStatus: null,
    accountType: null,
    email: null,
    firstName: null,
    lastName: null,
    userId: null,
    brokerType: null,
  });

  const checkAuth = useCallback(async () => {
    try {
      const user = await getCurrentUser();
      const attributes = await fetchUserAttributes();

      setState({
        isLoading: false,
        isAuthenticated: true,
        userStatus: (attributes["custom:status"] as UserStatus) || "registered",
        accountType: (attributes["custom:account_type"] as AccountType) || null,
        email: attributes.email || null,
        firstName: attributes.given_name || null,
        lastName: attributes.family_name || null,
        userId: user.userId || null,
        brokerType: (attributes["custom:broker_type"] as "individual" | "firm") || null,
      });
    } catch {
      setState({
        isLoading: false,
        isAuthenticated: false,
        userStatus: null,
        accountType: null,
        email: null,
        firstName: null,
        lastName: null,
        userId: null,
        brokerType: null,
      });
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return { ...state, refetch: checkAuth };
}
