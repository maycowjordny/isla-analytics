


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";





SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."linkedin_audience_demographics" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "category" "text" NOT NULL,
    "label" "text" NOT NULL,
    "percentage" numeric(5,2) NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."linkedin_audience_demographics" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."linkedin_daily_metrics" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "metric_date" "date" NOT NULL,
    "impressions" integer DEFAULT 0,
    "engagements" integer DEFAULT 0,
    "members_reached" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."linkedin_daily_metrics" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."linkedin_followers_daily" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "metric_date" "date" NOT NULL,
    "new_followers" integer DEFAULT 0,
    "total_followers" integer,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."linkedin_followers_daily" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."linkedin_posts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "post_url" "text" NOT NULL,
    "published_at" "date" NOT NULL,
    "impressions" integer DEFAULT 0,
    "engagements" integer DEFAULT 0,
    "engagement_rate" numeric(5,2),
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."linkedin_posts" OWNER TO "postgres";


ALTER TABLE ONLY "public"."linkedin_audience_demographics"
    ADD CONSTRAINT "linkedin_audience_demographics_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."linkedin_daily_metrics"
    ADD CONSTRAINT "linkedin_daily_metrics_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."linkedin_followers_daily"
    ADD CONSTRAINT "linkedin_followers_daily_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."linkedin_posts"
    ADD CONSTRAINT "linkedin_posts_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_linkedin_audience_category" ON "public"."linkedin_audience_demographics" USING "btree" ("category");



CREATE INDEX "idx_linkedin_audience_category_percentage" ON "public"."linkedin_audience_demographics" USING "btree" ("category", "percentage" DESC);



CREATE INDEX "idx_linkedin_daily_metrics_date" ON "public"."linkedin_daily_metrics" USING "btree" ("metric_date");



CREATE INDEX "idx_linkedin_followers_daily_date" ON "public"."linkedin_followers_daily" USING "btree" ("metric_date");



CREATE INDEX "idx_linkedin_posts_engagements" ON "public"."linkedin_posts" USING "btree" ("engagements" DESC);



CREATE INDEX "idx_linkedin_posts_impressions" ON "public"."linkedin_posts" USING "btree" ("impressions" DESC);



CREATE INDEX "idx_linkedin_posts_published_at" ON "public"."linkedin_posts" USING "btree" ("published_at");



CREATE UNIQUE INDEX "ux_linkedin_audience_unique" ON "public"."linkedin_audience_demographics" USING "btree" ("category", "label");



CREATE UNIQUE INDEX "ux_linkedin_daily_metrics_date" ON "public"."linkedin_daily_metrics" USING "btree" ("metric_date");



CREATE UNIQUE INDEX "ux_linkedin_followers_daily_date" ON "public"."linkedin_followers_daily" USING "btree" ("metric_date");



CREATE UNIQUE INDEX "ux_linkedin_posts_url" ON "public"."linkedin_posts" USING "btree" ("post_url");





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";








































































































































































GRANT ALL ON TABLE "public"."linkedin_audience_demographics" TO "anon";
GRANT ALL ON TABLE "public"."linkedin_audience_demographics" TO "authenticated";
GRANT ALL ON TABLE "public"."linkedin_audience_demographics" TO "service_role";



GRANT ALL ON TABLE "public"."linkedin_daily_metrics" TO "anon";
GRANT ALL ON TABLE "public"."linkedin_daily_metrics" TO "authenticated";
GRANT ALL ON TABLE "public"."linkedin_daily_metrics" TO "service_role";



GRANT ALL ON TABLE "public"."linkedin_followers_daily" TO "anon";
GRANT ALL ON TABLE "public"."linkedin_followers_daily" TO "authenticated";
GRANT ALL ON TABLE "public"."linkedin_followers_daily" TO "service_role";



GRANT ALL ON TABLE "public"."linkedin_posts" TO "anon";
GRANT ALL ON TABLE "public"."linkedin_posts" TO "authenticated";
GRANT ALL ON TABLE "public"."linkedin_posts" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































drop extension if exists "pg_net";

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'storage' AND p.proname = 'delete_prefix_hierarchy_trigger'
  ) THEN
    CREATE TRIGGER objects_delete_delete_prefix
      AFTER DELETE ON storage.objects
      FOR EACH ROW
      EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'storage' AND p.proname = 'objects_insert_prefix_trigger'
  ) THEN
    CREATE TRIGGER objects_insert_create_prefix
      BEFORE INSERT ON storage.objects
      FOR EACH ROW
      EXECUTE FUNCTION storage.objects_insert_prefix_trigger();
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'storage' AND p.proname = 'objects_update_prefix_trigger'
  ) THEN
    CREATE TRIGGER objects_update_create_prefix
      BEFORE UPDATE ON storage.objects
      FOR EACH ROW
      WHEN ((new.name <> old.name) OR (new.bucket_id <> old.bucket_id))
      EXECUTE FUNCTION storage.objects_update_prefix_trigger();
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'storage' AND p.proname = 'prefixes_insert_trigger'
  ) THEN
    CREATE TRIGGER prefixes_create_hierarchy
      BEFORE INSERT ON storage.prefixes
      FOR EACH ROW
      WHEN ((pg_trigger_depth() < 1))
      EXECUTE FUNCTION storage.prefixes_insert_trigger();
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'storage' AND p.proname = 'delete_prefix_hierarchy_trigger'
  ) THEN
    CREATE TRIGGER prefixes_delete_hierarchy
      AFTER DELETE ON storage.prefixes
      FOR EACH ROW
      EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();
  END IF;
END $$;


