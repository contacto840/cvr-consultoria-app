import sqlite3
import datetime
import uuid

db_path = "prisma/dev.db"

data = [
    ("Bulnes", "casa", 25),
    ("Bulnes", "departamento", 30),
    ("Chillán", "casa", 45),
    ("Chillán", "departamento", 55),
    ("Chillán", "terreno", 15),
    ("Chillán Viejo", "casa", 38),
    ("Chillán Viejo", "departamento", 42),
    ("Cobquecura", "casa", 40),
    ("Cobquecura", "terreno", 20),
    ("Coelemu", "casa", 22),
    ("Coihueco", "casa", 28),
    ("Coihueco", "terreno", 12),
    ("El Carmen", "casa", 20),
    ("Ninhue", "casa", 18),
    ("Ñiquén", "casa", 19),
    ("Pemuco", "casa", 18),
    ("Pinto", "casa", 35),
    ("Pinto", "terreno", 18),
    ("Portezuelo", "casa", 19),
    ("Quillón", "casa", 32),
    ("Quillón", "terreno", 15),
    ("Quirihue", "casa", 24),
    ("Ránquil", "casa", 21),
    ("San Carlos", "casa", 35),
    ("San Carlos", "departamento", 40),
    ("San Fabián", "casa", 26),
    ("San Fabián", "terreno", 14),
    ("San Ignacio", "casa", 20),
    ("San Nicolás", "casa", 22),
    ("Treguaco", "casa", 18),
    ("Yungay", "casa", 23)
]

def seed():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Enable dict results
    conn.row_factory = sqlite3.Row
    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    
    for comuna, ptype, price in data:
        cursor.execute("SELECT id FROM PropertyData WHERE comuna = ? AND propertyType = ?", (comuna, ptype))
        row = cursor.fetchone()
        
        if row:
            cursor.execute("""
                UPDATE PropertyData 
                SET avgPricePerM2 = ?, referenceYear = 2025, updatedAt = ?
                WHERE id = ?
            """, (price, now, row['id']))
        else:
            new_id = "c" + uuid.uuid4().hex[:23]
            cursor.execute("""
                INSERT INTO PropertyData (id, comuna, propertyType, avgPricePerM2, minPricePerM2, maxPricePerM2, referenceYear, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, NULL, NULL, 2025, ?, ?)
            """, (new_id, comuna, ptype, price, now, now))
    
    conn.commit()
    conn.close()
    print("Seed complete via Python!")

if __name__ == "__main__":
    seed()
