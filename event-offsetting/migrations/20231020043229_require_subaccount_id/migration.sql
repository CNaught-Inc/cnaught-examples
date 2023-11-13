/*
  Warnings:

  - Made the column `cnaught_subaccount_id` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "cnaught_subaccount_id" SET NOT NULL;
