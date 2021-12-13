alter table "public"."collections" drop constraint "collections_pkey";
alter table "public"."collections"
    add constraint "collections_pkey"
    primary key ("id");
