# Informe de trabajo — cvrpropiedades.cl

Rama: `hermes/20261120-140242` (worktree `cvr_consultoria_app-20261120-140242`).
Base: commit `61ba555`. No se hizo push, no se desplegó y no se tocó `.env`, `.vercel/`, `prisma/schema.prisma` ni el repositorio `cvr-website`.

---

## 1. Qué se hizo, archivo por archivo

### Archivos nuevos

| Archivo | Qué contiene |
|---|---|
| `src/lib/site.ts` | Identidad única del sitio: marca, razón social, dominio canónico `cvrpropiedades.cl`, correo, teléfono, enlaces a `cvrtasaciones.cl` y la línea legal con `{{RUT_PENDIENTE}}`. |
| `src/lib/admin-auth.ts` | Autenticación del panel: solo `ADMIN_PASSWORD`, comparación en tiempo constante y rechazo explícito de la clave filtrada. |
| `src/lib/costos-compra.ts` | Módulo A: tabla única de constantes y tasas con fuente, fecha y estado de cada ítem, más el cálculo del desglose. |
| `src/lib/diagnostico.ts` | Módulo B: 10 preguntas, 10 áreas, criterio del semáforo y el informe recomendado por área. |
| `src/lib/encargo.ts` | Precio y plazo del encargo de tasación en un solo lugar (el precio alimenta la preferencia de MercadoPago). |
| `src/lib/fulfill.ts` | Cierre del pago: marca la solicitud como pagada y envía la estimación referencial (no un informe firmado). |
| `src/components/site-header.tsx` | Navegación compartida, menú móvil accesible (`aria-expanded`, `aria-controls`, Escape), enlace externo a tasaciones. |
| `src/components/site-footer.tsx` | Pie con servicios, herramientas, enlaces a la línea pericial y la línea legal `CVR Propiedades SpA · RUT {{RUT_PENDIENTE}} · Chillán, Región de Ñuble`. |
| `src/components/json-ld.tsx` | JSON-LD con escape de `<` (según la guía de JSON-LD de Next 16). |
| `src/components/contact-form.tsx` | Formulario general con `<label>` asociada, consentimiento explícito, honeypot y errores con `role="alert"`. |
| `src/components/quick-estimate.tsx` | Acceso rápido al estimador desde el inicio. |
| `src/components/propiedades-list.tsx` | Listado con filtros, paginación y estados; ya no muestra teléfonos. |
| `src/components/property-contact-form.tsx` | Consulta por una ficha; el mensaje llega a CVR, no al propietario. |
| `src/components/costos-calculator.tsx` | Módulo A en pantalla: fórmula, fuente y fecha por ítem, total y descargo. |
| `src/components/diagnostico-quiz.tsx` | Módulo B en pantalla: una pregunta por paso, semáforo por área, estado persistido en `sessionStorage`. |
| `src/components/estimador.tsx` | Estimador de valor reescrito: consentimiento, resultado con fórmula/muestra/año y encargo humano separado del PDF automático. |
| `src/app/(sitio)/layout.tsx` | Layout del sitio público (cabecera + `main#contenido` + pie). |
| `src/app/(sitio)/page.tsx` | Inicio nuevo: servicios de corretaje, credenciales verificables, herramientas, contacto. Sin testimonios ni cifras infladas. |
| `src/app/(sitio)/propiedades/page.tsx` | Portal de propiedades con metadatos propios. |
| `src/app/(sitio)/propiedades/[id]/page.tsx` | Ficha: metadatos dinámicos, JSON-LD `Offer`, solo sector/comuna, formulario de consulta y enlace a estudio de títulos. |
| `src/app/(sitio)/corredores/page.tsx` | Programa de corredores asociados sin precios inventados. |
| `src/app/(sitio)/tasacion/page.tsx` | Página del estimador con metadatos y descargo visible arriba. |
| `src/app/(sitio)/servicios/venta/page.tsx` | Servicio 1: precio de lista, alcance, honorarios `{{PENDIENTE}}`, JSON-LD `Service`. |
| `src/app/(sitio)/servicios/arriendo/page.tsx` | Servicio 2: selección, contrato, administración, honorarios `{{PENDIENTE}}`. |
| `src/app/(sitio)/servicios/asesoria-de-compra/page.tsx` | Servicio 3: qué se revisa, cuándo corresponde informe firmado, honorarios `{{PENDIENTE}}`. |
| `src/app/(sitio)/herramientas/costos-de-compra/page.tsx` | Página del Módulo A. |
| `src/app/(sitio)/herramientas/diagnostico-predio/page.tsx` | Página del Módulo B. |
| `src/app/(sitio)/privacidad/page.tsx` | Política de privacidad Ley 21.719 (responsable, finalidades, base de licitud, conservación, encargados, transferencias, derechos). |
| `src/app/(sitio)/terminos/page.tsx` | Términos de uso (alcance, herramientas, servicio pagado, reembolso, responsabilidad, PI, ley aplicable). |
| `src/app/admin/layout.tsx` | `noindex` para `/admin`. |
| `src/app/api/contacto/route.ts` | Formulario general: validación, consentimiento, honeypot, sin persistencia. |
| `src/app/api/consultas/route.ts` | Consulta por ficha: valida que la propiedad exista y esté activa. |
| `src/app/api/admin/propiedades/route.ts` | `PATCH` para publicar/retirar una publicación enviada por un anunciante. |
| `src/app/not-found.tsx` | 404 con la navegación del sitio y `noindex`. |
| `src/app/robots.ts`, `src/app/sitemap.ts` | `robots.txt` (bloquea `/admin` y `/api/`) y sitemap de las 11 rutas estáticas. |
| `src/app/propiedades/agregar/layout.tsx` | Metadatos y cabecera/pie para el formulario de publicación. |
| `.env.example` | Variables usadas por el sitio, sin valores. Se agregó `!.env.example` al `.gitignore`. |

### Archivos modificados

| Archivo | Qué cambió |
|---|---|
| `src/app/layout.tsx` | Metadatos de CVR Propiedades, `metadataBase` y todos los `@id`/URL a `cvrpropiedades.cl`, JSON-LD `RealEstateAgent` sin precios ni promesas de validez, sin el lema "No somos corredores". |
| `src/app/globals.css` | Hoja nueva: `--text-muted` pasó de 3,06:1 a 7,96:1 sobre el fondo, foco visible, `prefers-reduced-motion`, estilos de formularios, tablas, semáforo y administración. |
| `src/app/api/tasacion/route.ts` | Validación de tipos/enums/rangos, consentimiento obligatorio, conversión ha→m² (antes no se hacía), devuelve `sampleSize` y los factores usados. |
| `src/app/api/seed/route.ts` | **Exige autenticación** y falla cerrado si falta `ADMIN_PASSWORD`; validación de entrada. |
| `src/app/api/admin/route.ts` | Eliminada la clave por defecto escrita en el código; validación numérica y de enums; ahora también lista publicaciones. |
| `src/app/api/propiedades/route.ts` | `GET` ya no devuelve `contactPhone`; `POST` valida campos, exige consentimiento y guarda `isActive: false` para revisión. |
| `src/app/api/sectores/route.ts` | Valida `comuna` y `tipo` antes de consultar la base. |
| `src/app/api/pagos/route.ts` | Ítem y monto desde `ENCARGO`; en producción, sin credenciales responde 503 en vez de simular un pago. |
| `src/app/api/pagos/confirmar/route.ts` | El modo simulado solo funciona fuera de producción; usa `cumplirEncargo`. |
| `src/app/api/pagos/webhook/route.ts` | Usa `cumplirEncargo`; ya no duplica la generación del PDF. |
| `src/lib/pdf-generator.ts` | **Reescrito** (ver Prioridad 1). |
| `src/lib/mailer.ts` | Correos nuevos: "estimación referencial", descargo en el cuerpo, pie con RUT pendiente; se agregó el aviso interno de consultas con escape de HTML. |
| `src/app/admin/page.tsx` | Se quitó la contraseña publicada en pantalla, el seed envía la credencial, `label`/`htmlFor` en todos los campos, pestaña de publicaciones pendientes y aviso de datos personales. |
| `src/app/propiedades/agregar/page.tsx` | Marca nueva, consentimiento obligatorio, sin conversión UF→CLP con tasa inventada, aviso de que la dirección y el teléfono no se publican. |
| `.gitignore` | Excepción para `.env.example`. |

### Archivos eliminados (reemplazados por la versión nueva)

`src/app/page.tsx`, `src/app/tasacion/page.tsx`, `src/app/corredores/page.tsx`, `src/app/propiedades/page.tsx`.

---

## 2. Prioridad 1, afirmación por afirmación

**a) El título "INFORME OFICIAL DE TASACIÓN".**
Eliminado. El documento se titula **"ESTIMACIÓN REFERENCIAL DE VALOR"** en `src/lib/pdf-generator.ts:143-147`, y los metadatos del PDF en `:114-119`. La palabra "oficial" no aparece en ninguna parte del documento, la interfaz ni los metadatos; la única aparición en el repositorio es un comentario de código que dice que nunca se usa (`src/lib/pdf-generator.ts:10`).

**b) La invocación a la NCh 3658.**
Eliminada sin reemplazo. `grep -rn "NCh" src/` devuelve solo el comentario `:11`, que documenta que no se invoca. En su lugar, `src/lib/pdf-generator.ts:262-294` describe lo que sí se hizo: valor = superficie × precio de referencia por m² × factor de estado (× factor de antigüedad en casas y departamentos), con el año de los valores (`referenceYear`) y el tamaño de la muestra (`sampleSize`) impresos en el mismo párrafo. Añadí además que el equivalente en pesos usa una UF de referencia fija y no el valor oficial del día (`:273-287`).

**c) El bloque de firma del perito.**
Eliminado. Ya no existe el bloque con "Carlos Vivanco R." ni "Perito Tasador Certificado". En su lugar, `src/lib/pdf-generator.ts:308-324` imprime "EMITIDO POR EL SISTEMA DE CVR PROPIEDADES", la razón social, el RUT pendiente y la frase "Documento generado automáticamente. No lleva firma ni representa la opinión de un perito." El correo al cliente (`src/lib/mailer.ts`) también dejó de decir que el informe "fue emitido y firmado".

**d) La contradicción con el descargo del final.**
El descargo dejó de estar al final: ahora es lo primero, en un recuadro bajo el encabezado (`src/lib/pdf-generator.ts:155-180`, bloque "LEA ESTO PRIMERO"), con las cuatro exclusiones —no es tasación, no sirve para trámites bancarios, judiciales, hereditarios ni de compraventa— y la frase de que para eso se requiere un informe con inspección y firma. El mismo descargo aparece, sin desplazar, arriba del estimador (`src/app/(sitio)/tasacion/page.tsx:30-36`) y otra vez bajo el resultado (`src/components/estimador.tsx:288-294`).

**e) El flujo de pago y la promesa del "Informe Oficial".**
`src/components/estimador.tsx:296-315`: la tarjeta ahora se llama "Encargo de tasación con inspección y firma", dice que es trabajo humano ("No es una descarga automática: es un encargo que se trabaja") y muestra el plazo como `{{PENDIENTE}}`. La pantalla posterior al pago (`:194-220`) dice que el encargo entró a la lista de trabajo del perito, y aclara que la estimación enviada por correo "no es el producto que compraste ni lleva firma". El ítem de MercadoPago cambió de "Informe Oficial de Tasación" a "Encargo de tasación con inspección y firma" (`src/app/api/pagos/route.ts`). Ningún documento firmado se emite sin intervención de Carlos: el flujo automático solo envía la estimación referencial.

**f) `{{PENDIENTE: calificación profesional exacta, confirmar con Carlos}}`.**
Dejado en `src/app/(sitio)/page.tsx:197`, junto a las credenciales verificables del archivo curado. No se usó "Perito Tasador Certificado" en ninguna parte.

---

## 3. Documentación de Next 16 leída

- `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/04-linking-and-navigating.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/06-fetching-data.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/14-metadata-and-og-images.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md`
- `node_modules/next/dist/docs/01-app/02-guides/forms.md`
- `node_modules/next/dist/docs/01-app/02-guides/json-ld.md`
- `node_modules/next/dist/docs/01-app/02-guides/instant-navigation.md`

Notas de aplicación:
- `params` se trata como `Promise` en la ficha y en `generateMetadata` (`await params`), y `generateMetadata` + página comparten la consulta con `cache()` de React, como indica la guía de metadatos.
- El JSON-LD se inyecta con `<script>` nativo y escape de `<` a `\u003c`, según la guía.
- `unstable_instant` no se exportó: la guía de navegación instantánea aplica con **Cache Components** habilitado, y `next.config.ts` no lo habilita (solo declara `serverExternalPackages`). Si se habilita Cache Components, hay que revisar esa exportación.

---

## 4. Salida del build y del lint

`npx next build --webpack`:

```
▲ Next.js 16.2.6 (webpack)

  Creating an optimized production build ...
(node:29352) [DEP0205] DeprecationWarning: `module.register()` is deprecated. Use `module.registerHooks()` instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
✓ Compiled successfully in 3.0s
  Running TypeScript ...
  Finished TypeScript in 5.1s ...
  Collecting page data using 11 workers ...
  Generating static pages using 11 workers (0/29) ...
  Generating static pages using 11 workers (7/29) 
  Generating static pages using 11 workers (14/29) 
  Generating static pages using 11 workers (21/29) 
✓ Generating static pages using 11 workers (29/29) in 728ms
  Finalizing page optimization ...
  Collecting build traces ...

Route (app)
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
├ ○ /corredores
├ ○ /herramientas/costos-de-compra
├ ○ /herramientas/diagnostico-predio
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

La advertencia `DEP0205` viene de Next.js, no del código del proyecto: ya aparecía en el build del commit base antes de cualquier cambio.

`npm run lint`:

```
> cvr_consultoria_app@0.1.0 lint
> eslint
```

Sin errores ni advertencias. No hay `any` nuevos ni `@ts-ignore` (`grep` sin resultados).

---

## 5. `{{PENDIENTE: ...}}` que quedaron

| Marcador / lugar | Qué tiene que decidir Carlos |
|---|---|
| `{{PENDIENTE: calificación profesional exacta, confirmar con Carlos}}` — inicio | Cómo se describe su calificación en una línea, verificable. |
| `{{PENDIENTE: honorarios, definir porcentaje y condiciones con Carlos}}` — servicio de venta | Comisión de corretaje y condiciones. |
| `{{PENDIENTE: honorarios de arriendo y administración, ...}}` — servicio de arriendo | Comisión de colocación y costo mensual. |
| `{{PENDIENTE: honorarios de asesoría de compra, ...}}` — asesoría de compra | Cómo se cotiza el acompañamiento. |
| `{{PENDIENTE: condiciones y comisiones del programa de corredores, ...}}` — corredores | Reglas de derivación y comisiones. |
| `{{PENDIENTE: plazo de entrega del encargo de tasación, ...}}` — `src/lib/encargo.ts` | Plazo real del informe firmado (aparece en la tarjeta de pago, la pantalla de éxito y los términos). |
| `{{PENDIENTE: automatizar el valor de la UF con la fuente oficial}}` — resultado del estimador | Hoy la UF es una constante de `src/lib/seed-data.ts` (38.500). Conviene leerla del SII. |
| `{{PENDIENTE: confirmar tasa y tope vigentes...}}`, `{{PENDIENTE: arancel notarial...}}`, `{{PENDIENTE: arancel de inscripción del CBR...}}`, `{{PENDIENTE: valores de certificados...}}` — `src/lib/costos-compra.ts` | Aranceles que no puedo afirmar con certeza. Se muestran "a cotizar" y no suman al total. |
| `{{PENDIENTE: domicilio legal y correo de privacidad definitivos}}` — privacidad | Domicilio y casilla para derechos. |
| `{{PENDIENTE: plazo de conservación de consultas / solicitudes / publicaciones}}` y `{{PENDIENTE: plazos concretos...}}` — privacidad | Plazos de conservación por categoría. |
| `{{PENDIENTE: detalle de países de destino y cláusulas contractuales...}}` — privacidad | Transferencias internacionales de Vercel/Neon/MercadoPago. |
| `{{PENDIENTE: política de reembolso y condiciones de cancelación...}}` — términos | Reembolso del encargo. |
| `{{RUT_PENDIENTE}}` — pie legal, PDF, correos, privacidad y términos | RUT de CVR Propiedades SpA (no está en los respaldos y no se inventa). |

El precio de $15.000 del encargo se mantuvo porque es el que ya cobra MercadoPago en este repositorio, pero **no está verificado comercialmente**: queda centralizado en `src/lib/encargo.ts` para que se cambie en un solo lugar.

---

## 6. Qué se eliminó y por qué

- **Testimonios** ("Lo que dicen nuestros clientes", tres testimonios con nombre y comuna): eliminados. No hay evidencia de que fueran reales ni autorizados por escrito, y el encargo prohíbe redactar nuevos. No se reemplazaron.
- **"Más de 20 años asegurando inversiones inmobiliarias"**: eliminado. Los 23 años de Carlos son de servicio público; su formación inmobiliaria parte en 2022. En su lugar van credenciales por nombre, institución y año (con el Diplomado de Derecho Inmobiliario de la UNAB marcado "en curso").
- **"20+ años", "500+ propiedades evaluadas", "500+ informes emitidos", "100% independiente"**: eliminados. Ninguno era verificable y el último además es falso ahora que el sitio es de corretaje.
- **Barra de confianza** ("Informes con validez para Banco Estado, BCI, Scotiabank, Santander, Banco de Chile, Conservador, Notarías, SII"): eliminada. Afirmaba validez institucional que nadie acreditó y contradecía el descargo.
- **"NCh 3658"** en la página de inicio y **"compatible con requisitos SBIF"**: eliminados. No correspondía invocarlos para una estimación automática.
- **"Perito Tasador Certificado"** y toda mención a "informe oficial con firma de perito" en textos comerciales: eliminados.
- **"No somos corredores. Somos tu filtro de riesgo."**: eliminado del hero y del Open Graph. No se reemplazó por otro lema (queda como texto descriptivo, no como lema).
- **Plan Starter $39.990 / Pro $79.990 / Agencia** en `/corredores`: eliminados. Eran precios sin respaldo; ahora la página explica el programa sin tarifario.
- **Conversión UF→CLP con tasa fija 38.500** en el formulario de publicación: eliminada; se muestra solo el precio en UF.
- **Sección "Due Diligence & Títulos"** de la portada: reducida a una mención breve con enlaces a `cvrtasaciones.cl`, para no duplicar contenido entre dominios.

---

## 7. `src/app/api/seed/route.ts`: qué encontré y qué hice

**Hallazgo.** `POST /api/seed` no tenía autenticación. Cualquiera en internet podía reescribir la tabla `PropertyData` —los precios por m² con los que se calcula la estimación pública— con los valores del repositorio, y el `GET` devolvía conteos por comuna sin credencial.

**Corrección.** La ruta exige ahora `x-admin-password` validada contra `ADMIN_PASSWORD` con comparación en tiempo constante (`src/lib/admin-auth.ts`). Si `ADMIN_PASSWORD` no está definida, o si vale `cvr2025admin` (la clave que estaba publicada en la pantalla de login), el acceso se niega y la respuesta lo dice. Verificado en ejecución: `POST /api/seed` sin cabecera → **401**; con la clave vieja → **401**; `GET /api/admin` sin cabecera → **401**.

**Otras filtraciones corregidas:**
- `GET /api/propiedades` devolvía `contactPhone` de cada publicación a cualquiera que llamara la API. Ya no lo devuelve; el contacto va por formulario.
- `GET /api/admin` devolvía nombre, correo y teléfono de solicitantes y solo estaba protegido por una clave escrita en el código (`cvr2025admin`), publicada además en la propia pantalla de login. Ahora depende solo de `ADMIN_PASSWORD`.
- `POST /api/pagos/confirmar` aceptaba `{simulated: true}` en producción y marcaba el encargo como pagado. Ahora solo se acepta fuera de producción y sin credenciales reales; verificado en ejecución con `next start` (NODE_ENV=production): **403**.

---

## 8. Medidas legales incorporadas

1. **Política de privacidad** en `/privacidad`: responsable identificado, tabla dato→finalidad→base de licitud→conservación, encargados (MercadoPago, correo, hosting/base), transferencias internacionales, derechos de acceso, rectificación, supresión, oposición y portabilidad, canal concreto y mención a la Agencia de Protección de Datos Personales. Marcada como pendiente de revisión legal.
2. **Términos de uso** en `/terminos`: alcance de la información, herramientas referenciales, condiciones del encargo pagado (qué incluye, que el PDF automático no es el producto, plazo y reembolso pendientes), publicación de propiedades, limitación de responsabilidad, propiedad intelectual, ley chilena y jurisdicción en Chillán.
3. **Descargos** en el estimador (arriba y bajo el resultado), en la calculadora y en el diagnóstico.
4. **Consentimiento explícito**: casilla no premarcada en los cuatro formularios (contacto, consulta por ficha, publicación, estimador), con finalidad declarada y enlace a la política. El servidor rechaza la petición si `consentimiento !== true`; verificado con peticiones reales (400).
5. **Minimización**: no se agregaron campos. Propuestas de esquema en la sección 10.
6. **Sin analítica, sin píxeles, sin cookies no esenciales**: no se agregó ninguna; por eso no hay banner.
7. **Datos ya almacenados**: las dos rutas que devolvían datos personales quedaron autenticadas (sección 7).
8. **Fichas**: no se muestran `address`, `contactName`, `contactPhone` ni `contactEmail`. Se muestra sector y comuna, y el contacto se canaliza por `/api/consultas`, que valida que la propiedad exista y esté activa antes de enviar el correo.

---

## 9. Verificaciones ejecutadas (no solo compilación)

Con `next build --webpack` + `next start` en local:

- Las 13 rutas públicas responden **200** y cada una tiene **exactamente un `<h1>`**, título propio y `canonical` en `https://cvrpropiedades.cl`.
- `/no-existe` responde **404** con la página propia y un solo `h1`.
- Ninguna página contiene "Consultoría Predial", "INFORME OFICIAL", "Perito Tasador", "No somos corredores" ni "NCh 3658".
- JSON-LD: `RealEstateAgent` en el layout y `Service` en cada página de servicio; parsean con `json.loads` sin errores.
- Validación de API: consentimiento faltante, nombre corto, correo inválido, tipo inválido, superficie negativa y precio no numérico → **400** con mensaje; payload válido llega a la capa de base (500 por falta de `DATABASE_URL` en este entorno, no por validación).
- **PDF**: generado con un caso de prueba y verificado extrayendo el texto de los streams comprimidos. Una página, título "Estimación referencial de valor", sin "oficial", sin "NCh", sin firma, con el descargo en el encabezado, la muestra, el año y el emisor. El ajuste de línea ahora mide la fuente (`widthOfTextAtSize`) en vez de contar caracteres, para que ninguna línea se salga del margen.

---

## 10. Propuestas de esquema (no migradas)

No se tocó `prisma/schema.prisma`. Si se aprueban:

- `TasacionRequest`: agregar `consentAt DateTime?` y `consentVersion String?` para poder acreditar el consentimiento (hoy solo queda el estado en el navegador y el correo). Sin eso, la base de licitud es difícil de probar.
- `TasacionRequest.estimatedValueCLP` es derivado de `estimatedValueUF` × UF: se puede calcular y no almacenar.
- `PropertyListing`: agregar `moderatedAt`/`moderatedBy` para auditar quién publicó una ficha, y un `slug` estable para URLs legibles.
- Retención: un job que anonimice solicitudes antiguas según el plazo que defina la abogada.
- `paymentId` podría ser `@unique` para evitar dobles confirmaciones.

---

## 11. Lo que no alcancé a hacer / no pude verificar

- **No hay `DATABASE_URL` en este worktree.** Las páginas que leen la base (`/propiedades/[id]`, listado, admin) y los flujos de cálculo, publicación y pago no se ejecutaron contra Postgres/Neon. Compilan, validan entrada y fallan de forma controlada, pero el comportamiento con datos reales queda sin probar. Hay que correrlo en un entorno con base antes de publicar.
- **No pude hacer QA visual en navegador**: la herramienta de navegador bloquea `127.0.0.1`. El responsive se resolvió por CSS (sin anchos fijos, tablas dentro de contenedores con scroll y `role="region"`, `padding` de 16 px a 720 px), pero no hay captura a 375 px que lo demuestre. Recomiendo revisarlo en DevTools antes de publicar.
- **No corrí auditoría automática de accesibilidad** (axe/Lighthouse). Revisé a mano: un `h1`, jerarquía sin saltos, `label`+`htmlFor` en las entradas, `aria-expanded`/`aria-controls` en el menú, errores con `role="alert"`, foco visible global, enlace "saltar al contenido", contraste calculado (texto secundario 9,79:1 y 7,96:1 sobre los fondos usados).
- **Correo no probado**: sin `SMTP_USER`/`SMTP_PASS`, los formularios responden 503 a propósito (mejor que perder la consulta). Falta probar el envío real.
- **Correo de contacto**: se mantuvo `contacto@cvrpropiedades.com` para no romper el canal mientras no exista la casilla en `.cl`. No se usa como URL canónica. Conviene migrarlo y dejarlo en `src/lib/site.ts`.
- **Enlaces a `cvrtasaciones.cl`**: apuntan a los nombres de archivo que existen hoy en el repositorio estático (`estudio-titulos.html`, `due-diligence.html`, `tasacion-comercial.html`, `peritaje-judicial.html`, `paquete-hereditario.html`, `matriz-riesgo-hidrico.html`). Ese repositorio todavía declara `cvrpropiedades.cl` en su HTML; cuando se publique en `cvrtasaciones.cl` hay que confirmar que las rutas se mantengan.
- **Firma del webhook de MercadoPago**: no se valida `x-signature`. Lo dejé anotado en el código; es la siguiente mejora de seguridad del flujo de pagos.
- **Sin tests automatizados**: el repositorio no tiene runner y no agregué dependencias.
