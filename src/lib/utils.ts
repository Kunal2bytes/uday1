import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimeTo12Hour(time24: string): string {
  if (!time24 || !/^\d{2}:\d{2}$/.test(time24)) {
    // console.warn(`Invalid time format passed to formatTimeTo12Hour: ${time24}`);
    return time24; // Return original or a placeholder like "Invalid Time"
  }
  const [hoursStr, minutesStr] = time24.split(':');
  let hours = parseInt(hoursStr, 10);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // Convert hour '0' to '12' for 12 AM
  const formattedHours = hours.toString().padStart(2, '0');
  return `${formattedHours}:${minutesStr} ${ampm}`;
}

export function toTitleCase(str: string): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
