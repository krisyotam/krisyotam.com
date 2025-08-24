/**
 * Format a date string into a more readable format
 * @param dateString ISO date string
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  // Handle null, undefined, or empty strings
  if (!dateString || typeof dateString !== 'string') {
    return 'Invalid date'
  }
  
  // Parse the date parts from the string to avoid timezone issues
  const [year, month, day] = dateString.split('-').map(num => parseInt(num, 10))
  
  // Create date with explicit year, month (0-indexed), and day
  const date = new Date(year, month - 1, day)
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid date'
  }
  
  // Format as Month Day, Year (e.g., "April 30, 2025")
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC' // Use UTC to preserve the exact date
  })
}

/**
 * Format a date string into a compact format
 * @param dateString ISO date string
 * @returns Formatted date string (e.g., "Apr 30, 2025")
 */
export function formatDateCompact(dateString: string): string {
  // Parse the date parts from the string to avoid timezone issues
  const [year, month, day] = dateString.split('-').map(num => parseInt(num, 10))
  
  // Create date with explicit year, month (0-indexed), and day
  const date = new Date(year, month - 1, day)
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid date'
  }
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC' // Use UTC to preserve the exact date
  })
}

export function getCurrentMonthYear(): string {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  })
}

/**
 * Format a date range from start date to end date
 * @param startDate ISO date string for start date
 * @param endDate ISO date string for end date (optional)
 * @returns Formatted date range string
 */
export function formatDateRange(startDate: string, endDate?: string): string {
  // Handle null, undefined, or empty strings for start date
  if (!startDate || typeof startDate !== 'string') {
    return 'Invalid date'
  }

  const formattedStart = formatDate(startDate)
  
  // If no end date or end date is the same as start date, return just the start date
  if (!endDate || endDate === startDate) {
    return formattedStart
  }

  const formattedEnd = formatDate(endDate)
  
  // Always show full range: "Month Day, Year - Month Day, Year"
  return `${formattedStart} - ${formattedEnd}`
}

export function formatDateWithValidation(date: unknown): string {
if (!(date instanceof Date) || isNaN(date.getTime())) {
  return "Invalid Date";
}
return date.toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});
}