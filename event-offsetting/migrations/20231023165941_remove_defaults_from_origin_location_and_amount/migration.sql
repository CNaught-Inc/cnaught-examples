-- AlterTable
ALTER TABLE "users" ALTER COLUMN "amount_kg" DROP DEFAULT,
ALTER COLUMN "origin_city" DROP DEFAULT,
ALTER COLUMN "origin_latitude" DROP DEFAULT,
ALTER COLUMN "origin_longitude" DROP DEFAULT,
ALTER COLUMN "origin_state" DROP DEFAULT,
ALTER COLUMN "travel_method" DROP DEFAULT;
