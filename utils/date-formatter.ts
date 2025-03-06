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
  
  