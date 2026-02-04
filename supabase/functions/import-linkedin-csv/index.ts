import "@supabase/functions-js/edge-runtime.d.ts"
import * as XLSX from "https://esm.sh/xlsx@0.18.5"
import { populateDiscovery } from "./_utils/populate-discovery.ts"
import { populateFollowersDaily } from "./_utils/populate-followers_daily.ts"

Deno.serve(async (req) => {
  const form = await req.formData()
  const file = form.get("file")

  if (!file || !(file instanceof File)) return new Response("File missing", { status: 400 })
  
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: "array" })
  
  const sheetName = workbook.SheetNames.find(
    (name) => name.toLowerCase() === "discovery"
  )

  if (!sheetName) return new Response("Discovery sheet not found", { status: 400 })
  
  const sheet = workbook.Sheets[sheetName]
  const rows = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1 })

  const { dateRange } = await populateDiscovery(rows as string[][])

  const endDate = dateRange.split("-")[1]?.trim() ?? ""
  const metricDate = endDate
    ? endDate.split("/").reverse().join("-") 
    : null

  if (!metricDate) return new Response("Metric date not found", { status: 400 })

  const followersSheetName = workbook.SheetNames.find((name) =>
    name.toLowerCase().includes("followers")
  )

  if (!followersSheetName) {
    return new Response("Followers sheet not found", { status: 400 })
  }

  const followersSheet = workbook.Sheets[followersSheetName]
  const followersRows = XLSX.utils.sheet_to_json<string[]>(followersSheet, { header: 1 })

  await populateFollowersDaily(followersRows as string[][])

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  })
})