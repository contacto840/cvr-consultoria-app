import "dotenv/config";
import { PrismaClient } from "@prisma/client/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { SEED_DATA } from "../src/lib/seed-data";

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Iniciando seed de base de datos CVR...");

  let upserted = 0;
  let errors = 0;

  for (const item of SEED_DATA) {
    try {
      await prisma.propertyData.upsert({
        where: {
          comuna_sector_propertyType: {
            comuna: item.comuna,
            sector: item.sector,
            propertyType: item.propertyType,
          },
        },
        update: {
          avgPricePerM2: item.avgPricePerM2,
          minPricePerM2: item.minPricePerM2,
          maxPricePerM2: item.maxPricePerM2,
          sampleSize: item.sampleSize,
          referenceYear: 2025,
        },
        create: {
          comuna: item.comuna,
          sector: item.sector,
          propertyType: item.propertyType,
          avgPricePerM2: item.avgPricePerM2,
          minPricePerM2: item.minPricePerM2,
          maxPricePerM2: item.maxPricePerM2,
          sampleSize: item.sampleSize,
          referenceYear: 2025,
        },
      });
      upserted++;
    } catch (err) {
      console.error(`❌ Error en ${item.comuna}/${item.sector}/${item.propertyType}:`, err);
      errors++;
    }
  }

  const total = await prisma.propertyData.count();
  console.log(`✅ Seed completado: ${upserted} registros upserted, ${errors} errores`);
  console.log(`📊 Total registros en PropertyData: ${total}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); pool.end(); });
