import { Anthropic } from "@anthropic-ai/sdk";
import { supabase } from "../../functions/_shared/supabase.ts";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");

    if (!anthropicKey) {
      throw new Error("ANTHROPIC_API_KEY environment variable is not set.");
    }

    const anthropic = new Anthropic({ apiKey: anthropicKey });

    const [dailyMetrics, posts, demographics] = await Promise.all([
      supabase
        .from("linkedin_daily_metrics")
        .select("metric_date, impressions, engagements")
        .order("metric_date", { ascending: false })
        .limit(7),
      supabase
        .from("linkedin_posts")
        .select("published_at, impressions, engagements, engagement_rate")
        .order("published_at", { ascending: false })
        .limit(10),
      supabase
        .from("linkedin_audience_demographics")
        .select("category, label, percentage"),
    ]);

    const systemPrompt = `
      You are a LinkedIn Data Analyst.
      LANGUAGE RULES:
      - Use ONLY simple English (5th-grade level).
      - No technical jargon (Instead of "Engagement Rate", say "people who liked or commented").
      - No "CTR", "Impressions", or "Metrics" in the final text. Use "views" and "activity".
      
      DATA RULES:
      - Use ONLY the numbers provided. Do not hallucinate.
      - Always provide exactly 4 insights.
      
      OUTPUT FORMAT:
      - Return ONLY a JSON object with these keys: "what_worked", "improve", "next_week_goal", "try_it".
    `;

    const userPrompt = `
      Analyze these LinkedIn stats and generate 4 simple insights:
      
      - Daily Activity (Last 7 days): ${JSON.stringify(dailyMetrics.data)}
      - Recent Posts Performance: ${JSON.stringify(posts.data)}
      - Audience Type: ${JSON.stringify(demographics.data)}
      
      Instructions for each JSON key:
      1. "what_worked": Mention the best day and the exact number of views and likes.
      2. "improve": Look at total views. If 1-2 posts did all the work, tell them to post more often. 
      3. "next_week_goal": Find the top audience group (label) and suggest a simple topic for them.
      4. "try_it": Calculate a goal. If their average likes are X, suggest a goal of X + 10%.
    `;

    const msg = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const aiResponse =
      msg.content[0].type === "text" ? msg.content[0].text : "";

    return new Response(aiResponse, {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
