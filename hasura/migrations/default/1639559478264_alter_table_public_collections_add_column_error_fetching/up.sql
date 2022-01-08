alter table "public"."collections" add column "error_fetching" boolean
 not null default 'false';
