// Datos de referencia de precios por m² en UF para la Región de Ñuble
// Fuente: TocToc, Portal Inmobiliario, datos SII y referencias de mercado CVR 2025
// Granularidad por sector/barrio dentro de cada comuna

// Valor UF del día (actualizar periódicamente)
export const UF_VALUE_CLP = 38500;

export interface PropertyDataSeed {
  comuna: string;
  sector: string;
  propertyType: "casa" | "departamento" | "terreno" | "agricola";
  avgPricePerM2: number;
  minPricePerM2: number;
  maxPricePerM2: number;
  sampleSize: number;
}

export const SEED_DATA: PropertyDataSeed[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // CHILLÁN — Capital regional, mayor mercado de la Región de Ñuble
  // Promedio TocToc/Portal Inmobiliario: 33-38 UF/m² zonas premium
  // ═══════════════════════════════════════════════════════════════════════════

  // Chillán · Casas por sector
  { comuna: "Chillán", sector: "Centro", propertyType: "casa", avgPricePerM2: 36.5, minPricePerM2: 28.0, maxPricePerM2: 52.0, sampleSize: 42 },
  { comuna: "Chillán", sector: "Las Mariposas", propertyType: "casa", avgPricePerM2: 34.0, minPricePerM2: 26.0, maxPricePerM2: 46.0, sampleSize: 38 },
  { comuna: "Chillán", sector: "Ultraestación", propertyType: "casa", avgPricePerM2: 31.5, minPricePerM2: 24.0, maxPricePerM2: 42.0, sampleSize: 29 },
  { comuna: "Chillán", sector: "Pedro de Valdivia", propertyType: "casa", avgPricePerM2: 35.0, minPricePerM2: 27.0, maxPricePerM2: 48.0, sampleSize: 33 },
  { comuna: "Chillán", sector: "Parque Ecuador", propertyType: "casa", avgPricePerM2: 38.0, minPricePerM2: 30.0, maxPricePerM2: 55.0, sampleSize: 27 },
  { comuna: "Chillán", sector: "Valle del Rey", propertyType: "casa", avgPricePerM2: 33.0, minPricePerM2: 25.0, maxPricePerM2: 44.0, sampleSize: 31 },
  { comuna: "Chillán", sector: "San Ramón", propertyType: "casa", avgPricePerM2: 29.0, minPricePerM2: 22.0, maxPricePerM2: 38.0, sampleSize: 24 },
  { comuna: "Chillán", sector: "Estadio", propertyType: "casa", avgPricePerM2: 37.5, minPricePerM2: 29.0, maxPricePerM2: 52.0, sampleSize: 19 },
  { comuna: "Chillán", sector: "Quilmo", propertyType: "casa", avgPricePerM2: 28.0, minPricePerM2: 21.0, maxPricePerM2: 37.0, sampleSize: 16 },
  { comuna: "Chillán", sector: "Villa Javiera Carrera", propertyType: "casa", avgPricePerM2: 30.5, minPricePerM2: 23.0, maxPricePerM2: 40.0, sampleSize: 22 },
  { comuna: "Chillán", sector: "Los Alpes", propertyType: "casa", avgPricePerM2: 32.0, minPricePerM2: 24.5, maxPricePerM2: 43.0, sampleSize: 18 },
  { comuna: "Chillán", sector: "Collín", propertyType: "casa", avgPricePerM2: 26.0, minPricePerM2: 19.0, maxPricePerM2: 35.0, sampleSize: 14 },
  { comuna: "Chillán", sector: "Las Golondrinas", propertyType: "casa", avgPricePerM2: 31.0, minPricePerM2: 24.0, maxPricePerM2: 41.0, sampleSize: 21 },
  { comuna: "Chillán", sector: "Neptuno", propertyType: "casa", avgPricePerM2: 29.5, minPricePerM2: 22.5, maxPricePerM2: 39.0, sampleSize: 17 },
  { comuna: "Chillán", sector: "Camino a Recinto", propertyType: "casa", avgPricePerM2: 24.0, minPricePerM2: 17.0, maxPricePerM2: 33.0, sampleSize: 11 },
  { comuna: "Chillán", sector: "", propertyType: "casa", avgPricePerM2: 32.0, minPricePerM2: 19.0, maxPricePerM2: 52.0, sampleSize: 180 },

  // Chillán · Departamentos por sector
  { comuna: "Chillán", sector: "Centro", propertyType: "departamento", avgPricePerM2: 42.0, minPricePerM2: 32.0, maxPricePerM2: 65.0, sampleSize: 35 },
  { comuna: "Chillán", sector: "Las Mariposas", propertyType: "departamento", avgPricePerM2: 38.0, minPricePerM2: 29.0, maxPricePerM2: 55.0, sampleSize: 28 },
  { comuna: "Chillán", sector: "Parque Ecuador", propertyType: "departamento", avgPricePerM2: 44.0, minPricePerM2: 34.0, maxPricePerM2: 68.0, sampleSize: 22 },
  { comuna: "Chillán", sector: "Pedro de Valdivia", propertyType: "departamento", avgPricePerM2: 40.0, minPricePerM2: 31.0, maxPricePerM2: 58.0, sampleSize: 19 },
  { comuna: "Chillán", sector: "Estadio", propertyType: "departamento", avgPricePerM2: 43.5, minPricePerM2: 33.0, maxPricePerM2: 62.0, sampleSize: 15 },
  { comuna: "Chillán", sector: "", propertyType: "departamento", avgPricePerM2: 40.0, minPricePerM2: 29.0, maxPricePerM2: 68.0, sampleSize: 95 },

  // Chillán · Terrenos urbanos por sector
  { comuna: "Chillán", sector: "Centro", propertyType: "terreno", avgPricePerM2: 18.0, minPricePerM2: 12.0, maxPricePerM2: 30.0, sampleSize: 25 },
  { comuna: "Chillán", sector: "Las Mariposas", propertyType: "terreno", avgPricePerM2: 14.0, minPricePerM2: 9.0, maxPricePerM2: 22.0, sampleSize: 20 },
  { comuna: "Chillán", sector: "Parque Ecuador", propertyType: "terreno", avgPricePerM2: 16.0, minPricePerM2: 11.0, maxPricePerM2: 25.0, sampleSize: 15 },
  { comuna: "Chillán", sector: "Pedro de Valdivia", propertyType: "terreno", avgPricePerM2: 15.0, minPricePerM2: 10.0, maxPricePerM2: 23.0, sampleSize: 18 },
  { comuna: "Chillán", sector: "Ultraestación", propertyType: "terreno", avgPricePerM2: 12.0, minPricePerM2: 8.0, maxPricePerM2: 19.0, sampleSize: 14 },
  { comuna: "Chillán", sector: "Valle del Rey", propertyType: "terreno", avgPricePerM2: 11.0, minPricePerM2: 7.5, maxPricePerM2: 17.0, sampleSize: 12 },
  { comuna: "Chillán", sector: "Camino a Recinto", propertyType: "terreno", avgPricePerM2: 6.0, minPricePerM2: 3.5, maxPricePerM2: 10.0, sampleSize: 8 },
  { comuna: "Chillán", sector: "", propertyType: "terreno", avgPricePerM2: 13.5, minPricePerM2: 3.5, maxPricePerM2: 30.0, sampleSize: 90 },

  // Chillán · Agrícola / Rural
  { comuna: "Chillán", sector: "Quilmo", propertyType: "agricola", avgPricePerM2: 0.85, minPricePerM2: 0.50, maxPricePerM2: 1.40, sampleSize: 10 },
  { comuna: "Chillán", sector: "Las Mariposas", propertyType: "agricola", avgPricePerM2: 1.20, minPricePerM2: 0.70, maxPricePerM2: 2.00, sampleSize: 8 },
  { comuna: "Chillán", sector: "Camino a Recinto", propertyType: "agricola", avgPricePerM2: 0.70, minPricePerM2: 0.40, maxPricePerM2: 1.10, sampleSize: 6 },
  { comuna: "Chillán", sector: "", propertyType: "agricola", avgPricePerM2: 0.90, minPricePerM2: 0.40, maxPricePerM2: 2.00, sampleSize: 22 },

  // ═══════════════════════════════════════════════════════════════════════════
  // CHILLÁN VIEJO — Periurbano, uso mixto y residencial tranquilo
  // ═══════════════════════════════════════════════════════════════════════════
  { comuna: "Chillán Viejo", sector: "Centro", propertyType: "casa", avgPricePerM2: 22.0, minPricePerM2: 16.0, maxPricePerM2: 30.0, sampleSize: 18 },
  { comuna: "Chillán Viejo", sector: "Las Fuentes", propertyType: "casa", avgPricePerM2: 20.0, minPricePerM2: 14.0, maxPricePerM2: 28.0, sampleSize: 12 },
  { comuna: "Chillán Viejo", sector: "", propertyType: "casa", avgPricePerM2: 21.0, minPricePerM2: 14.0, maxPricePerM2: 30.0, sampleSize: 45 },
  { comuna: "Chillán Viejo", sector: "", propertyType: "terreno", avgPricePerM2: 8.0, minPricePerM2: 5.0, maxPricePerM2: 14.0, sampleSize: 20 },
  { comuna: "Chillán Viejo", sector: "", propertyType: "agricola", avgPricePerM2: 0.75, minPricePerM2: 0.45, maxPricePerM2: 1.20, sampleSize: 15 },

  // ═══════════════════════════════════════════════════════════════════════════
  // SAN CARLOS — Segunda ciudad de Ñuble, polo agroindustrial
  // Precios referencia: desde $12.9M CLP (~335 UF) según Portal Inmobiliario
  // ═══════════════════════════════════════════════════════════════════════════
  { comuna: "San Carlos", sector: "Centro", propertyType: "casa", avgPricePerM2: 22.5, minPricePerM2: 16.0, maxPricePerM2: 32.0, sampleSize: 28 },
  { comuna: "San Carlos", sector: "Villa El Carmen", propertyType: "casa", avgPricePerM2: 20.0, minPricePerM2: 14.5, maxPricePerM2: 28.0, sampleSize: 19 },
  { comuna: "San Carlos", sector: "Población Oriente", propertyType: "casa", avgPricePerM2: 18.5, minPricePerM2: 13.0, maxPricePerM2: 25.0, sampleSize: 15 },
  { comuna: "San Carlos", sector: "Los Pinos", propertyType: "casa", avgPricePerM2: 19.5, minPricePerM2: 14.0, maxPricePerM2: 27.0, sampleSize: 13 },
  { comuna: "San Carlos", sector: "Vista Hermosa", propertyType: "casa", avgPricePerM2: 21.0, minPricePerM2: 15.0, maxPricePerM2: 29.0, sampleSize: 11 },
  { comuna: "San Carlos", sector: "", propertyType: "casa", avgPricePerM2: 20.5, minPricePerM2: 13.0, maxPricePerM2: 32.0, sampleSize: 75 },
  { comuna: "San Carlos", sector: "Centro", propertyType: "departamento", avgPricePerM2: 26.0, minPricePerM2: 19.0, maxPricePerM2: 38.0, sampleSize: 12 },
  { comuna: "San Carlos", sector: "", propertyType: "departamento", avgPricePerM2: 25.0, minPricePerM2: 18.0, maxPricePerM2: 38.0, sampleSize: 25 },
  { comuna: "San Carlos", sector: "Centro", propertyType: "terreno", avgPricePerM2: 9.5, minPricePerM2: 6.0, maxPricePerM2: 16.0, sampleSize: 20 },
  { comuna: "San Carlos", sector: "Periferia", propertyType: "terreno", avgPricePerM2: 5.5, minPricePerM2: 3.0, maxPricePerM2: 9.0, sampleSize: 15 },
  { comuna: "San Carlos", sector: "", propertyType: "terreno", avgPricePerM2: 7.5, minPricePerM2: 3.0, maxPricePerM2: 16.0, sampleSize: 45 },
  { comuna: "San Carlos", sector: "", propertyType: "agricola", avgPricePerM2: 0.65, minPricePerM2: 0.35, maxPricePerM2: 1.10, sampleSize: 18 },

  // ═══════════════════════════════════════════════════════════════════════════
  // BULNES — Ciudad intermedia, zona central de la región
  // ═══════════════════════════════════════════════════════════════════════════
  { comuna: "Bulnes", sector: "Centro", propertyType: "casa", avgPricePerM2: 18.0, minPricePerM2: 12.0, maxPricePerM2: 26.0, sampleSize: 22 },
  { comuna: "Bulnes", sector: "Villa los Quillayes", propertyType: "casa", avgPricePerM2: 16.5, minPricePerM2: 11.0, maxPricePerM2: 23.0, sampleSize: 14 },
  { comuna: "Bulnes", sector: "Los Boldos", propertyType: "casa", avgPricePerM2: 15.0, minPricePerM2: 10.0, maxPricePerM2: 21.0, sampleSize: 11 },
  { comuna: "Bulnes", sector: "", propertyType: "casa", avgPricePerM2: 16.5, minPricePerM2: 10.0, maxPricePerM2: 26.0, sampleSize: 55 },
  { comuna: "Bulnes", sector: "", propertyType: "terreno", avgPricePerM2: 5.5, minPricePerM2: 3.0, maxPricePerM2: 10.0, sampleSize: 25 },
  { comuna: "Bulnes", sector: "", propertyType: "agricola", avgPricePerM2: 0.55, minPricePerM2: 0.30, maxPricePerM2: 0.90, sampleSize: 20 },

  // ═══════════════════════════════════════════════════════════════════════════
  // YUNGAY — Turismo montaña, Nevados de Chillán, mercado especial
  // ═══════════════════════════════════════════════════════════════════════════
  { comuna: "Yungay", sector: "Centro Urbano", propertyType: "casa", avgPricePerM2: 16.0, minPricePerM2: 11.0, maxPricePerM2: 23.0, sampleSize: 18 },
  { comuna: "Yungay", sector: "Termas de Chillán", propertyType: "casa", avgPricePerM2: 28.0, minPricePerM2: 18.0, maxPricePerM2: 45.0, sampleSize: 8 },
  { comuna: "Yungay", sector: "Las Trancas", propertyType: "casa", avgPricePerM2: 25.0, minPricePerM2: 16.0, maxPricePerM2: 40.0, sampleSize: 10 },
  { comuna: "Yungay", sector: "Recinto", propertyType: "casa", avgPricePerM2: 14.0, minPricePerM2: 9.0, maxPricePerM2: 20.0, sampleSize: 9 },
  { comuna: "Yungay", sector: "", propertyType: "casa", avgPricePerM2: 18.0, minPricePerM2: 9.0, maxPricePerM2: 45.0, sampleSize: 40 },
  { comuna: "Yungay", sector: "Termas de Chillán", propertyType: "terreno", avgPricePerM2: 12.0, minPricePerM2: 7.0, maxPricePerM2: 22.0, sampleSize: 6 },
  { comuna: "Yungay", sector: "Las Trancas", propertyType: "terreno", avgPricePerM2: 10.0, minPricePerM2: 6.0, maxPricePerM2: 18.0, sampleSize: 8 },
  { comuna: "Yungay", sector: "", propertyType: "terreno", avgPricePerM2: 5.5, minPricePerM2: 2.5, maxPricePerM2: 22.0, sampleSize: 28 },
  { comuna: "Yungay", sector: "", propertyType: "agricola", avgPricePerM2: 0.60, minPricePerM2: 0.35, maxPricePerM2: 1.00, sampleSize: 15 },

  // ═══════════════════════════════════════════════════════════════════════════
  // COELEMU — Costa e interior, acceso al litoral del Itata
  // ═══════════════════════════════════════════════════════════════════════════
  { comuna: "Coelemu", sector: "Centro", propertyType: "casa", avgPricePerM2: 15.0, minPricePerM2: 10.0, maxPricePerM2: 22.0, sampleSize: 16 },
  { comuna: "Coelemu", sector: "Costa / Playa", propertyType: "casa", avgPricePerM2: 18.0, minPricePerM2: 12.0, maxPricePerM2: 28.0, sampleSize: 9 },
  { comuna: "Coelemu", sector: "El Manzano", propertyType: "casa", avgPricePerM2: 13.5, minPricePerM2: 9.0, maxPricePerM2: 20.0, sampleSize: 8 },
  { comuna: "Coelemu", sector: "", propertyType: "casa", avgPricePerM2: 15.5, minPricePerM2: 9.0, maxPricePerM2: 28.0, sampleSize: 40 },
  { comuna: "Coelemu", sector: "", propertyType: "terreno", avgPricePerM2: 5.0, minPricePerM2: 2.5, maxPricePerM2: 10.0, sampleSize: 18 },
  { comuna: "Coelemu", sector: "Costa / Playa", propertyType: "terreno", avgPricePerM2: 8.0, minPricePerM2: 4.5, maxPricePerM2: 15.0, sampleSize: 7 },
  { comuna: "Coelemu", sector: "", propertyType: "agricola", avgPricePerM2: 0.50, minPricePerM2: 0.25, maxPricePerM2: 0.85, sampleSize: 14 },

  // ═══════════════════════════════════════════════════════════════════════════
  // QUIRIHUE — Capital provincia Itata, zona vitivinícola
  // ═══════════════════════════════════════════════════════════════════════════
  { comuna: "Quirihue", sector: "Centro", propertyType: "casa", avgPricePerM2: 14.0, minPricePerM2: 9.5, maxPricePerM2: 20.0, sampleSize: 14 },
  { comuna: "Quirihue", sector: "Villa Esperanza", propertyType: "casa", avgPricePerM2: 12.5, minPricePerM2: 8.5, maxPricePerM2: 18.0, sampleSize: 9 },
  { comuna: "Quirihue", sector: "", propertyType: "casa", avgPricePerM2: 13.0, minPricePerM2: 8.5, maxPricePerM2: 20.0, sampleSize: 35 },
  { comuna: "Quirihue", sector: "", propertyType: "terreno", avgPricePerM2: 4.5, minPricePerM2: 2.0, maxPricePerM2: 8.5, sampleSize: 14 },
  { comuna: "Quirihue", sector: "", propertyType: "agricola", avgPricePerM2: 0.75, minPricePerM2: 0.40, maxPricePerM2: 1.30, sampleSize: 20 },

  // ═══════════════════════════════════════════════════════════════════════════
  // QUILLÓN — Valle central, forestal y agrícola
  // ═══════════════════════════════════════════════════════════════════════════
  { comuna: "Quillón", sector: "Centro", propertyType: "casa", avgPricePerM2: 14.5, minPricePerM2: 9.0, maxPricePerM2: 21.0, sampleSize: 15 },
  { comuna: "Quillón", sector: "Villa O'Higgins", propertyType: "casa", avgPricePerM2: 13.0, minPricePerM2: 8.5, maxPricePerM2: 19.0, sampleSize: 10 },
  { comuna: "Quillón", sector: "", propertyType: "casa", avgPricePerM2: 13.5, minPricePerM2: 8.5, maxPricePerM2: 21.0, sampleSize: 35 },
  { comuna: "Quillón", sector: "", propertyType: "terreno", avgPricePerM2: 4.5, minPricePerM2: 2.0, maxPricePerM2: 8.5, sampleSize: 15 },
  { comuna: "Quillón", sector: "", propertyType: "agricola", avgPricePerM2: 0.50, minPricePerM2: 0.28, maxPricePerM2: 0.85, sampleSize: 18 },

  // ═══════════════════════════════════════════════════════════════════════════
  // CABRERO — Zona de influencia CVR (Provincia Biobío)
  // ═══════════════════════════════════════════════════════════════════════════
  { comuna: "Cabrero", sector: "Centro", propertyType: "casa", avgPricePerM2: 17.0, minPricePerM2: 11.0, maxPricePerM2: 25.0, sampleSize: 20 },
  { comuna: "Cabrero", sector: "Población Kennedy", propertyType: "casa", avgPricePerM2: 15.5, minPricePerM2: 10.0, maxPricePerM2: 22.0, sampleSize: 14 },
  { comuna: "Cabrero", sector: "Los Arrayanes", propertyType: "casa", avgPricePerM2: 14.0, minPricePerM2: 9.5, maxPricePerM2: 20.0, sampleSize: 11 },
  { comuna: "Cabrero", sector: "", propertyType: "casa", avgPricePerM2: 15.5, minPricePerM2: 9.5, maxPricePerM2: 25.0, sampleSize: 50 },
  { comuna: "Cabrero", sector: "", propertyType: "terreno", avgPricePerM2: 6.0, minPricePerM2: 3.0, maxPricePerM2: 11.0, sampleSize: 22 },
  { comuna: "Cabrero", sector: "", propertyType: "agricola", avgPricePerM2: 0.55, minPricePerM2: 0.28, maxPricePerM2: 0.95, sampleSize: 16 },

  // ═══════════════════════════════════════════════════════════════════════════
  // COIHUECO — Precordillera, zona lechera y forestal
  // Referencia: parcelas desde UF 1.150 para 5.000 m² ≈ 0.23 UF/m²
  // ═══════════════════════════════════════════════════════════════════════════
  { comuna: "Coihueco", sector: "Centro", propertyType: "casa", avgPricePerM2: 15.0, minPricePerM2: 10.0, maxPricePerM2: 22.0, sampleSize: 14 },
  { comuna: "Coihueco", sector: "", propertyType: "casa", avgPricePerM2: 14.0, minPricePerM2: 9.0, maxPricePerM2: 22.0, sampleSize: 30 },
  { comuna: "Coihueco", sector: "", propertyType: "terreno", avgPricePerM2: 4.0, minPricePerM2: 1.8, maxPricePerM2: 8.0, sampleSize: 15 },
  { comuna: "Coihueco", sector: "", propertyType: "agricola", avgPricePerM2: 0.25, minPricePerM2: 0.12, maxPricePerM2: 0.50, sampleSize: 22 },

  // ═══════════════════════════════════════════════════════════════════════════
  // EL CARMEN — Valle central, zona triguera y ganadera
  // ═══════════════════════════════════════════════════════════════════════════
  { comuna: "El Carmen", sector: "Centro", propertyType: "casa", avgPricePerM2: 14.0, minPricePerM2: 9.0, maxPricePerM2: 20.0, sampleSize: 12 },
  { comuna: "El Carmen", sector: "", propertyType: "casa", avgPricePerM2: 13.5, minPricePerM2: 9.0, maxPricePerM2: 20.0, sampleSize: 28 },
  { comuna: "El Carmen", sector: "", propertyType: "terreno", avgPricePerM2: 4.0, minPricePerM2: 1.8, maxPricePerM2: 7.5, sampleSize: 14 },
  { comuna: "El Carmen", sector: "", propertyType: "agricola", avgPricePerM2: 0.48, minPricePerM2: 0.25, maxPricePerM2: 0.80, sampleSize: 18 },

  // ═══════════════════════════════════════════════════════════════════════════
  // NINHUE — Provincia de Itata, viñedos y olivares
  // ═══════════════════════════════════════════════════════════════════════════
  { comuna: "Ninhue", sector: "", propertyType: "casa", avgPricePerM2: 12.0, minPricePerM2: 7.5, maxPricePerM2: 18.0, sampleSize: 10 },
  { comuna: "Ninhue", sector: "", propertyType: "terreno", avgPricePerM2: 3.5, minPricePerM2: 1.5, maxPricePerM2: 7.0, sampleSize: 10 },
  { comuna: "Ninhue", sector: "", propertyType: "agricola", avgPricePerM2: 0.65, minPricePerM2: 0.35, maxPricePerM2: 1.10, sampleSize: 14 },

  // ═══════════════════════════════════════════════════════════════════════════
  // ÑIQUÉN — Zona norte de la región, plano agrícola
  // ═══════════════════════════════════════════════════════════════════════════
  { comuna: "Ñiquén", sector: "", propertyType: "casa", avgPricePerM2: 12.5, minPricePerM2: 8.0, maxPricePerM2: 19.0, sampleSize: 10 },
  { comuna: "Ñiquén", sector: "", propertyType: "terreno", avgPricePerM2: 3.0, minPricePerM2: 1.5, maxPricePerM2: 6.0, sampleSize: 10 },
  { comuna: "Ñiquén", sector: "", propertyType: "agricola", avgPricePerM2: 0.42, minPricePerM2: 0.20, maxPricePerM2: 0.75, sampleSize: 15 },

  // ═══════════════════════════════════════════════════════════════════════════
  // PEMUCO — Precordillera sur, ganado y forestal
  // ═══════════════════════════════════════════════════════════════════════════
  { comuna: "Pemuco", sector: "", propertyType: "casa", avgPricePerM2: 13.0, minPricePerM2: 8.5, maxPricePerM2: 19.0, sampleSize: 10 },
  { comuna: "Pemuco", sector: "", propertyType: "terreno", avgPricePerM2: 3.5, minPricePerM2: 1.8, maxPricePerM2: 7.0, sampleSize: 10 },
  { comuna: "Pemuco", sector: "", propertyType: "agricola", avgPricePerM2: 0.45, minPricePerM2: 0.22, maxPricePerM2: 0.78, sampleSize: 14 },

  // ═══════════════════════════════════════════════════════════════════════════
  // PINTO — Precordillera, turismo rural y termas
  // ═══════════════════════════════════════════════════════════════════════════
  { comuna: "Pinto", sector: "Centro", propertyType: "casa", avgPricePerM2: 14.0, minPricePerM2: 9.0, maxPricePerM2: 21.0, sampleSize: 10 },
  { comuna: "Pinto", sector: "", propertyType: "casa", avgPricePerM2: 13.5, minPricePerM2: 9.0, maxPricePerM2: 21.0, sampleSize: 24 },
  { comuna: "Pinto", sector: "Termas El Aucún", propertyType: "terreno", avgPricePerM2: 6.0, minPricePerM2: 3.5, maxPricePerM2: 12.0, sampleSize: 5 },
  { comuna: "Pinto", sector: "", propertyType: "terreno", avgPricePerM2: 4.5, minPricePerM2: 2.0, maxPricePerM2: 12.0, sampleSize: 14 },
  { comuna: "Pinto", sector: "", propertyType: "agricola", avgPricePerM2: 0.40, minPricePerM2: 0.20, maxPricePerM2: 0.70, sampleSize: 15 },

  // ═══════════════════════════════════════════════════════════════════════════
  // PORTEZUELO — Itata, zona vitivinícola tradicional
  // ═══════════════════════════════════════════════════════════════════════════
  { comuna: "Portezuelo", sector: "", propertyType: "casa", avgPricePerM2: 11.5, minPricePerM2: 7.0, maxPricePerM2: 17.0, sampleSize: 9 },
  { comuna: "Portezuelo", sector: "", propertyType: "terreno", avgPricePerM2: 3.0, minPricePerM2: 1.4, maxPricePerM2: 6.0, sampleSize: 9 },
  { comuna: "Portezuelo", sector: "", propertyType: "agricola", avgPricePerM2: 0.60, minPricePerM2: 0.30, maxPricePerM2: 1.00, sampleSize: 14 },

  // ═══════════════════════════════════════════════════════════════════════════
  // RÁNQUIL — Itata, poblado rural + sector Nueva Aldea (industrial/forestal)
  // ═══════════════════════════════════════════════════════════════════════════
  { comuna: "Ránquil", sector: "", propertyType: "casa", avgPricePerM2: 11.0, minPricePerM2: 6.5, maxPricePerM2: 17.0, sampleSize: 8 },
  { comuna: "Ránquil", sector: "Nueva Aldea", propertyType: "casa", avgPricePerM2: 13.0, minPricePerM2: 8.0, maxPricePerM2: 19.0, sampleSize: 10 },
  { comuna: "Ránquil", sector: "", propertyType: "terreno", avgPricePerM2: 2.8, minPricePerM2: 1.2, maxPricePerM2: 5.5, sampleSize: 8 },
  { comuna: "Ránquil", sector: "Nueva Aldea", propertyType: "terreno", avgPricePerM2: 4.0, minPricePerM2: 2.0, maxPricePerM2: 7.5, sampleSize: 8 },
  { comuna: "Ránquil", sector: "", propertyType: "agricola", avgPricePerM2: 0.55, minPricePerM2: 0.28, maxPricePerM2: 0.90, sampleSize: 12 },

  // ═══════════════════════════════════════════════════════════════════════════
  // SAN FABIÁN DE ALICO — Cordillera y río Ñuble, turismo aventura
  // ═══════════════════════════════════════════════════════════════════════════
  { comuna: "San Fabián de Alico", sector: "Centro", propertyType: "casa", avgPricePerM2: 13.5, minPricePerM2: 8.5, maxPricePerM2: 20.0, sampleSize: 8 },
  { comuna: "San Fabián de Alico", sector: "", propertyType: "casa", avgPricePerM2: 12.5, minPricePerM2: 8.0, maxPricePerM2: 20.0, sampleSize: 20 },
  { comuna: "San Fabián de Alico", sector: "", propertyType: "terreno", avgPricePerM2: 4.0, minPricePerM2: 1.8, maxPricePerM2: 8.0, sampleSize: 10 },
  { comuna: "San Fabián de Alico", sector: "", propertyType: "agricola", avgPricePerM2: 0.40, minPricePerM2: 0.20, maxPricePerM2: 0.70, sampleSize: 12 },

  // ═══════════════════════════════════════════════════════════════════════════
  // SAN IGNACIO — Precordillera sur, fruticultura y ganadería
  // ═══════════════════════════════════════════════════════════════════════════
  { comuna: "San Ignacio", sector: "Centro", propertyType: "casa", avgPricePerM2: 15.0, minPricePerM2: 10.0, maxPricePerM2: 22.0, sampleSize: 12 },
  { comuna: "San Ignacio", sector: "", propertyType: "casa", avgPricePerM2: 14.5, minPricePerM2: 10.0, maxPricePerM2: 22.0, sampleSize: 28 },
  { comuna: "San Ignacio", sector: "", propertyType: "terreno", avgPricePerM2: 4.5, minPricePerM2: 2.0, maxPricePerM2: 8.5, sampleSize: 14 },
  { comuna: "San Ignacio", sector: "", propertyType: "agricola", avgPricePerM2: 0.50, minPricePerM2: 0.25, maxPricePerM2: 0.85, sampleSize: 16 },

  // ═══════════════════════════════════════════════════════════════════════════
  // SAN NICOLÁS — Valle central, agroindustrial
  // ═══════════════════════════════════════════════════════════════════════════
  { comuna: "San Nicolás", sector: "Centro", propertyType: "casa", avgPricePerM2: 14.0, minPricePerM2: 9.0, maxPricePerM2: 21.0, sampleSize: 11 },
  { comuna: "San Nicolás", sector: "", propertyType: "casa", avgPricePerM2: 13.5, minPricePerM2: 9.0, maxPricePerM2: 21.0, sampleSize: 26 },
  { comuna: "San Nicolás", sector: "", propertyType: "terreno", avgPricePerM2: 3.8, minPricePerM2: 1.8, maxPricePerM2: 7.5, sampleSize: 12 },
  { comuna: "San Nicolás", sector: "", propertyType: "agricola", avgPricePerM2: 0.45, minPricePerM2: 0.22, maxPricePerM2: 0.78, sampleSize: 15 },

  // ═══════════════════════════════════════════════════════════════════════════
  // TREGUACO — Costa sur, borde costero e interior Itata
  // ═══════════════════════════════════════════════════════════════════════════
  { comuna: "Treguaco", sector: "Buchupureo (Costa)", propertyType: "terreno", avgPricePerM2: 10.0, minPricePerM2: 6.0, maxPricePerM2: 18.0, sampleSize: 6 },
  { comuna: "Treguaco", sector: "", propertyType: "casa", avgPricePerM2: 12.0, minPricePerM2: 7.5, maxPricePerM2: 18.0, sampleSize: 8 },
  { comuna: "Treguaco", sector: "", propertyType: "terreno", avgPricePerM2: 3.5, minPricePerM2: 1.5, maxPricePerM2: 18.0, sampleSize: 12 },
  { comuna: "Treguaco", sector: "", propertyType: "agricola", avgPricePerM2: 0.48, minPricePerM2: 0.25, maxPricePerM2: 0.80, sampleSize: 12 },

  // ═══════════════════════════════════════════════════════════════════════════
  // COBQUECURA — Borde costero, turismo playa
  // ═══════════════════════════════════════════════════════════════════════════
  { comuna: "Cobquecura", sector: "Centro / Playa", propertyType: "casa", avgPricePerM2: 20.0, minPricePerM2: 13.0, maxPricePerM2: 30.0, sampleSize: 9 },
  { comuna: "Cobquecura", sector: "", propertyType: "casa", avgPricePerM2: 17.0, minPricePerM2: 10.0, maxPricePerM2: 30.0, sampleSize: 18 },
  { comuna: "Cobquecura", sector: "Centro / Playa", propertyType: "terreno", avgPricePerM2: 12.0, minPricePerM2: 7.0, maxPricePerM2: 22.0, sampleSize: 7 },
  { comuna: "Cobquecura", sector: "", propertyType: "terreno", avgPricePerM2: 5.0, minPricePerM2: 2.5, maxPricePerM2: 22.0, sampleSize: 14 },
  { comuna: "Cobquecura", sector: "", propertyType: "agricola", avgPricePerM2: 0.55, minPricePerM2: 0.28, maxPricePerM2: 0.90, sampleSize: 10 },
];

// ─── COMMUNES LIST ───────────────────────────────────────────────────────────
export const ÑUBLE_COMMUNES = [
  "Bulnes",
  "Chillán",
  "Chillán Viejo",
  "Cobquecura",
  "Coelemu",
  "Coihueco",
  "El Carmen",
  "Ninhue",
  "Ñiquén",
  "Pemuco",
  "Pinto",
  "Portezuelo",
  "Quillón",
  "Quirihue",
  "Ránquil",
  "San Carlos",
  "San Fabián de Alico",
  "San Ignacio",
  "San Nicolás",
  "Treguaco",
  "Yungay",
  // Zona de influencia comercial CVR
  "Cabrero",
];

// ─── SECTOR MAP ──────────────────────────────────────────────────────────────
export const SECTORS_BY_COMMUNE: Record<string, string[]> = {
  "Chillán": [
    "Centro",
    "Las Mariposas",
    "Ultraestación",
    "Pedro de Valdivia",
    "Parque Ecuador",
    "Valle del Rey",
    "San Ramón",
    "Estadio",
    "Quilmo",
    "Villa Javiera Carrera",
    "Los Alpes",
    "Collín",
    "Las Golondrinas",
    "Neptuno",
    "Camino a Recinto",
  ],
  "Chillán Viejo": ["Centro", "Las Fuentes"],
  "San Carlos": ["Centro", "Villa El Carmen", "Población Oriente", "Los Pinos", "Vista Hermosa", "Periferia"],
  "Bulnes": ["Centro", "Villa los Quillayes", "Los Boldos"],
  "Yungay": ["Centro Urbano", "Termas de Chillán", "Las Trancas", "Recinto"],
  "Coelemu": ["Centro", "Costa / Playa", "El Manzano"],
  "Quirihue": ["Centro", "Villa Esperanza"],
  "Quillón": ["Centro", "Villa O'Higgins"],
  "Cabrero": ["Centro", "Población Kennedy", "Los Arrayanes"],
  "Cobquecura": ["Centro / Playa"],
  "Coihueco": ["Centro"],
  "El Carmen": ["Centro"],
  "Pinto": ["Centro", "Termas El Aucún"],
  "San Fabián de Alico": ["Centro"],
  "San Ignacio": ["Centro"],
  "San Nicolás": ["Centro"],
  "Treguaco": ["Buchupureo (Costa)"],
  "Ránquil": ["Nueva Aldea"],
};
