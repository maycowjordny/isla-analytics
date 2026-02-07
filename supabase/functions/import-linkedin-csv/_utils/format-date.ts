export function formatDate(dateStr: string, isPTBR: boolean): string | null {
  if (!dateStr || !dateStr.includes("/")) return null;

  const parts = dateStr.split("/");
  if (parts.length < 3) return null;

  let day, month, year;

  if (isPTBR) {
    [day, month, year] = parts;
  } else {
    [month, day, year] = parts;
  }

  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}
