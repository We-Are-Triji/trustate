"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Mail, Lock, CheckCircle } from "lucide-react";
import { signIn, fetchUserAttributes, getCurrentUser } from "@/lib/cognito";
import { Button } from "@/components/ui/button";
import { ForgotPasswordModal } from "@/components/auth/forgot-password-modal";
import trustateLogo from "@/app/assets/trustate.png";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        await getCurrentUser();
        const attributes = await fetchUserAttributes();
        const accountType = attributes["custom:account_type"];
        
        if (accountType) {
          document.cookie = `accountType=${accountType}; path=/; max-age=2592000; SameSite=Strict`;
        }
        
        router.replace(accountType ? "/dashboard" : "/complete-registration");
      } catch {
        setCheckingSession(false);
      }
    };
    checkExistingSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn({ username: email, password });
      
      // Check if user has account type set
      const attributes = await fetchUserAttributes();
      const accountType = attributes["custom:account_type"];
      
      if (!accountType) {
        // User registered but didn't complete account type selection
        router.push("/complete-registration");
        return;
      }

      // Set account type cookie for middleware
      document.cookie = `accountType=${accountType}; path=/; max-age=2592000; SameSite=Strict`;
      
      // Check for redirect after login
      const redirectTo = sessionStorage.getItem("redirectAfterLogin");
      if (redirectTo) {
        sessionStorage.removeItem("redirectAfterLogin");
        router.push(redirectTo);
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-4 border-[#0247ae]/20 border-t-[#0247ae] animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full flex justify-center items-center p-4">
      {/* Custom Styles for Fluid Animation */}
      <style jsx>{`
        @keyframes spring-up {
          0% { opacity: 0; transform: translateY(40px) scale(0.95); }
          50% { opacity: 1; transform: translateY(-5px) scale(1.02); }
          100% { transform: translateY(0) scale(1); }
        }
        @keyframes slide-in-stagger {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .anim-card {
          animation: spring-up 0.8s cubic-bezier(0.2, 0.8, 0.2, 1.1) forwards;
        }
        .stagger-item {
          opacity: 0; /* Hidden by default */
          animation: slide-in-stagger 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-400 { animation-delay: 400ms; }
        .delay-500 { animation-delay: 500ms; }
      `}</style>

      {/* Main Card Container */}
      <div className="w-full max-w-md rounded-[2rem] p-8 sm:p-10 anim-card overflow-hidden relative">
        
        {/* Decorative background blob inside card */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#0247ae]/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#ffce08]/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Mobile logo */}
        <div className="mb-8 flex justify-center lg:hidden stagger-item">
          <Image
            src={trustateLogo}
            alt="TruState"
            width={140}
            height={45}
            priority
            className="drop-shadow-sm"
          />
        </div>

        {/* Welcome heading */}
        <div className="text-center mb-8 stagger-item delay-100">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#0247ae] to-[#0560d4] bg-clip-text text-transparent font-[family-name:var(--font-arsenal-sc)]">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-gray-500 font-medium">
            Please enter your details to sign in
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-5">
          {/* Email field */}
          <div className="group relative stagger-item delay-200">
            <label className="absolute -top-2 left-3 bg-white/90 backdrop-blur-sm px-2 text-xs font-semibold text-[#0247ae] z-10 rounded-full transition-all group-focus-within:text-[#0560d4]">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-[#0247ae]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="h-14 w-full rounded-xl border-2 border-gray-100 bg-white/50 pl-12 pr-4 text-gray-700 placeholder:text-gray-400 transition-all duration-300 focus:border-[#0247ae] focus:bg-white focus:shadow-lg focus:shadow-[#0247ae]/5 focus:outline-none"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="group relative stagger-item delay-300">
            <label className="absolute -top-2 left-3 bg-white/90 backdrop-blur-sm px-2 text-xs font-semibold text-[#0247ae] z-10 rounded-full transition-all group-focus-within:text-[#0560d4]">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-[#0247ae]" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="h-14 w-full rounded-xl border-2 border-gray-100 bg-white/50 pl-12 pr-12 text-gray-700 placeholder:text-gray-400 transition-all duration-300 focus:border-[#0247ae] focus:bg-white focus:shadow-lg focus:shadow-[#0247ae]/5 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-[#0247ae] hover:bg-blue-50 p-1.5 rounded-full"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Keep logged in and Forgot password */}
          <div className="flex items-center justify-between stagger-item delay-400">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={keepLoggedIn}
                  onChange={(e) => setKeepLoggedIn(e.target.checked)}
                  className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 checked:bg-[#0247ae] checked:border-[#0247ae] transition-all"
                />
                <CheckCircle className="absolute pointer-events-none opacity-0 peer-checked:opacity-100 text-white h-3 w-3 left-[2px]" />
              </div>
              <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">Keep me logged in</span>
            </label>
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm font-medium text-gray-500 transition-colors hover:text-[#0247ae] hover:underline"
            >
              Forgot password?
            </button>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 p-4 border border-red-100 animate-[shake_0.5s_ease-in-out]">
              <p className="text-sm font-medium text-red-600 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-red-600"/>
                {error}
              </p>
            </div>
          )}

          {/* Login button */}
          <div className="stagger-item delay-500 pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="relative w-full h-14 rounded-xl bg-gradient-to-r from-[#0247ae] to-[#0560d4] text-base font-bold uppercase tracking-wide text-white shadow-lg shadow-[#0247ae]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#0247ae]/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 overflow-hidden group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                  <span>Signing In...</span>
                </div>
              ) : (
                "Login to Dashboard"
              )}
            </Button>
          </div>

          {/* Register link */}
          <div className="pt-2 text-center text-sm text-gray-500 stagger-item delay-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-bold text-[#0247ae] transition-colors hover:text-[#ffce08]"
            >
              Create Account
            </Link>
          </div>
        </form>
      </div>

      <ForgotPasswordModal 
        open={showForgotPassword} 
        onClose={() => setShowForgotPassword(false)} 
      />
    </div>
  );
}