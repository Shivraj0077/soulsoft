import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatSalaryWithRupee = (salaryRange) => {
  if (!salaryRange) return 'Competitive';
  // Remove any existing currency symbols or special characters
  const cleanSalary = salaryRange.replace(/[₹$,]/g, '').trim();
  return `₹ ${cleanSalary}`;
};
