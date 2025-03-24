-- CreateEnum
CREATE TYPE "ImageType" AS ENUM ('JPEG', 'PNG', 'WEBP', 'GIF', 'SVG');

-- AlterTable
ALTER TABLE "CarouselImage" ADD COLUMN     "contentType" "ImageType" NOT NULL DEFAULT 'JPEG';
