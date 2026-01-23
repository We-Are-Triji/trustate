import { Amplify } from "aws-amplify";
import {
  signIn,
  signUp,
  confirmSignUp,
  resendSignUpCode,
  updateUserAttributes,
  fetchUserAttributes,
  signOut,
  getCurrentUser,
  resetPassword,
  confirmResetPassword,
} from "@aws-amplify/auth";

// Amplify configuration is now handled in components/configure-amplify.tsx

export {
  signIn,
  signUp,
  confirmSignUp,
  resendSignUpCode,
  updateUserAttributes,
  fetchUserAttributes,
  signOut,
  getCurrentUser,
  resetPassword,
  confirmResetPassword,
};

export type { SignUpInput } from "@aws-amplify/auth";
