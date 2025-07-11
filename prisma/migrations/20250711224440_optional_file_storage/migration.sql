-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_storageId_fkey";

-- AlterTable
ALTER TABLE "File" ALTER COLUMN "storageId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_storageId_fkey" FOREIGN KEY ("storageId") REFERENCES "Storage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
