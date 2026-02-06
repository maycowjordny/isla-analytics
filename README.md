# 📊 Isla Analytics – LinkedIn Weekly Insights

Full Stack application developed as part of the **Technical Challenge – Isla Company**.

**Isla Analytics** is a complete web solution that allows users to upload weekly exports of LinkedIn Analytics data, process the data, and generate interactive dashboards with metrics, charts, and AI-generated insights. The system was built to provide a smooth and intuitive experience, focusing on data analysis and visualization.

> Developed by: **Maycow Jordny**

---

## 🌐 Important Links

- **Live Deployment**: [https://isla-analytics.vercel.app/](https://isla-analytics.vercel.app/)
- **Lovable Prototype**: [https://analytics-isla-test.lovable.app](https://analytics-isla-test.lovable.app)
- **Figma Design**: [https://www.figma.com/design/klCQhglpdHXnZCbq51tvFK](https://www.figma.com/design/klCQhglpdHXnZCbq51tvFK)
- **Download LinkedIn Analytics CSV**: [https://www.linkedin.com/analytics/creator/content/?metricType=IMPRESSIONS&timeRange=past_365_days](https://www.linkedin.com/analytics/creator/content/?metricType=IMPRESSIONS&timeRange=past_365_days)

---

## 🧠 About the Project

**Isla Analytics** is a web application for weekly analysis of LinkedIn data. Users can upload CSV files exported from LinkedIn Analytics, and the system processes the data to generate dashboards with the following information:

- **Weekly Scoreboard**: Weekly KPIs with week-over-week (WoW) deltas.
- **Daily Momentum and Follower Growth Charts**.
- **Top Content**: Lists of the most relevant posts by engagement and impressions.
- **Audience Profile**: Audience profiles by titles, locations, industries, seniority, and size.
- **AI Coach Insights**: AI-generated insights with goals for the next week.

---

## ✅ Features

- [x] Upload CSV files exported from LinkedIn.
- [x] Automatic validation and processing of data.
- [x] Dashboard generation with:
  - Weekly KPIs.
  - Daily Momentum and Follower Growth Charts.
  - Top Content lists.
  - Audience profiles.
  - AI-generated insights.
- [x] Comparison with previous weeks.
- [x] History of uploads and viewing past weeks.
- [x] Timeframe toggle: 7, 14, 30, and 60 days.
- [x] Data persistence in Supabase.
- [x] Row-Level Security (RLS) for access control.

---

## 🛠️ Technologies Used

- [React (Vite)](https://vitejs.dev/)
- [Supabase](https://supabase.com/)
- [Deno](https://deno.land/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Anthropic AI](https://www.anthropic.com/)
- [Figma](https://www.figma.com/)

---

## ✨ Implemented Differentials

- ✅ **AI-Generated Insights (Anthropic)**: 3 main insights and 1 weekly goal.
- ✅ **Comparison with Previous Weeks**: Percentage deltas and percentage-point changes.
- ✅ **Robust CSV Validation**: Error handling and clear messages.
- ✅ **Interactive and Responsive Dashboard**: Smooth visualization on mobile and desktop devices.
- ✅ **Data Persistence in Supabase**: Secure and efficient storage.
- ✅ **Row-Level Security (RLS)**: Ensures data privacy and security.

---

## 💡 Future Evolution Ideas

- **Technical Improvements**:
  - Add support for other export formats.
  - Improve performance for processing large files.
  - Implement end-to-end (e2e) tests.
- **Business Improvements**:
  - Add support for other social media platforms.
  - Create automated reports for email delivery.
  - Implement gamification to enhance user engagement.

---

## ▶️ How to Run Locally

1. **Clone the repository**

   ```bash
   git clone https://github.com/maycowjordny/isla-analytics.git

   cd isla-analytics
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Add environment variables**

   ```bash
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ANTHROPIC_API_KEY=your_anthropic_api_key
   ```

4. **Start the application**

   ```bash
   npm run dev
   ```

5. **Access in the browser**

   ```
   http://localhost:3000
   ```

---

## 📂 Project Structure

- **src/**: Main application source code.
- **supabase/**: Edge functions and Supabase configuration.
- **public/**: Static files.
- **migrations/**: Database migration scripts.
- **snippets/**: Auxiliary SQL queries.

---

## 📜 License

This project is exclusively for technical evaluation purposes and should not be used for other purposes without prior authorization.

---

**Developed with ❤️ by Maycow Jordny**
