import { Metadata } from "next";
import LoginPageClient from "@/components/auth/login/login-page-client";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return <LoginPageClient />;
}