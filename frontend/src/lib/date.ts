export function toDateInputValue(dateTime: string): string {
  return dateTime.slice(0, 10);
}

export function toTimeInputValue(dateTime: string): string {
  return dateTime.slice(11, 16);
}
