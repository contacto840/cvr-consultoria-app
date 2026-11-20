# Encargo: sitio cvrpropiedades.cl (CVR Propiedades)

## Contexto

Carlos Vivanco Riquelme es tasador, perito y corredor en Chillán, Región de Ñuble, Chile. Opera como CVR Propiedades SpA. Se están separando sus dos líneas de negocio en dos dominios:

- `cvrtasaciones.cl` — informes firmados por el perito: tasaciones, peritajes judiciales, derechos de agua, estudio de títulos, due diligence. Es el sitio estático del repo `cvr-website`. **No es este encargo.**
- `cvrpropiedades.cl` — operaciones: venta, arriendo, asesoría de compra, corredores asociados. **Este encargo.**

El repositorio de este encargo es `C:\Users\carlo\Desktop\cvr_consultoria_app`: Next.js 16.2.6, React 19.2.4, Prisma 7 con PostgreSQL en Neon, MercadoPago, desplegado en Vercel. Hoy se presenta como "CVR Consultoría Predial" y ese nombre se jubila.

## Antes de escribir una línea de código: lee la documentación

Este proyecto corre **Next.js 16.2.6**, que tiene cambios de API respecto de versiones anteriores. Tu conocimiento previo de Next.js está desactualizado y te va a hacer escribir código que no compila o que compila y se comporta distinto.

La documentación de la versión exacta instalada está en `node_modules/next/dist/docs/`. Es obligatorio leer la guía correspondiente antes de tocar cada área. Está exigido en el `AGENTS.md` del repo. Las que vas a necesitar:

- `01-app/01-getting-started/03-layouts-and-pages.md`
- `01-app/01-getting-started/04-linking-and-navigating.md`
- `01-app/01-getting-started/05-server-and-client-components.md`
- `01-app/01-getting-started/06-fetching-data.md`
- `01-app/01-getting-started/07-mutating-data.md`
- `01-app/01-getting-started/14-metadata-and-og-images.md`
- `01-app/01-getting-started/15-route-handlers.md`
- `01-app/02-guides/forms.md`
- `01-app/02-guides/json-ld.md`
- `01-app/03-api-reference/` para cualquier API puntual

Hay una advertencia explícita en el índice de esa documentación: si trabajas en navegación lenta del lado cliente, `Suspense` no basta, hay que exportar `unstable_instant` desde la ruta, y está documentado en `01-app/02-guides/instant-navigation.md`. Léela si tocas navegación.

**Nota de build en worktree:** Turbopack no compila dentro de un worktree de git por el enlace de `node_modules`. Para verificar el build ahí usa `npx next build --webpack`.

## PRIORIDAD 1 — Riesgo profesional que hay que corregir primero

Esto es lo más importante del encargo y va antes que cualquier mejora visual.

El archivo `src/lib/pdf-generator.ts` genera automáticamente un PDF que:

1. Se titula **"INFORME OFICIAL DE TASACIÓN"**.
2. Afirma: *"Este informe fue elaborado bajo los criterios de la Norma Chilena NCh 3658 de Tasación de Bienes"*.
3. Imprime un bloque de firma con **"Carlos Vivanco R. — Perito Tasador Certificado"**.
4. Y a la vez, en el cuerpo, dice que los valores son referenciales y *"no reemplazan una tasación formal in situ"*.

Ese documento se emite sin inspección del inmueble, sin homologación de comparables y sin que el perito lo revise: sale de una consulta a una tabla de valores por comuna. Las cuatro afirmaciones juntas son insostenibles y se contradicen entre sí. Carlos declara como perito en causas civiles en curso; un documento auto-emitido con su firma impresa, titulado "oficial" y que invoca una norma que no se aplicó, es material directo para que una contraparte ataque su credibilidad en cualquier causa.

**Correcciones obligatorias:**

- El título del PDF pasa de "INFORME OFICIAL DE TASACIÓN" a **"ESTIMACIÓN REFERENCIAL DE VALOR"**. En ninguna parte del documento, de la interfaz ni de los metadatos puede aparecer la palabra "oficial" aplicada a este PDF automático.
- **Elimina la mención a NCh 3658.** No la reemplaces por otra norma. En su lugar, describe con exactitud lo que sí se hizo: una estimación a partir de valores de referencia por comuna, sector, tipo de propiedad y estado, con la fecha de actualización de esos valores y el tamaño de la muestra, datos que ya están en el modelo `PropertyData` (`referenceYear`, `sampleSize`). Decir la verdad concreta es más creíble que invocar una norma.
- **Elimina el bloque de firma del perito** de este PDF automático. Un documento que nadie revisó no lleva la firma de nadie. En su lugar, un pie que identifique a CVR Propiedades SpA como emisor del cálculo.
- Elimina "Perito Tasador Certificado" de este PDF. Si en otra parte del sitio se describe la calificación profesional de Carlos, tiene que ser verificable y él debe confirmar el texto exacto. Deja `{{PENDIENTE: calificación profesional exacta, confirmar con Carlos}}`.
- Un descargo en el encabezado, no enterrado al final: esta estimación no constituye una tasación, no sirve para trámites bancarios, judiciales, hereditarios ni de compraventa, y para eso se requiere un informe de tasación con inspección y firma.
- En `src/app/tasacion/page.tsx`, el flujo de pago (línea 232 y siguientes) promete que *"nuestro perito técnico elaborará y firmará su Informe Oficial de Tasación"*. Si esa promesa se mantiene, lo que el cliente compra es un **encargo de tasación que Carlos ejecuta a mano**, no una descarga automática. Deja claro en la interfaz que tras el pago hay un trabajo humano con un plazo, y que el PDF automático no es el producto comprado. No se entrega ningún documento firmado sin que Carlos lo haya hecho.
- Marca `{{PENDIENTE: ...}}` cualquier texto cuya veracidad no puedas verificar, y anótalo en tu informe. No lo resuelvas inventando.

## PRIORIDAD 2 — Marca y dominio

- Marca visible en toda la navegación, títulos y metadatos: **CVR Propiedades**.
- **"CVR Consultoría Predial" se elimina del sitio por completo.** No está en la papelería ni en los informes de Carlos; es un cuarto nombre que no aporta. Reemplázalo por CVR Propiedades en todas sus apariciones, incluido el PDF.
- Pie legal en todas las páginas: `CVR Propiedades SpA · RUT {{RUT_PENDIENTE}} · Chillán, Región de Ñuble`. Deja el marcador literal.
- Dominio canónico: `cvrpropiedades.cl`. En `src/app/layout.tsx` el JSON-LD usa `https://cvrpropiedades.com`: cámbialo a `https://cvrpropiedades.cl` en el `@id`, en `metadataBase` y en cualquier otra referencia. El `.com` queda solo como redirección y no se usa como canónico.
- **Elimina el lema "No somos corredores. Somos tu filtro de riesgo."** del Open Graph y de donde aparezca. Este sitio pasa a ser precisamente el de corretaje y el lema ahora es falso. Si hace falta un lema, deja `{{PENDIENTE: lema, confirmar con Carlos}}`; no inventes uno.
- Enlace cruzado: en la navegación y el pie, un enlace a `https://cvrtasaciones.cl` rotulado "Tasaciones y peritajes". Y en los puntos del recorrido donde el cliente lo necesita de verdad: en una ficha de propiedad, un enlace a "estudio de títulos antes de comprar"; al final del estimador de valor, "pedir una tasación con firma".

## PRIORIDAD 3 — Reparto de contenido

Este sitio se queda con las operaciones. Hoy no tiene contenido escrito de corretaje, solo la aplicación.

**Se queda y se desarrolla:**
- Listado y fichas de propiedades en venta y arriendo (modelo `PropertyListing`, ya soporta `transactionType` venta/arriendo y `status`).
- Portal de corredores asociados (`src/app/corredores/page.tsx`).
- Panel de administración (`src/app/admin/page.tsx`).
- El estimador de valor referencial, corregido según la Prioridad 1, replanteado como herramienta de orientación para quien quiere vender o comprar, no como producto pericial.

**Páginas nuevas de servicio (3):**
1. **Venta de propiedades** — qué hace CVR por quien vende: cómo se fija el precio de lista, qué incluye la gestión, honorarios (`{{PENDIENTE: honorarios}}`).
2. **Arriendo y administración** — para propietarios que arriendan: selección de arrendatario, contrato, administración mensual.
3. **Asesoría de compra** — acompañamiento al comprador: qué se revisa antes de firmar, y derivación a cvrtasaciones.cl para el estudio de títulos y el due diligence. Este es el servicio que justifica el alto ticket y es el que conecta las dos líneas.

**Se saca de este sitio:** nada de lo pericial se desarrolla aquí. Si hay texto sobre due diligence o estudio de títulos (por ejemplo la sección "Due Diligence & Títulos" de la página de inicio), se reduce a una mención breve con enlace a cvrtasaciones.cl, donde vive ese servicio. No se duplica el contenido: dos sitios con el mismo texto se compiten entre sí en buscadores.

## PRIORIDAD 4 — Contenido educativo interactivo (2 módulos)

El objetivo declarado de Carlos: que el cliente que llega entienda su trabajo y el servicio que recibe. Componentes de React propios, sin dependencias nuevas.

### Módulo A — Calculadora de costos reales de compra
El comprador ingresa el precio de la propiedad y obtiene el desglose de lo que realmente va a desembolsar: impuesto al mutuo si hay crédito, gastos notariales, inscripción en el Conservador de Bienes Raíces, corretaje, y el total sobre el precio.

Regla dura: **cada ítem muestra su fuente y la fecha del dato**, y los porcentajes y aranceles van en un único archivo de constantes, no esparcidos por el código, para que se puedan actualizar cuando cambien. Si no tienes un arancel con certeza, deja `{{PENDIENTE: arancel X}}` y anótalo. No inventes aranceles ni tasas: un número equivocado aquí es una queja de un cliente que presupuestó mal.

### Módulo B — Diagnóstico de riesgo de un predio, en diez preguntas
Cuestionario breve sobre la propiedad que alguien está pensando comprar: si está inscrita a nombre del vendedor, si hay herencia de por medio, si tiene derechos de agua, si hay servidumbres o construcciones sin recepción municipal, si el deslinde está claro. Al final, un semáforo por área y, según el resultado, qué informe corresponde pedir, con enlace a la página de cvrtasaciones.cl que corresponda.

Es la mejor herramienta de captación que puede tener, porque le llega el cliente con el problema ya identificado. No debe dar un veredicto legal: entrega señales de alerta y recomienda qué revisar.

Reglas para los dos módulos:
- Muestra siempre el criterio o la fórmula usada, no solo el resultado.
- Cierra con un descargo visible: es una orientación referencial y no sustituye un informe profesional.
- Funciona con teclado, es legible en teléfono, y el estado se mantiene al retroceder.

## Restricción dura: normas y derechos de autor

Carlos trabaja bajo NCh 3658/1:2021, NCh 3658/2:2022 e IVS 2025, y tiene los PDF en `C:\Users\carlo\Downloads\Normas INN`.

**No los abras para copiar texto y no los uses como fuente de redacción.** El PDF de la NCh es una copia con licencia de un solo usuario emitida a nombre de un tercero (Transsa Consultores Inmobiliarios SpA) y prohíbe expresamente la reproducción y la publicación en internet. El IVS 2025 trae la misma cláusula del IVSC.

- Puedes citar las normas por número y título como referencia bibliográfica, pero **solo donde sea verdad que se aplicaron**, es decir, nunca en el PDF automático (ver Prioridad 1).
- Puedes explicar conceptos profesionales con palabras propias.
- Nada de texto literal, definiciones transcritas, capturas ni los PDF subidos al sitio.
- **Ninguna cita normativa inventada.** No atribuyas a una norma una cláusula, exigencia o definición que no puedas respaldar. Si no estás seguro, describe la práctica sin colgarla de un artículo.

## Estándar técnico (criterio de "terminado")

1. `npx next build --webpack` termina sin errores ni advertencias nuevas.
2. `npm run lint` sin errores ni advertencias. El repo quedó limpio en el commit `3bbb005`; no lo vuelvas a ensuciar.
3. TypeScript compila sin errores. Sin `any` nuevos y sin `@ts-ignore`.
4. Un solo `<h1>` por página, sin saltos de nivel de encabezado.
5. Contraste conforme WCAG 2.2 AA: 4.5:1 en texto normal, 3:1 en texto grande.
6. Navegación completa con teclado, con foco visible. Todo control alcanzable con Tab.
7. En teléfono (375 px) no hay desborde horizontal; margen lateral de 16 px.
8. `metadata` propia y distinta por ruta, usando la API de metadatos de Next 16 según la guía citada arriba. Ninguna heredada ni duplicada.
9. JSON-LD válido: `RealEstateAgent` para el sitio, `Service` por página de servicio, `Offer` en las fichas de propiedad. Sigue `01-app/02-guides/json-ld.md`.
10. Formularios con `<label>` asociada en cada entrada y errores anunciados a lectores de pantalla. Sigue `01-app/02-guides/forms.md`.
11. Sin claves ni secretos en el código. Todo por variable de entorno, y `.env.example` actualizado si agregas alguna.
12. Las rutas de API validan su entrada antes de tocar la base de datos. Revisa en particular `src/app/api/seed/route.ts`: si una ruta puede reinicializar datos y es alcanzable sin autenticación, protégela o elimínala, y dilo en el informe.
13. Sin enlaces internos rotos.

## Lo que está prohibido

- **No inventes testimonios.** `src/app/page.tsx` tiene una sección "Lo que dicen nuestros clientes". Si no hay evidencia de que sean reales y autorizados, elimínala y anótalo. No redactes testimonios nuevos.
- **No inventes cifras.** La página dice "Más de 20 años": si no puedes verificarla, cámbiala a `{{PENDIENTE: años de experiencia, confirmar}}` y anótalo. Lo mismo con precios, plazos, cantidad de informes y aranceles.
- No agregues dependencias nuevas sin justificarlo en el informe. Nada de bibliotecas de componentes ni de animación.
- No cambies la versión de Next, React ni Prisma. No ejecutes `next upgrade`.
- No modifiques el esquema de Prisma sin decirlo; si una página nueva necesita un campo, propónlo en el informe en vez de migrar la base por tu cuenta.
- No toques `.env`, `.vercel/` ni la configuración de despliegue.
- No toques el repositorio `cvr-website`. Es otro encargo.
- **No despliegues, no hagas push, no borres nada fuera del alcance.** Trabajas en un worktree aislado. Publicar lo decide Carlos.

## Credenciales y cifras: usa solo el archivo curado

Las credenciales académicas de Carlos y las reglas para redactarlas están en `docs/credenciales-publicables.md` de este mismo repositorio. **Es tu única fuente.** Léelo completo antes de escribir cualquier mención a formación o experiencia.

**No entres a `C:\Users\carlo\Desktop\certificaciones y diplomas` ni a `C:\Users\carlo\Desktop\Credenciales_2026`.** Contienen certificado de antecedentes, certificado de nacimiento, hoja de vida del conductor, declaración de renta y el RUN personal de Carlos. No los abras, no los copies, no los referencies.

Tres reglas de ese archivo que te repito porque son las que más fácil se incumplen:

1. **El texto actual "Más de 20 años asegurando inversiones inmobiliarias" se elimina.** Los 23 años de trayectoria de Carlos son de servicio público, no de tasación ni de corretaje. Su formación inmobiliaria parte en 2022. No lo reemplaces por "23 años" ni por ninguna variante que insinúe experiencia inmobiliaria de esa extensión.
2. **Nunca "Perito Tasador Certificado".** Usa la fórmula verificable del archivo curado.
3. **El Diplomado en Derecho Inmobiliario de la UNAB va como "en curso"**, porque el respaldo es un certificado de alumno regular, no de egreso.

En lugar de una cifra de años, la credibilidad de este sitio se construye con las credenciales por nombre, institución y año, que el archivo curado lista y que un cliente puede verificar.

## Casos y testimonios: anonimizados, y verdaderos

Carlos no publica casos de clientes identificables; sus clientes son privados y eso no se negocia. La sección "Lo que dicen nuestros clientes" de `src/app/page.tsx` se elimina salvo que encuentres evidencia de que los testimonios son reales y autorizados por escrito, lo que es improbable. No redactes testimonios nuevos.

Si construyes casos para ilustrar un servicio:

- **Caso anonimizado:** admitido si los hechos son reales y los datos están alterados de modo que no se pueda reidentificar a nadie. No basta quitar el nombre: cambia o agrupa la comuna, el rol de avalúo, la superficie exacta, los montos exactos y las fechas exactas.
- **Ejemplo construido:** admitido, pero **rotulado visiblemente como ejemplo**. No se presenta un caso inventado como si fuera real.
- Prohibido cualquier dato que provenga de un encargo real: direcciones, roles, nombres de partes, números de causa, montos.

## Medidas legales de protección

Carlos pidió expresamente las medidas que protejan a la empresa y a los sitios. Implementa:

1. **Política de privacidad conforme a la Ley 21.719** de protección de datos personales, como ruta propia. Este sitio recoge más datos que el otro —nombre, correo, teléfono y datos de la propiedad en el formulario de tasación, además de los pagos— así que la política tiene que ser precisa: identificación del responsable (CVR Propiedades SpA), finalidad de cada dato, base de licitud, plazo de conservación, destinatarios (menciona MercadoPago como procesador de pagos y el servicio de correo), transferencias si las hay, y los derechos del titular (acceso, rectificación, supresión, oposición y portabilidad) con el canal concreto para ejercerlos.
2. **Términos de uso**, ruta propia enlazada desde el pie: alcance de la información, que las herramientas interactivas son referenciales y no constituyen tasación ni asesoría legal ni financiera, condiciones del servicio pagado (qué incluye, plazo, política de reembolso), limitación de responsabilidad, propiedad intelectual, y ley aplicable y jurisdicción chilenas.
3. **Descargo en cada módulo interactivo y en el estimador de valor**, visible sin desplazar: resultado referencial, no sustituye un informe firmado, no sirve para trámites bancarios, judiciales ni de compraventa.
4. **Consentimiento explícito en los formularios:** casilla no pre-marcada, con la finalidad declarada y enlace a la política de privacidad. Esto es especialmente importante en el formulario de tasación, que recoge datos de contacto y de un inmueble.
5. **Minimiza la recolección.** Revisa el modelo `TasacionRequest`: si algún campo no es necesario para prestar el servicio, deja de pedirlo. Propón en el informe los campos que sobran; no migres la base por tu cuenta.
6. **Nada de analítica de terceros, nada de píxeles de redes sociales, nada de cookies no esenciales.** Si no hay cookies no esenciales no se necesita banner de consentimiento. No agregues ninguna.
7. **Protege los datos ya almacenados:** la base contiene nombres, correos y teléfonos de solicitantes reales. Verifica que ninguna ruta de API los exponga sin autenticación. Revisa en particular `src/app/api/admin/route.ts` y `src/app/api/seed/route.ts`. Si una ruta devuelve datos personales sin autenticar, es una filtración y se corrige en este encargo: dilo en el informe con el detalle.
8. **Fichas de propiedad:** el modelo `PropertyListing` tiene `address`, `contactName`, `contactPhone` y `contactEmail`. Decide y documenta qué se muestra en público. La dirección exacta de una propiedad habitada y el teléfono personal de un propietario no van en una página pública indexable: muestra sector y comuna, y canaliza el contacto por un formulario.

Anota en tu informe todo lo que implementaste en este punto. Esto lo tiene que revisar la abogada de Carlos antes de publicar; tú dejas el texto redactado y señalado como pendiente de revisión legal, no lo das por cerrado.

## Qué entregar

En tu rama, dentro del worktree:

1. Todos los archivos modificados y los nuevos.
2. Un archivo `INFORME-HERMES.md` en la raíz del worktree con:
   - Lista de archivos creados y modificados, uno por línea, con qué cambió en cada uno.
   - **Qué hiciste exactamente con la Prioridad 1**, afirmación por afirmación de las cuatro listadas, y en qué archivo y línea quedó cada corrección.
   - Qué guías de `node_modules/next/dist/docs/` leíste, por ruta de archivo.
   - La salida de `npx next build --webpack` y de `npm run lint`, pegada.
   - Lista de los `{{PENDIENTE: ...}}` que dejaste y qué necesita decidir Carlos en cada uno.
   - Qué eliminaste y por qué, en particular testimonios y cifras sin respaldo.
   - Qué encontraste en `src/app/api/seed/route.ts` y qué hiciste.
   - Qué no alcanzaste a hacer, si algo quedó fuera.

No afirmes haber hecho algo que no hiciste. Tu informe se audita contra el diff y contra el disco, archivo por archivo, y el build se vuelve a correr.
