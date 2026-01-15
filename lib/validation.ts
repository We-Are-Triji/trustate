export const validators = {
  name: (value: string): string | null => {
    if (!value.trim()) return "Required";
    if (!/^[a-zA-Z\s\-']+$/.test(value)) return "Letters only";
    if (value.length < 2) return "Too short";
    return null;
  },

  email: (value: string): string | null => {
    if (!value.trim()) return "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email";
    return null;
  },

  mobile: (value: string): string | null => {
    if (!value.trim()) return "Required";
    const cleaned = value.replace(/\D/g, "");
    if (!/^(09\d{9}|639\d{9})$/.test(cleaned)) return "Invalid PH mobile";
    return null;
  },

  dateOfBirth: (value: string): string | null => {
    if (!value) return "Required";
    const date = new Date(value);
    const now = new Date();
    const age = now.getFullYear() - date.getFullYear();
    if (age < 18) return "Must be 18+";
    if (age > 120) return "Invalid date";
    return null;
  },

  password: (value: string): string | null => {
    if (!value) return "Required";
    if (value.length < 8) return "Min 8 characters";
    return null;
  },
};

export function getPasswordStrength(password: string): number {
  let score = 0;
  if (password.length >= 8) score += 20;
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;
  if (/[a-z]/.test(password)) score += 15;
  if (/[A-Z]/.test(password)) score += 15;
  if (/\d/.test(password)) score += 15;
  if (/[^a-zA-Z\d]/.test(password)) score += 15;
  return Math.min(score, 100);
}

export function getStrengthLabel(score: number): string {
  if (score < 20) return "Weak";
  if (score < 40) return "Fair";
  if (score < 60) return "Good";
  if (score < 80) return "Strong";
  return "Very Strong";
}

export function getStrengthColor(score: number): string {
  if (score < 20) return "bg-red-500";
  if (score < 40) return "bg-orange-500";
  if (score < 60) return "bg-yellow-500";
  if (score < 80) return "bg-green-500";
  return "bg-emerald-400";
}
