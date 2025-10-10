import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getNextOccurrence(scheduleType: string, scheduleDays: number[], from: Date) {
  const date = new Date(from);
  date.setHours(0, 0, 0, 0);

  if (scheduleType === "daily") {
    return date;
  }

  if (scheduleType === "weekdays") {
    const day = date.getDay();
    if (day >= 1 && day <= 5) {
      return date;
    }
  }

  if (scheduleType === "custom") {
    const day = date.getDay();
    if (scheduleDays.includes(day)) {
      return date;
    }
  }

  return date;
}
