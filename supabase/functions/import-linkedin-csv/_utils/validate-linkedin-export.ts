import * as XLSX from "xlsx";

const EXPECTED_MIN_SHEETS = 5;
const DATE_RANGE_REGEX = /\d+.*-.*\d+/;

type ValidationResult = { ok: true } | { ok: false; message: string };

export function validateLinkedInExport(
  workbook: XLSX.WorkBook,
): ValidationResult {
  const sheetCount = workbook.SheetNames.length;

  if (sheetCount < EXPECTED_MIN_SHEETS) {
    return {
      ok: false,
      message: `Invalid file format: expected at least ${EXPECTED_MIN_SHEETS} sheets but found ${sheetCount}. Please upload a valid LinkedIn Analytics export.`,
    };
  }

  const discoverySheet = workbook.Sheets[workbook.SheetNames[0]];
  if (!discoverySheet) {
    return { ok: false, message: "Missing Discovery sheet." };
  }

  const dateRangeCell = discoverySheet["B1"]?.v;

  if (
    typeof dateRangeCell !== "string" ||
    !dateRangeCell.trim() ||
    !DATE_RANGE_REGEX.test(dateRangeCell)
  ) {
    return {
      ok: false,
      message:
        "Invalid file format: Discovery sheet B1 does not contain a valid date range.",
    };
  }

  if (!workbook.Sheets[workbook.SheetNames[1]])
    return { ok: false, message: "Missing Engagement sheet." };

  if (!workbook.Sheets[workbook.SheetNames[2]])
    return { ok: false, message: "Missing Top Posts sheet." };

  if (!workbook.Sheets[workbook.SheetNames[3]])
    return { ok: false, message: "Missing Followers sheet." };

  if (!workbook.Sheets[workbook.SheetNames[4]])
    return { ok: false, message: "Missing Demographics sheet." };

  return { ok: true };
}
