BEGIN TRANSACTION;
ALTER TABLE "public"."collections" DROP CONSTRAINT "collections_pkey";

ALTER TABLE "public"."collections"
    ADD CONSTRAINT "collections_pkey" PRIMARY KEY ("contract_address");
COMMIT TRANSACTION;
