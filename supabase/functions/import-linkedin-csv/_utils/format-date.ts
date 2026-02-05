export function formatDate(dateStr: string): string | null {
  const parts = dateStr.split("/");

  const firstNum = Number(parts[0]);
  if (firstNum > 12) {
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  const [month, day, year] = parts;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}
