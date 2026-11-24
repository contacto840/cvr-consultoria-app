-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "public"."PropertyData" (
    "id" TEXT NOT NULL,
    "comuna" TEXT NOT NULL,
    "sector" TEXT NOT NULL DEFAULT '',
    "propertyType" TEXT NOT NULL,
    "avgPricePerM2" DOUBLE PRECISION NOT NULL,
    "minPricePerM2" DOUBLE PRECISION,
    "maxPricePerM2" DOUBLE PRECISION,
    "referenceYear" INTEGER NOT NULL DEFAULT 2025,
    "sampleSize" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PropertyListing" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "propertyType" TEXT NOT NULL,
    "transactionType" TEXT NOT NULL DEFAULT 'venta',
    "comuna" TEXT NOT NULL,
    "sector" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    "surface" DOUBLE PRECISION NOT NULL,
    "terrainSurface" DOUBLE PRECISION,
    "bedrooms" INTEGER,
    "bathrooms" INTEGER,
    "parkingSpaces" INTEGER,
    "priceUF" DOUBLE PRECISION NOT NULL,
    "priceNegotiable" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'disponible',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "contactName" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL DEFAULT '',
    "features" TEXT NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TasacionRequest" (
    "id" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientEmail" TEXT NOT NULL,
    "clientPhone" TEXT NOT NULL,
    "comuna" TEXT NOT NULL,
    "sector" TEXT NOT NULL DEFAULT '',
    "propertyType" TEXT NOT NULL,
    "surface" DOUBLE PRECISION NOT NULL,
    "condition" TEXT NOT NULL DEFAULT 'normal',
    "estimatedValueUF" DOUBLE PRECISION NOT NULL,
    "estimatedValueCLP" DOUBLE PRECISION NOT NULL,
    "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
    "paymentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TasacionRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PropertyData_comuna_sector_propertyType_key" ON "public"."PropertyData"("comuna" ASC, "sector" ASC, "propertyType" ASC);
