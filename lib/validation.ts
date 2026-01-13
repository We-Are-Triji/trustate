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
  if (password.length >= 8) score += 25;
  if (/[a-z]/.test(password)) score += 25;
  if (/[A-Z]/.test(password)) score += 25;
  if (/\d/.test(password)) score += 15;
  if (/[^a-zA-Z\d]/.test(password)) score += 10;
  return Math.min(score, 100);
}

export function getStrengthLabel(score: number): string {
  if (score < 25) return "Weak";
  if (score < 50) return "Fair";
  if (score < 75) return "Good";
  return "Strong";
}

export function getStrengthColor(score: number): string {
  if (score < 25) return "bg-red-500";
  if (score < 50) return "bg-orange-500";
  if (score < 75) return "bg-yellow-500";
  return "bg-green-500";
}
