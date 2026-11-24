-- AlterTable
ALTER TABLE "TasacionRequest" ADD COLUMN     "ufDate" TIMESTAMP(3),
ADD COLUMN     "ufValueCLP" DOUBLE PRECISION,
ALTER COLUMN "estimatedValueCLP" DROP NOT NULL;
