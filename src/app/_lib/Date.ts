'use server'

import 'server-only'
import { addMonths, endOfMonth, setDate, getDaysInMonth } from 'date-fns';

export function getNextMonthDate(selectedDate: Date) {
  const nextMonthDate = addMonths(selectedDate, 1);
  const daysInNextMonth = getDaysInMonth(nextMonthDate);

  // Check if the selected date exceeds the number of days in the next month
  const newDay = Math.min(selectedDate.getDate(), daysInNextMonth);

  // Set the new date
  return setDate(nextMonthDate, newDay);
}

// Example usage:
const selectedDate = new Date(2024, 0, 31); // January 31st, 2024
const nextMonthDate = getNextMonthDate(selectedDate);
console.log(nextMonthDate); // Outputs: February 29th, 2024 (Leap year example)