/*
  Warnings:

  - You are about to drop the column `dob` on the `PatientProfile` table. All the data in the column will be lost.
  - Added the required column `fullName` to the `DoctorProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `DoctorProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `DoctorProfile` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- AlterTable
ALTER TABLE "DoctorProfile" ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "gender" "Gender" NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PatientProfile" DROP COLUMN "dob",
ADD COLUMN     "bloodGroup" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "emergencyContact" TEXT,
ADD COLUMN     "fullName" TEXT,
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "phoneNumber" TEXT,
ALTER COLUMN "address" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarUrl" TEXT;
