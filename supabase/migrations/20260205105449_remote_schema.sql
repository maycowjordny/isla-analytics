
  create table "public"."uploads" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" text not null,
    "file_path" text not null,
    "status" text not null default 'uploaded'::text,
    "week_start" text,
    "week_end" text,
    "error_message" text,
    "created_at" timestamp with time zone not null default now()
      );


CREATE INDEX idx_uploads_user_id ON public.uploads USING btree (user_id);

CREATE UNIQUE INDEX uploads_pkey ON public.uploads USING btree (id);

alter table "public"."uploads" add constraint "uploads_pkey" PRIMARY KEY using index "uploads_pkey";

alter table "public"."uploads" add constraint "uploads_status_check" CHECK ((status = ANY (ARRAY['uploaded'::text, 'processing'::text, 'ready'::text, 'failed'::text]))) not valid;

alter table "public"."uploads" validate constraint "uploads_status_check";

grant delete on table "public"."uploads" to "anon";

grant insert on table "public"."uploads" to "anon";

grant references on table "public"."uploads" to "anon";

grant select on table "public"."uploads" to "anon";

grant trigger on table "public"."uploads" to "anon";

grant truncate on table "public"."uploads" to "anon";

grant update on table "public"."uploads" to "anon";

grant delete on table "public"."uploads" to "authenticated";

grant insert on table "public"."uploads" to "authenticated";

grant references on table "public"."uploads" to "authenticated";

grant select on table "public"."uploads" to "authenticated";

grant trigger on table "public"."uploads" to "authenticated";

grant truncate on table "public"."uploads" to "authenticated";

grant update on table "public"."uploads" to "authenticated";

grant delete on table "public"."uploads" to "service_role";

grant insert on table "public"."uploads" to "service_role";

grant references on table "public"."uploads" to "service_role";

grant select on table "public"."uploads" to "service_role";

grant trigger on table "public"."uploads" to "service_role";

grant truncate on table "public"."uploads" to "service_role";

grant update on table "public"."uploads" to "service_role";


