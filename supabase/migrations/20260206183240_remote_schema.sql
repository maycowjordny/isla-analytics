create table "public"."linkedin_import_summaries" (
    "id" uuid not null default gen_random_uuid(),
    "date_range_text" text,
    "total_impressions" integer,
    "total_engagements" integer,
    "total_members_reached" integer,
    "imported_at" timestamp with time zone default now()
      );


CREATE UNIQUE INDEX linkedin_import_summaries_pkey ON public.linkedin_import_summaries USING btree (id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND tablename = 'linkedin_daily_metrics' AND indexname = 'unique_metric_date'
  ) THEN
    CREATE UNIQUE INDEX unique_metric_date ON public.linkedin_daily_metrics USING btree (metric_date);
  END IF;
END $$;

-- Ensure the constraint is added only if it doesn't already exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_schema = 'public' AND table_name = 'linkedin_daily_metrics' AND constraint_name = 'unique_metric_date'
  ) THEN
    ALTER TABLE "public"."linkedin_daily_metrics" ADD CONSTRAINT "unique_metric_date" UNIQUE USING INDEX "unique_metric_date";
  END IF;
END $$;

alter table "public"."linkedin_import_summaries" add constraint "linkedin_import_summaries_pkey" PRIMARY KEY using index "linkedin_import_summaries_pkey";

grant delete on table "public"."linkedin_import_summaries" to "anon";

grant insert on table "public"."linkedin_import_summaries" to "anon";

grant references on table "public"."linkedin_import_summaries" to "anon";

grant select on table "public"."linkedin_import_summaries" to "anon";

grant trigger on table "public"."linkedin_import_summaries" to "anon";

grant truncate on table "public"."linkedin_import_summaries" to "anon";

grant update on table "public"."linkedin_import_summaries" to "anon";

grant delete on table "public"."linkedin_import_summaries" to "authenticated";

grant insert on table "public"."linkedin_import_summaries" to "authenticated";

grant references on table "public"."linkedin_import_summaries" to "authenticated";

grant select on table "public"."linkedin_import_summaries" to "authenticated";

grant trigger on table "public"."linkedin_import_summaries" to "authenticated";

grant truncate on table "public"."linkedin_import_summaries" to "authenticated";

grant update on table "public"."linkedin_import_summaries" to "authenticated";

grant delete on table "public"."linkedin_import_summaries" to "service_role";

grant insert on table "public"."linkedin_import_summaries" to "service_role";

grant references on table "public"."linkedin_import_summaries" to "service_role";

grant select on table "public"."linkedin_import_summaries" to "service_role";

grant trigger on table "public"."linkedin_import_summaries" to "service_role";

grant truncate on table "public"."linkedin_import_summaries" to "service_role";

grant update on table "public"."linkedin_import_summaries" to "service_role";


