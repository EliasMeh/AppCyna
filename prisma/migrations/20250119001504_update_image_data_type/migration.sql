-- Add a new column with the desired type
ALTER TABLE "Image" ADD COLUMN "data_new" BYTEA;

-- Copy data from the old column to the new column, casting it to BYTEA
UPDATE "Image" SET "data_new" = "data"::BYTEA;

-- Drop the old column
ALTER TABLE "Image" DROP COLUMN "data";

-- Rename the new column to the original column name
ALTER TABLE "Image" RENAME COLUMN "data_new" TO "data";