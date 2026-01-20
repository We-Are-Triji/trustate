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

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
    },
  },
});

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
