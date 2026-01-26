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
  email: string | null;
  phoneNumber: string | null;
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
    phoneNumber: null,
    userId: null,
    brokerType: null,
  });

  const checkAuth = useCallback(async () => {
    try {
      const user = await getCurrentUser();
      const attributes = await fetchUserAttributes();

      let status = (attributes["custom:status"] as UserStatus) || "registered";
      const brokerType = (attributes["custom:broker_type"] as "individual" | "firm") || null;
      const accountType = (attributes["custom:account_type"] as AccountType) || null;

      // If pending, check the DB in case Cognito is out of sync (e.g. broker accepted but lambda/api failed)
      if (status === "pending_approval" && accountType === "agent") {
        try {
          const res = await fetch(`/api/agent/status?agentId=${user.userId}`);
          if (res.ok) {
            const data = await res.json();
            // Only upgrade status, never downgrade based on this check
            if (data.status === "verified") {
              status = "verified";
            }
          }
        } catch (err) {
          console.error("Failed to revalidate status", err);
        }
      }

      setState({
        isLoading: false,
        isAuthenticated: true,
        userStatus: status,
        accountType: accountType,
        email: attributes.email || null,
        firstName: attributes.given_name || null,
        lastName: attributes.family_name || null,
        phoneNumber: attributes.phone_number || null,
        userId: user.userId || null,
        brokerType: brokerType,
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
        phoneNumber: null,
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
