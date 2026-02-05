DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'linkedin_daily_metrics'
          AND column_name = 'engagements'
    ) THEN
        ALTER TABLE "public"."linkedin_daily_metrics" ADD COLUMN "engagements" INTEGER;
    END IF;
END $$;