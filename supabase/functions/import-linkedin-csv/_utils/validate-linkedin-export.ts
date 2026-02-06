import * as XLSX from "xlsx";

const EXPECTED_MIN_SHEETS = 5;

const DATE_RANGE_REGEX =
  /^\d{1,2}\/\d{1,2}\/\d{4}\s*-\s*\d{1,2}\/\d{1,2}\/\d{4}$/;

type ValidationResult = { ok: true } | { ok: false; message: string };

export function validateLinkedInExport(
  workbook: XLSX.WorkBook,
): ValidationResult {
  const sheetCount = workbook.SheetNames.length;

  if (sheetCount < EXPECTED_MIN_SHEETS) {
    return {
      ok: false,
      message: `Invalid file format: expected at least ${EXPECTED_MIN_SHEETS} sheets but found ${sheetCount}. Please upload a LinkedIn Analytics export.`,
    };
  }

  const discoverySheet = workbook.Sheets[workbook.SheetNames[0]];
  if (!discoverySheet) {
    return { ok: false, message: "Missing Discovery sheet." };
  }

  const dateRangeCell = discoverySheet["B1"]?.v;
  if (
    typeof dateRangeCell !== "string" ||
    !DATE_RANGE_REGEX.test(dateRangeCell.trim())
  ) {
    return {
      ok: false,
      message:
        "Invalid file format: the Discovery sheet does not contain a valid date range in cell B1. Expected format: MM/DD/YYYY - MM/DD/YYYY.",
    };
  }

  const discoveryRows = XLSX.utils.sheet_to_json<string[]>(discoverySheet, {
    header: 1,
    defval: "",
  });
  if (discoveryRows.length < 2) {
    return {
      ok: false,
      message: "Invalid file format: the Discovery sheet has no metric rows.",
    };
  }

  const impressionsVal = Number(discoveryRows[1]?.[1]);
  if (isNaN(impressionsVal)) {
    return {
      ok: false,
      message:
        "Invalid file format: the Discovery sheet does not contain numeric metrics in the expected positions.",
    };
  }

  const engagementSheet = workbook.Sheets[workbook.SheetNames[1]];
  if (!engagementSheet) {
    return { ok: false, message: "Missing Engagement sheet." };
  }

  const engagementRows = XLSX.utils.sheet_to_json<string[]>(engagementSheet, {
    header: 1,
    defval: "",
  });
  if (engagementRows.length < 2) {
    return {
      ok: false,
      message: "Invalid file format: the Engagement sheet has no data rows.",
    };
  }

  const firstEngagementDataRow = engagementRows[1];
  if (!firstEngagementDataRow || firstEngagementDataRow.length < 3) {
    return {
      ok: false,
      message:
        "Invalid file format: the Engagement sheet rows must have at least 3 columns (date, impressions, engagements).",
    };
  }

  const engagementDate = firstEngagementDataRow[0]?.toString().trim();
  if (!engagementDate || !engagementDate.includes("/")) {
    return {
      ok: false,
      message:
        "Invalid file format: the Engagement sheet does not contain valid dates.",
    };
  }

  const topPostsSheet = workbook.Sheets[workbook.SheetNames[2]];
  if (!topPostsSheet) {
    return { ok: false, message: "Missing Top Posts sheet." };
  }

  const topPostsRows = XLSX.utils.sheet_to_json<string[]>(topPostsSheet, {
    header: 1,
    defval: "",
  });
  const hasValidPost = topPostsRows.some((row) => {
    const url = row[0]?.toString().trim();
    return url && url.startsWith("http");
  });

  if (topPostsRows.length > 0 && !hasValidPost) {
    return {
      ok: false,
      message:
        "Invalid file format: the Top Posts sheet does not contain any valid post URLs.",
    };
  }

  const followersSheet = workbook.Sheets[workbook.SheetNames[3]];
  if (!followersSheet) {
    return { ok: false, message: "Missing Followers sheet." };
  }

  const followersRows = XLSX.utils.sheet_to_json<string[]>(followersSheet, {
    header: 1,
    defval: "",
  });
  if (followersRows.length < 3) {
    return {
      ok: false,
      message:
        "Invalid file format: the Followers sheet has insufficient data.",
    };
  }

  const totalFollowers = Number(followersRows[0]?.[1]);
  if (isNaN(totalFollowers)) {
    return {
      ok: false,
      message:
        "Invalid file format: the Followers sheet does not contain a valid total followers count.",
    };
  }

  const demographicsSheet = workbook.Sheets[workbook.SheetNames[4]];
  if (!demographicsSheet) {
    return { ok: false, message: "Missing Demographics sheet." };
  }

  const demographicsRows = XLSX.utils.sheet_to_json<string[]>(
    demographicsSheet,
    { header: 1, defval: "" },
  );
  if (demographicsRows.length < 3) {
    return {
      ok: false,
      message:
        "Invalid file format: the Demographics sheet has insufficient data.",
    };
  }

  const firstDemoRow = demographicsRows[2];
  if (!firstDemoRow || firstDemoRow.length < 3) {
    return {
      ok: false,
      message:
        "Invalid file format: the Demographics sheet rows must have at least 3 columns (category, label, percentage).",
    };
  }

  return { ok: true };
}
