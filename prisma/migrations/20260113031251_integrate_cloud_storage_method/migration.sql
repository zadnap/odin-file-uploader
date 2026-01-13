/*
  Warnings:

  - You are about to drop the column `path` on the `files` table. All the data in the column will be lost.
  - Added the required column `public_id` to the `files` table without a default value. This is not possible if the table is not empty.
  - Made the column `url` on table `files` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "files" DROP COLUMN "path",
ADD COLUMN     "public_id" TEXT NOT NULL,
ALTER COLUMN "url" SET NOT NULL;
