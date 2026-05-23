import Database from "better-sqlite3";
import crypto from "crypto";

const db = new Database("dev.db");

const data = [
  { comuna: "Bulnes", propertyType: "casa", avgPricePerM2: 25 },
  { comuna: "Bulnes", propertyType: "departamento", avgPricePerM2: 30 },
  { comuna: "Chillán", propertyType: "casa", avgPricePerM2: 45 },
  { comuna: "Chillán", propertyType: "departamento", avgPricePerM2: 55 },
  { comuna: "Chillán", propertyType: "terreno", avgPricePerM2: 15 },
  { comuna: "Chillán Viejo", propertyType: "casa", avgPricePerM2: 38 },
  { comuna: "Chillán Viejo", propertyType: "departamento", avgPricePerM2: 42 },
  { comuna: "Cobquecura", propertyType: "casa", avgPricePerM2: 40 },
  { comuna: "Cobquecura", propertyType: "terreno", avgPricePerM2: 20 },
  { comuna: "Coelemu", propertyType: "casa", avgPricePerM2: 22 },
  { comuna: "Coihueco", propertyType: "casa", avgPricePerM2: 28 },
  { comuna: "Coihueco", propertyType: "terreno", avgPricePerM2: 12 },
  { comuna: "El Carmen", propertyType: "casa", avgPricePerM2: 20 },
  { comuna: "Ninhue", propertyType: "casa", avgPricePerM2: 18 },
  { comuna: "Ñiquén", propertyType: "casa", avgPricePerM2: 19 },
  { comuna: "Pemuco", propertyType: "casa", avgPricePerM2: 18 },
  { comuna: "Pinto", propertyType: "casa", avgPricePerM2: 35 },
  { comuna: "Pinto", propertyType: "terreno", avgPricePerM2: 18 },
  { comuna: "Portezuelo", propertyType: "casa", avgPricePerM2: 19 },
  { comuna: "Quillón", propertyType: "casa", avgPricePerM2: 32 },
  { comuna: "Quillón", propertyType: "terreno", avgPricePerM2: 15 },
  { comuna: "Quirihue", propertyType: "casa", avgPricePerM2: 24 },
  { comuna: "Ránquil", propertyType: "casa", avgPricePerM2: 21 },
  { comuna: "San Carlos", "propertyType": "casa", avgPricePerM2: 35 },
  { comuna: "San Carlos", propertyType: "departamento", avgPricePerM2: 40 },
  { comuna: "San Fabián", propertyType: "casa", avgPricePerM2: 26 },
  { comuna: "San Fabián", propertyType: "terreno", avgPricePerM2: 14 },
  { comuna: "San Ignacio", propertyType: "casa", avgPricePerM2: 20 },
  { comuna: "San Nicolás", propertyType: "casa", avgPricePerM2: 22 },
  { comuna: "Treguaco", propertyType: "casa", avgPricePerM2: 18 },
  { comuna: "Yungay", propertyType: "casa", avgPricePerM2: 23 }
];

const checkStmt = db.prepare("SELECT id FROM PropertyData WHERE comuna = ? AND propertyType = ?");
const updateStmt = db.prepare(`
  UPDATE PropertyData 
  SET avgPricePerM2 = ?, referenceYear = 2025, updatedAt = (datetime('now'))
  WHERE id = ?
`);
const insertStmt = db.prepare(`
  INSERT INTO PropertyData (id, comuna, propertyType, avgPricePerM2, minPricePerM2, maxPricePerM2, referenceYear, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, NULL, NULL, 2025, (datetime('now')), (datetime('now')))
`);

const insertMany = db.transaction((items) => {
  for (const item of items) {
    const existing = checkStmt.get(item.comuna, item.propertyType);
    if (existing) {
      updateStmt.run(item.avgPricePerM2, existing.id);
    } else {
      const newId = "c" + crypto.randomUUID().replace(/-/g, "").substring(0, 23);
      insertStmt.run(newId, item.comuna, item.propertyType, item.avgPricePerM2);
    }
  }
});

insertMany(data);
console.log("Database seeded successfully via better-sqlite3!");
