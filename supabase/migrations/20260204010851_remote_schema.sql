alter table "public"."linkedin_daily_metrics" drop column "engagements";

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


