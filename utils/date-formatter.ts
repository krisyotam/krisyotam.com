export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function getCurrentMonthYear(): string {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  })
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