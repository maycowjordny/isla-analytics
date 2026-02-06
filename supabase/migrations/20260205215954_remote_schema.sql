alter table "public"."linkedin_audience_demographics" enable row level security;

alter table "public"."linkedin_daily_metrics" enable row level security;

alter table "public"."linkedin_followers_daily" enable row level security;

alter table "public"."linkedin_posts" enable row level security;

alter table "public"."uploads" enable row level security;


  create policy "Enable public read access for demographics"
  on "public"."linkedin_audience_demographics"
  as permissive
  for select
  to public
using (true);



  create policy "Leitura pública de demografia"
  on "public"."linkedin_audience_demographics"
  as permissive
  for select
  to public
using (true);



  create policy "Enable public read access for daily metrics"
  on "public"."linkedin_daily_metrics"
  as permissive
  for select
  to public
using (true);



  create policy "Leitura pública das métricas"
  on "public"."linkedin_daily_metrics"
  as permissive
  for select
  to public
using (true);



  create policy "Enable public read access for followers"
  on "public"."linkedin_followers_daily"
  as permissive
  for select
  to public
using (true);



  create policy "Leitura pública de seguidores"
  on "public"."linkedin_followers_daily"
  as permissive
  for select
  to public
using (true);



  create policy "Enable public read access for posts"
  on "public"."linkedin_posts"
  as permissive
  for select
  to public
using (true);



  create policy "Leitura pública de posts"
  on "public"."linkedin_posts"
  as permissive
  for select
  to public
using (true);



  create policy "Enable public insert for uploads"
  on "public"."uploads"
  as permissive
  for insert
  to public
with check (true);



  create policy "Enable public read access for uploads"
  on "public"."uploads"
  as permissive
  for select
  to public
using (true);




