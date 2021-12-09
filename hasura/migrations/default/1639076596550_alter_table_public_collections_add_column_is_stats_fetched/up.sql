alter table "public"."collections" add column "is_stats_fetched" boolean
 not null default 'false';
