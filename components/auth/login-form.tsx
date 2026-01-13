"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { signIn } from "@/lib/cognito";
import { Button } from "@/components/ui/button";
import trustateLogo from "@/app/assets/trustate.png";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn({ username: email, password });
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex w-full max-w-md flex-col items-center">
      {/* Mobile logo */}
      <div className="mb-6 flex justify-center lg:hidden">
        <Image
          src={trustateLogo}
          alt="TruState"
          width={140}
          height={45}
          priority
        />
      </div>

      {/* Welcome heading - larger */}
      <h1 className="mb-2 text-center text-5xl font-bold text-[#0247ae] animate-[fadeInUp_0.6s_ease-out_0.4s_both] font-[family-name:var(--font-arsenal-sc)]">
        Welcome Back
      </h1>
      <p className="mb-8 text-center text-base text-gray-500 animate-[fadeInUp_0.5s_ease-out_0.5s_both]">
        Log in with Email
      </p>

      <form onSubmit={handleSubmit} className="w-full space-y-6">
        {/* Email field with floating label */}
        <div className="relative animate-[fadeInUp_0.5s_ease-out_0.55s_both]">
          <div className="relative">
            <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-[#0247ae] z-10">
              Email Id
            </label>
            <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="h-14 w-full rounded-lg border-2 border-[#0247ae]/30 bg-white pl-12 pr-4 text-gray-700 placeholder:text-gray-400 focus:border-[#0247ae] focus:outline-none transition-all duration-200"
            />
          </div>
        </div>

        {/* Password field with floating label */}
        <div className="relative animate-[fadeInUp_0.5s_ease-out_0.6s_both]">
          <div className="relative">
            <label className="absolute -top-2 left-3 bg-white px-1 text-xs text-[#0247ae] z-10">
              Password
            </label>
            <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="h-14 w-full rounded-lg border-2 border-[#0247ae]/30 bg-white pl-12 pr-12 text-gray-700 placeholder:text-gray-400 focus:border-[#0247ae] focus:outline-none transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-[#0247ae]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Keep logged in and Forgot password row */}
        <div className="flex items-center justify-between animate-[fadeInUp_0.5s_ease-out_0.65s_both]">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={keepLoggedIn}
              onChange={(e) => setKeepLoggedIn(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-[#0247ae] focus:ring-[#0247ae]"
            />
            <span className="text-sm text-gray-600">Keep me logged in</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-sm text-gray-500 transition-colors hover:text-[#0247ae]"
          >
            Forgot your password?
          </Link>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3">
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          </div>
        )}

        {/* Login button - full width */}
        <div className="pt-2 animate-[fadeInUp_0.5s_ease-out_0.7s_both]">
          <Button
            type="submit"
            disabled={loading}
            className="h-14 w-full rounded-lg bg-[#0247ae] text-base font-semibold uppercase tracking-wide text-white shadow-md transition-all duration-300 hover:bg-[#023a8a] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "..." : "Login"}
          </Button>
        </div>

        {/* Register link */}
        <p className="pt-4 text-center text-sm text-gray-600 animate-[fadeInUp_0.5s_ease-out_0.75s_both]">
          Don&apos;t have account?{" "}
          <Link
            href="/register"
            className="font-semibold text-[#0247ae] transition-colors hover:text-[#ffce08]"
          >
            Register Now
          </Link>
        </p>
      </form>
    </div>
  );
}
