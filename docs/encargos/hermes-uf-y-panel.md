# Encargo: valor de la UF desde fuente oficial, y panel interno con la estética del sitio

## Contexto

Repositorio: `C:\Users\carlo\Desktop\cvr_consultoria_app`. Es el sitio `cvrpropiedades.cl` de CVR Propiedades SpA (Carlos Vivanco Riquelme, Chillán, Región de Ñuble). Next.js 16.2.6, React 19.2.4, Prisma 7 con PostgreSQL en Neon, MercadoPago, Vercel.

El sitio se reorientó al corretaje en un encargo anterior, ya integrado en `main`. Quedaron dos cosas pendientes que son trabajo, no decisiones de Carlos, y son este encargo. Son independientes entre sí; haz las dos.

## Antes de escribir una línea de código: lee la documentación

Este proyecto corre **Next.js 16.2.6**, con cambios de API respecto de versiones anteriores. Tu conocimiento previo está desactualizado. La documentación de la versión exacta instalada está en `node_modules/next/dist/docs/`, y es obligatorio leerla antes de tocar cada área. Lo exige el `AGENTS.md` del repo.

Para la parte 1, lee sí o sí, porque es donde más ha cambiado la API:
- `01-app/01-getting-started/06-fetching-data.md`
- `01-app/01-getting-started/08-caching.md`
- `01-app/01-getting-started/09-revalidating.md`
- `01-app/02-guides/how-revalidation-works.md`
- `01-app/02-guides/incremental-static-regeneration.md`

Para la parte 2:
- `01-app/01-getting-started/05-server-and-client-components.md`
- `01-app/01-getting-started/11-css.md`
- `01-app/02-guides/forms.md`

**Nota de build en worktree:** Turbopack no compila dentro de un worktree de git por el enlace de `node_modules`. Usa `npx next build --webpack`.

**Nota de caché:** si el build falla con un error de tipos que menciona una ruta que ya no existe, borra `.next` y vuelve a construir. Son artefactos de una estructura anterior, no un defecto del código.

---

## Parte 1 — El valor de la UF

### El problema

`src/lib/seed-data.ts` tiene `export const UF_VALUE_CLP = 38500;`. Es una constante escrita a mano. Con ella se convierten a pesos:

- el resultado del estimador de valor (`src/components/estimador.tsx`),
- el PDF de estimación referencial (`src/lib/pdf-generator.ts`, campo `ufValueCLP`),
- lo que se despacha al cliente (`src/lib/fulfill.ts`).

La UF cambia todos los días. Una constante se desvía sin que nadie lo note, y el error crece con el tiempo: en una propiedad de 3.000 UF, cien pesos de desvío en la UF son 300.000 pesos de diferencia en la cifra que ve el cliente. El estimador ya advierte que usa "una UF fija de referencia", pero advertirlo no arregla que el número esté mal.

### Qué hay que hacer

Obtener el valor de la UF del día desde una **fuente oficial chilena**, y usarlo en los tres lugares.

Requisitos, en orden de importancia:

1. **La fuente tiene que ser oficial y quedar documentada en el código**: el Banco Central de Chile o el Servicio de Impuestos Internos. No uses un agregador de terceros sin decirlo; si por alguna razón técnica no hay otra opción, dilo en el informe con el motivo y deja el agregador claramente identificado en un comentario, para que Carlos decida.
2. **Si el valor no se puede obtener, no se inventa y no se usa el último conocido sin decirlo.** El comportamiento correcto cuando falla la fuente es **mostrar solo UF y no pesos**, en pantalla y en el PDF, con una línea que diga que la conversión a pesos no está disponible en ese momento. Una cifra en pesos silenciosamente desactualizada es peor que no mostrarla: el cliente la toma como buena.
3. **Toda cifra en pesos lleva visible el valor de UF usado y su fecha.** Ya hay un texto parecido en el estimador; ahora tiene que decir la verdad, con la fecha real del valor.
4. **Se consulta una vez al día, no en cada visita.** Usa el mecanismo de revalidación de Next 16 que corresponda según las guías citadas arriba. No consultes la fuente desde el navegador del visitante: la conversión se hace en el servidor.
5. **Si la fuente exige una clave** (el Banco Central la pide para su API de series), **no la inventes ni la pidas a Carlos en el código**. Déjala como variable de entorno documentada en `.env.example`, y haz que el código caiga en el comportamiento del punto 2 mientras no esté configurada. Anótalo en el informe como pendiente para Carlos.
6. La constante `UF_VALUE_CLP` deja de usarse como fuente de verdad. Si la necesitas como último recurso para pruebas, que quede claro en el nombre y que nunca alimente una cifra mostrada al cliente.

### Lo que no hay que hacer

- No agregues dependencias para esto. `fetch` y lo que trae Next bastan.
- No cambies la fórmula del estimador ni los valores de referencia por m². Solo la conversión a pesos.
- No toques las correcciones del PDF del encargo anterior: sigue titulándose "ESTIMACIÓN REFERENCIAL DE VALOR", sin mención a ninguna norma y sin firma. Si el valor de UF no está disponible, el PDF se emite igual, con el valor en UF y sin la línea en pesos.

---

## Parte 2 — Panel interno con la estética del sitio

### El problema

`src/app/admin/page.tsx` y `src/app/propiedades/agregar/page.tsx` quedaron funcionando pero con la estética anterior: no usan `src/components/site-header.tsx` ni `src/components/site-footer.tsx`, ni las clases del sistema visual que quedó en `src/app/globals.css`. Se ven como de otro sitio.

### Qué hay que hacer

Llevar las dos páginas al mismo sistema visual del resto, **sin cambiar lo que hacen**.

1. Usa las clases y los componentes que ya existen. No inventes un sistema visual nuevo ni dupliques estilos: si falta una clase, agrégala a `globals.css` siguiendo las convenciones que ya están ahí.
2. **La autenticación no se toca.** `src/lib/admin-auth.ts` falla cerrado, rechaza la clave filtrada `cvr2025admin` y compara en tiempo constante. Eso se queda exactamente como está. Si al reordenar la interfaz algo del flujo de login cambia de lugar, verifica que seguir sin `ADMIN_PASSWORD` configurada siga negando el acceso.
3. **El panel es interno, así que no se indexa.** Verifica que `/admin` y `/propiedades/agregar` queden fuera del sitemap y bloqueadas en `robots`. Si ya lo están, dilo; si no, arréglalo.
4. Mismo estándar que el resto del sitio, y es verificable:
   - un solo `<h1>` por página, sin saltos de nivel;
   - contraste WCAG 2.2 AA: 4.5:1 en texto normal, 3:1 en texto grande;
   - navegable completo con teclado, con foco visible;
   - a 375 px de ancho no hay desborde horizontal, con 16 px de margen lateral;
   - cada campo con su `<label>` asociada y los errores anunciados a lectores de pantalla;
   - los contenedores con `overflow-x` llevan `role="region"`, `tabIndex={0}` y `aria-label`, como ya quedaron los demás.
5. Los formularios de carga de propiedades son largos: agrúpalos en secciones con `<fieldset>` y `<legend>`, y que los errores de validación aparezcan junto al campo que falla, no solo arriba.

### Lo que no hay que hacer

- No cambies el esquema de Prisma. Si crees que falta un campo, propónlo en el informe.
- No cambies qué datos se guardan ni qué devuelve cada ruta de API.
- **No publiques en estas páginas la dirección exacta ni el teléfono del propietario en ninguna vista alcanzable sin autenticación.** Dentro del panel autenticado sí se ven, porque Carlos los necesita.

---

## Prohibido en todo el encargo

- **No resuelvas ningún marcador `{{PENDIENTE: ...}}`.** Son 19 decisiones que Carlos está contestando en `docs/datos-pendientes.md`. Déjalos todos tal cual. La única excepción es el de la UF (`{{PENDIENTE: automatizar el valor de la UF con la fuente oficial}}` en `src/components/estimador.tsx`), que es justamente la parte 1 y desaparece al resolverla.
- **No toques `docs/`.** Ni el formulario de datos pendientes, ni los encargos, ni las credenciales. Son documentos de Carlos y míos.
- **No inventes cifras ni citas.** Ni valores de UF, ni aranceles, ni normas, ni años de experiencia. Si un dato no lo puedes verificar, deja `{{PENDIENTE: descripción}}` y anótalo.
- No cambies la versión de Next, React ni Prisma. No ejecutes `next upgrade`.
- No toques `.env`, `.vercel/` ni la configuración de despliegue.
- **No despliegues, no hagas push, no borres nada fuera del alcance.** Trabajas en un worktree aislado. Publicar lo decide Carlos.

## Criterio de terminado

1. `npx next build --webpack` sin errores ni advertencias nuevas.
2. `npx eslint .` sin errores ni advertencias.
3. `npx tsc --noEmit` sin errores. Sin `any` nuevos y sin `@ts-ignore`.
4. El estimador y el PDF muestran el valor de UF usado con su fecha, y cuando la fuente no responde muestran solo UF, sin pesos.
5. `/admin` y `/propiedades/agregar` con la estética del sitio, sin desborde a 375 px, y el acceso sigue negado sin `ADMIN_PASSWORD`.

## Qué entregar

En tu rama, dentro del worktree:

1. Los archivos modificados y los nuevos.
2. Un `INFORME-HERMES.md` en la raíz del worktree con:
   - archivos creados y modificados, uno por línea, con qué cambió en cada uno;
   - **qué fuente de UF elegiste, su URL exacta, si exige clave, y qué pasa cuando no responde**, con el archivo y la línea donde está cada cosa;
   - cómo probaste el caso de fallo de la fuente: no basta con que funcione cuando responde;
   - qué guías de `node_modules/next/dist/docs/` leíste, por ruta;
   - la salida pegada de `next build --webpack`, `eslint` y `tsc --noEmit`;
   - si `/admin` y `/propiedades/agregar` ya estaban fuera del sitemap y de `robots`, o si lo arreglaste;
   - cómo verificaste contraste, encabezados y los 375 px: con qué comando o herramienta, y el resultado;
   - una observación, sin cambiarla: el panel manda la clave en una cabecera `x-admin-password` desde el cliente y la guarda en el estado de React. Dime si eso te parece sostenible y qué harías, pero **no lo modifiques en este encargo**;
   - qué no alcanzaste a hacer.

No afirmes haber hecho algo que no hiciste. Tu informe se audita contra el diff y contra el disco, archivo por archivo, el build se vuelve a correr y las páginas se prueban en un navegador a 375 px. En el encargo anterior declaraste cero problemas de estructura y había una página que desbordaba a 686 px, y afirmaste que una clave estaba publicada en la pantalla de login cuando no lo estaba. Lo que no puedas comprobar, dilo como no comprobado.
