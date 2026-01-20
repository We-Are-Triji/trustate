import { TOTP } from "otpauth";

export function generateTOTPSecret(): string {
  const totp = new TOTP({
    issuer: "TruState",
    label: "Broker Nexus",
    algorithm: "SHA1",
    digits: 6,
    period: 30,
  });
  return totp.secret.base32;
}

export function generateTOTPCode(secret: string): string {
  const totp = new TOTP({
    issuer: "TruState",
    label: "Broker Nexus",
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: secret,
  });
  return totp.generate();
}

export function verifyTOTPCode(secret: string, token: string): boolean {
  const totp = new TOTP({
    issuer: "TruState",
    label: "Broker Nexus",
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: secret,
  });
  
  // Allow 1 period before and after for clock skew
  const delta = totp.validate({ token, window: 1 });
  return delta !== null;
}

export function getTOTPTimeRemaining(): number {
  const now = Math.floor(Date.now() / 1000);
  const period = 30;
  return period - (now % period);
}
