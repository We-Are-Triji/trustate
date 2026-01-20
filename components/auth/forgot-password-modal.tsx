"use client";

import { useState } from "react";
import { CheckCircle, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PasswordMeter } from "@/components/auth/shared/password-meter";
import { resetPassword, confirmResetPassword } from "aws-amplify/auth";

type Step = "email" | "otp" | "password" | "success";

interface ForgotPasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export function ForgotPasswordModal({ open, onClose }: ForgotPasswordModalProps) {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = () => {
    setStep("email");
    setEmail("");
    setOtp("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setLoading(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleSendCode = async () => {
    if (!email) {
      setError("Email is required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await resetPassword({ username: email });
      setStep("otp");
    } catch (err: any) {
      setError(err.message || "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = () => {
    if (otp.length !== 6) {
      setError("Enter 6-digit code");
      return;
    }
    setError("");
    setStep("password");
  };

  const handleResetPassword = async () => {
    if (!password) {
      setError("Password is required");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: otp,
        newPassword: password,
      });
      setStep("success");
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError("");
    try {
      await resetPassword({ username: email });
    } catch (err: any) {
      setError(err.message || "Failed to resend code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && !loading && handleClose()}>
      <DialogContent className="sm:max-w-md">
        {step === "success" ? (
          <div className="py-8 flex flex-col items-center animate-[fadeInScale_0.3s_ease-out]">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Password Reset!</h3>
            <p className="text-sm text-gray-500 mt-1">You can now sign in with your new password</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#0247ae]/10">
                {step === "email" && <Mail className="h-6 w-6 text-[#0247ae]" />}
                {step === "otp" && <Mail className="h-6 w-6 text-[#0247ae]" />}
                {step === "password" && <Lock className="h-6 w-6 text-[#0247ae]" />}
              </div>
              <DialogTitle className="text-center text-gray-800">
                {step === "email" && "Reset Password"}
                {step === "otp" && "Verify Email"}
                {step === "password" && "New Password"}
              </DialogTitle>
              <DialogDescription className="text-center">
                {step === "email" && "Enter your email to receive a verification code"}
                {step === "otp" && (
                  <>
                    We sent a 6-digit code to<br />
                    <span className="font-medium text-gray-700">{email}</span>
                  </>
                )}
                {step === "password" && "Enter your new password"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {step === "email" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="border-[#E2E8F0] bg-[#F8FAFC]"
                      autoFocus
                    />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button
                    onClick={handleSendCode}
                    disabled={loading || !email}
                    className="w-full bg-[#0247ae] hover:bg-[#023a8a] h-11"
                  >
                    {loading ? "Sending..." : "Send Code"}
                  </Button>
                </>
              )}

              {step === "otp" && (
                <>
                  <Input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="000000"
                    className="text-center text-2xl tracking-widest border-[#E2E8F0] bg-[#F8FAFC] h-14"
                    maxLength={6}
                    autoFocus
                  />
                  {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                  <Button
                    onClick={handleVerifyOtp}
                    disabled={otp.length !== 6}
                    className="w-full bg-[#0247ae] hover:bg-[#023a8a] h-11"
                  >
                    Verify Code
                  </Button>
                  <p className="text-center text-sm text-gray-500">
                    Didn&apos;t receive the code?{" "}
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={loading}
                      className="font-medium text-[#0247ae] hover:text-[#023a8a] disabled:opacity-50"
                    >
                      Resend
                    </button>
                  </p>
                </>
              )}

              {step === "password" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="border-[#E2E8F0] bg-[#F8FAFC]"
                      autoFocus
                    />
                    <PasswordMeter password={password} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="border-[#E2E8F0] bg-[#F8FAFC]"
                    />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button
                    onClick={handleResetPassword}
                    disabled={loading || !password || !confirmPassword}
                    className="w-full bg-[#0247ae] hover:bg-[#023a8a] h-11"
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </Button>
                </>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
