# Informe — estándar visual, honorarios y cierre de pendientes

Rama de trabajo: `hermes/20261123-230554` (worktree `C:\Users\carlo\Desktop\.hermes-worktrees\.cvr-main-integracion-20261123-230554`).
No se hizo push, no se desplegó y no se aplicó ninguna migración contra la base.

## 1. Archivos y qué cambió

- `src/lib/honorarios.ts` (nuevo): fuente única de la tabla de honorarios (venta, arriendo, administración, asesoría, corredores), IVA y mínimo en UF de la asesoría.
- `src/app/(sitio)/honorarios/page.tsx` (nuevo): página `/honorarios` con las cuatro columnas, quién paga, reglas de fijación por escrito, argumento del honorario fijo y conversión de 12 UF a pesos con fecha y fuente del SII.
- `src/app/api/tasacion/cotizacion/route.ts` (nuevo): recibe `tasacionId`, lee la solicitud guardada y envía a CVR el aviso para cotizar el informe por escrito. No crea pagos.
- `prisma/migrations/20261123232000_tasacion_uf_fields/migration.sql` (nuevo): migración de `ufValueCLP`, `ufDate` y `estimatedValueCLP` nullable.
- `prisma/migrations/migration_lock.toml` (nuevo): lock de Prisma, proveedor `postgresql`.
- `prisma/schema.prisma`: `estimatedValueCLP` pasa a `Float?`; se agregan `ufValueCLP Float?` y `ufDate DateTime?`; `paymentStatus` queda documentado como legado del flujo de pago.
- `src/app/globals.css`: tokens compartidos (`--cvr-gold #c9a84c`, escala navy, `--cvr-gold-ink`), escalas `--step-*`, `--space-*`, radios 6/10/16/pill, duración y curvas; `--shadow: none` con elevación por borde y paso de fondo; regla `prefers-reduced-motion` completa; `.nav-toggle` 44×44; `.link-arrow` 44 px de alto; enlaces de contacto y pie a 44 px; etiquetas de checkbox a 44 px; bordes de campos a 3:1; transiciones solo de `transform` y `opacity`; tabla de honorarios desplazable con primera columna fija en móvil.
- `src/components/site-header.tsx`: enlace «Honorarios» en la navegación; se retira el enlace externo «Tasaciones y peritajes» de la barra de escritorio (sigue en el menú móvil y en el pie) para que la barra no se envuelva.
- `src/components/site-footer.tsx`: enlace «Honorarios» en el pie.
- `src/app/(sitio)/servicios/venta/page.tsx`: honorario leído de `honorarios.ts`, quién paga, «qué recibes y cuándo» y enlace a la tabla.
- `src/app/(sitio)/servicios/arriendo/page.tsx`: honorarios de colocación y administración desde `honorarios.ts`; «qué recibes y cuándo»; «lo que no incluye».
- `src/app/(sitio)/servicios/asesoria-de-compra/page.tsx`: honorario fijo desde 12 UF + IVA, argumento explícito contra el porcentaje y el conflicto de interés; «qué recibes y cuándo»; «lo que no incluye».
- `src/app/(sitio)/corredores/page.tsx`: reparto 50/50 de la comisión de la parte aportada; se elimina el párrafo que decía que no había tarifario.
- `src/app/(sitio)/page.tsx`: fórmula exacta de calificación profesional; se elimina el marcador; se elimina cualquier cifra de años de experiencia inmobiliaria; «respaldos documentales» en vez de «certificados».
- `src/app/(sitio)/tasacion/page.tsx`: la estimación en línea se declara gratuita y el informe firmado se declara cotizado por escrito.
- `src/components/estimador.tsx`: se retira toda la interfaz de pago (MercadoPago, verificación de pago, «encargar»); el resultado ofrece «Pedir cotización» contra el nuevo endpoint; se aclara que calcular no tiene costo y no crea encargo.
- `src/app/api/tasacion/route.ts`: guarda `estimatedValueCLP` nullable, `ufValueCLP` y `ufDate`.
- `src/lib/encargo.ts`: plazo «se acuerda por escrito al aceptar el encargo»; el precio queda solo como dato legado del código de pagos.
- `src/lib/fulfill.ts`: usa `ufValueCLP`/`ufDate` guardados y tolera `estimatedValueCLP` nulo; se anota que el camino de pago quedó sin uso.
- `src/lib/pdf-generator.ts`: dorado actualizado a `#c9a84c`; etiqueta «UF del …» en vez de «solicitud del …»; se quita la mención a una norma de tasación; «profesional» en vez de «perito».
- `src/lib/mailer.ts`: dorado de los correos a `#c9a84c`.
- `src/app/(sitio)/terminos/page.tsx`: sección 4 reescrita: estimación gratuita, informe cotizado, sin cobro en línea, condiciones por escrito y política de reembolso.
- `src/app/(sitio)/privacidad/page.tsx`: domicilio «Chillán, Región de Ñuble, Chile» sin dirección de calle; conservación 12/24/activa+12 meses marcada como pendiente legal; transferencia internacional con Neon y Vercel, países e instrumentos; derechos con `contacto@cvrpropiedades.com`.
- `src/app/admin/page.tsx`: adaptación al monto en pesos nullable y a la UF/fecha guardadas; la etiqueta de estado pasa a «Sin cobro» / «Pagado (legado)».
- `src/app/sitemap.ts`: se agrega `/honorarios`.
- `src/components/diagnostico-quiz.tsx`: la barra de avance anima `transform: scaleX()` en vez de `width`.
- `src/lib/admin-auth.ts`: **sin cambios** (verificado con `git status`).

## 2. Los 13 criterios, uno por uno

1. **Build, tipos y lint.** `npx next build --webpack` → exit 0. `npx tsc --noEmit` → exit 0, sin salida. `npx eslint src` → exit 0, sin salida. La única advertencia del build es `DEP0205 module.register()` de Node 26 dentro de Next; no proviene del código modificado.
2. **Sin desborde horizontal 320–430 px.** Medido con Chrome 157 headless por CDP a 320, 360, 375, 390 y 430 px en 15 rutas. En todas, `document.documentElement.scrollWidth` fue exactamente igual al ancho del viewport. Además se forzó `overflow-x: visible` en `html` y `body` y se volvió a medir: también exactamente igual. Rutas: `/`, `/propiedades`, `/propiedades/no-existe`, `/servicios/venta`, `/servicios/arriendo`, `/servicios/asesoria-de-compra`, `/honorarios`, `/corredores`, `/tasacion`, `/herramientas/costos-de-compra`, `/herramientas/diagnostico-predio`, `/privacidad`, `/terminos`, `/admin`, `/propiedades/agregar`.
3. **Área de toque 44×44.** `.nav-toggle` mide 44×44 en las 15 rutas. `.link-arrow` mide 44 px de alto (67 px en el enlace que ocupa dos líneas). Botones y enlaces de pie/contacto tienen `min-height: 44px`; pestañas 44; etiquetas de checkbox 44 px de alto; etiquetas de radio 293×76. Los únicos nodos medidos bajo 44 son los `input` nativos de radio (13×13) y checkbox (20×20), cuya etiqueta clickeable es la que da el área efectiva (44+ y 293×76), y el honeypot oculto (tabIndex −1, `aria-hidden`). Los enlaces de texto en línea dentro de párrafos quedan en la excepción pedida.
4. **Contraste WCAG AA.** Calculado con la fórmula de luminancia relativa: texto principal 17,73:1; `--text-sub` 9,79:1; `--text-muted` 7,96:1; dorado 8,58:1; dorado claro 11,58:1 sobre `#050c17`. Texto del botón dorado 8,78:1. Borde de campos `#5a7aa8`: 4,31:1 contra el relleno y 3,49:1 contra la tarjeta. Borde dorado compuesto: 4,11:1 sobre el fondo y 3,32:1 sobre la superficie elevada. `--cvr-gold` no se usa como texto sobre superficie clara; para eso está `--cvr-gold-ink` (5,95:1 sobre blanco).
5. **Un solo `<h1>` y sin saltos.** Medido por ruta: exactamente 1 `<h1>` en las 15 rutas. La secuencia de `h1..h6` no tuvo saltos (`[]` en todas).
6. **Teclado, orden y foco.** Secuencia real de Tab en la portada: «Saltar al contenido» → marca → Propiedades → Vender → Arrendar → Comprar → Diagnóstico → Honorarios. La barra de escritorio se midió a 1081, 1200 y 1280 px: 72 px de alto, sin envolverse. Foco calculado: `outline: 3px solid rgb(226,196,122)` con `outline-offset: 2px`. El menú móvil abre con `aria-expanded="true"`, 9 enlaces, y Escape lo cierra.
7. **Contenedores con overflow.** Las tres tablas (`/honorarios`, `/herramientas/costos-de-compra`, `/privacidad`) están dentro de un contenedor con `overflow-x: auto`, `role="region"`, `tabIndex={0}` y `aria-label`. Verificado por CDP.
8. **Imágenes.** No hay ningún `<img>` en ninguna ruta (0 elementos). El hero dejó de usar `hero-bg.png` y ahora es un degradado CSS; no hay recurso de banco de imágenes. El archivo `public/hero-bg.png` quedó sin referencia y no se borró.
9. **Metadata, JSON-LD, sitemap y noindex.** Títulos propios y distintos en las 14 rutas de contenido. Todos los `application/ld+json` parsean con `JSON.parse` sin error (`RealEstateAgent`, `Service`, `OfferCatalog`). `/honorarios` está en `sitemap.xml`. `/admin` y `/propiedades/agregar` responden `noindex, nofollow, nocache` y no aparecen en el sitemap.
10. **Estados de control.** Botones y enlaces: reposo, hover, `:focus-visible`, `:active`, `:disabled`; campos: reposo, hover, foco, inválido y deshabilitado; pestañas: reposo, hover, activo, deshabilitado; tarjetas de radio: reposo, hover, `:focus-within`, seleccionada. Los envíos muestran «Calculando…», «Enviando la solicitud…», etc.
11. **Secretos y variables.** No se agregó ninguna variable de entorno. `.env.example` no cambió. No hay claves ni tokens en el código; la cadena de conexión no se publicó.
12. **`src/lib/admin-auth.ts`.** Sin cambios en el diff; sigue fallando cerrado, rechazando la clave filtrada y comparando en tiempo constante.
13. **PDF.** Se mantiene el título «ESTIMACIÓN REFERENCIAL DE VALOR», el descargo en el encabezado, la ausencia de firma y la ausencia de mención a una norma (se eliminó la frase «no aplica una norma de tasación»). Se actualizó el dorado y la etiqueta de fecha de la UF.

## 3. Salidas pegadas

### `npx tsc --noEmit`

```
(sin salida)
exit 0
```

### `npx eslint src`

```
(sin salida)
exit 0
```

### `npx next build --webpack`

```
▲ Next.js 16.2.6 (webpack)

  Creating an optimized production build ...
(node:4956) [DEP0205] DeprecationWarning: `module.register()` is deprecated. Use `module.registerHooks()` instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
✓ Compiled successfully in 8.7s
  Running TypeScript ...
  Finished TypeScript in 7.2s ...
  Collecting page data using 11 workers ...
  Generating static pages using 11 workers (0/31) ...
  Generating static pages using 11 workers (7/31)
  Generating static pages using 11 workers (15/31)
  Generating static pages using 11 workers (23/31)
✓ Generating static pages using 11 workers (31/31) in 1240ms
  Finalizing page optimization ...
  Collecting build traces ...

Route (app)                           Revalidate  Expire
┌ ○ /
├ ○ /_not-found
├ ○ /admin
├ ƒ /api/admin
├ ƒ /api/admin/propiedades
├ ƒ /api/consultas
├ ƒ /api/contacto
├ ƒ /api/pagos
├ ƒ /api/pagos/confirmar
├ ƒ /api/pagos/webhook
├ ƒ /api/propiedades
├ ƒ /api/sectores
├ ƒ /api/seed
├ ƒ /api/tasacion
├ ƒ /api/tasacion/cotizacion
├ ○ /corredores
├ ○ /herramientas/costos-de-compra
├ ○ /herramientas/diagnostico-predio
├ ○ /honorarios                               1d      1y
├ ○ /privacidad
├ ○ /propiedades
├ ƒ /propiedades/[id]
├ ○ /propiedades/agregar
├ ○ /robots.txt
├ ○ /servicios/arriendo
├ ○ /servicios/asesoria-de-compra
├ ○ /servicios/venta
├ ○ /sitemap.xml
├ ○ /tasacion
└ ○ /terminos


○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

## 4. Región de Neon y de Vercel

**Neon: determinado.** La cadena de conexión configurada tiene el host con sufijo `sa-east-1`, que corresponde a la región AWS South America (São Paulo), **Brasil**. Se leyó solo el host, sin publicar la cadena ni las credenciales. `npx prisma migrate status` confirmó el datasource PostgreSQL en esa región y que la migración nueva **no** está aplicada.

**Vercel: país determinado, región no.** `.vercel/project.json` solo contiene `projectId`, `orgId` y `projectName`; no tiene campo de región. No hay CLI de Vercel autenticada en este host para consultar la configuración del proyecto. El Data Processing Addendum de Vercel declara que sus instalaciones principales de procesamiento están en **Estados Unidos** y que puede transferir datos a EE.UU. y a las jurisdicciones de sus subencargados. Por eso la política declara Estados Unidos como país y deja el marcador `{{PENDIENTE: confirmar la región del proyecto en Vercel}}` para la región de ejecución.

**Correo: no determinado.** El SMTP por defecto del proyecto es Gmail; no se puede confirmar desde los archivos la cuenta ni el país. Queda `{{PENDIENTE: confirmar proveedor y país de correo}}`.

**Instrumentos declarados en la política:** Data Processing Addendum de Neon (con Cláusulas Contractuales Tipo 2021/914 y Marco de Privacidad de Datos UE-EE.UU.); Data Processing Addendum de Vercel (aplicable a planes Pro y Enterprise, con Cláusulas Contractuales Tipo 2021/914); acuerdo de tratamiento de Google Workspace/Google Cloud para el correo. La sección 4 de privacidad queda marcada como pendiente de revisión legal.

## 5. Marcadores cerrados y abiertos

Cerrados:
- `{{PENDIENTE: honorarios...}}` en venta, arriendo, asesoría y corredores.
- `{{PENDIENTE: calificación profesional exacta}}` en la portada.
- `{{PENDIENTE: domicilio legal y correo de privacidad}}`.
- `{{PENDIENTE: plazo de conservación de consultas / estimaciones / publicaciones}}`: reemplazados por 12 meses, 24 meses y «activa + 12 meses», con la nota visible de que son plazos propuestos pendientes de revisión legal.
- `{{PENDIENTE: política de reembolso...}}`.
- `{{PENDIENTE: detalle de países de destino...}}`: reemplazado por el detalle de Neon/Vercel/correo; sobreviven solo los dos marcadores de región no determinada.

Abiertos y por qué:
- Región de ejecución de Vercel: no está en `project.json` ni en la documentación del proyecto; no se adivina.
- País/cuenta del proveedor de correo: no está en los archivos.
- Cuatro `{{PENDIENTE}}` de `src/lib/costos-compra.ts` (tasa de inscripción, arancel notarial, certificados municipales, tasa/tope bancario): son datos de terceros ajenos a este encargo y siguen visibles en la calculadora.

## 6. Migración generada

Archivo: `prisma/migrations/20261123232000_tasacion_uf_fields/migration.sql`

```sql
-- AlterTable
ALTER TABLE "TasacionRequest" ADD COLUMN     "ufDate" TIMESTAMP(3),
ADD COLUMN     "ufValueCLP" DOUBLE PRECISION,
ALTER COLUMN "estimatedValueCLP" DROP NOT NULL;
```

Generada con `prisma migrate diff --from-schema <schema anterior> --to-schema prisma/schema.prisma --script` (Prisma 7.8.0). **No aplicada.** `prisma migrate status` informa: «1 migration found… 20261123232000_tasacion_uf_fields… have not yet been applied».

Advertencia de despliegue: el cliente Prisma ya selecciona las columnas nuevas. Hasta que se aplique esta migración, las consultas a `TasacionRequest` (`/api/tasacion`, `/api/admin`, `/api/tasacion/cotizacion`) fallarán contra la base actual. La migración debe aplicarse antes de desplegar este código; no la apliqué por instrucción expresa.

## 7. Qué quedó sin usar

El cobro en línea quedó inalcanzable desde la interfaz, pero no se borró:
- `src/app/api/pagos/route.ts`
- `src/app/api/pagos/confirmar/route.ts`
- `src/app/api/pagos/webhook/route.ts`
- `src/lib/fulfill.ts` (marcado como camino sin uso)
- `ENCARGO.precioCLP` (precio legado de $15.000)

Ninguna página ni componente del sitio enlaza a `/api/pagos`. La estimación en línea ya no muestra precio ni botón de pago.

## 8. Qué no alcancé a comprobar

- **Ficha `/propiedades/[id]` con datos reales:** la base de producción no tiene fichas activas (`GET /api/propiedades` devuelve `total: 0`). Probé la ruta 404 (`/propiedades/no-existe`) y revisé el código: la consulta de la ficha selecciona sector, comuna, superficies y características, y **no** selecciona `address`, `contactName`, `contactPhone` ni `contactEmail`. No pude renderizar una ficha con datos, así que no la declaro probada a 375 px.
- **Flujo POST de estimación y de cotización contra la base:** no lo ejecuté porque la migración no está aplicada y escribiría en producción. No se creó ningún registro de prueba.
- **Envío real de correo:** el SMTP no está configurado en este entorno; el endpoint de cotización devolvería 503 con el canal alternativo, como el formulario de contacto. No se envió ningún correo.
- **Región de Vercel y país del correo:** no determinados, como se explica arriba.
- **PDF generado con datos reales:** se revisó el código y se mantienen las correcciones, pero no se generó un PDF nuevo porque el flujo de pago/fulfill no se ejecutó.
- No se hizo push, deploy ni se aplicó la migración.

## 9. Notas de diseño

- El hero ya no usa `public/hero-bg.png` (imagen de archivo, sin relación con inmuebles de CVR). Queda un degradado propio. El archivo se dejó en `public/` sin referencia.
- La tabla de honorarios conserva las cuatro columnas; en móvil se desplaza dentro de su `role="region"` y la columna «Servicio» queda fija para que el honorario no se lea sin saber a qué servicio corresponde.
- La elevación en oscuro es borde de 1 px más claro y un paso de fondo (`--surface-1/2/3`); `--shadow` quedó en `none`.
- La única animación es de `transform`/`opacity`; no hay carruseles, bucles ni movimientos automáticos.
