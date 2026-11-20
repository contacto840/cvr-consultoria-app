# Encargo: sitio cvrtasaciones.cl (CVR Tasaciones)

## Contexto

Carlos Vivanco Riquelme es tasador y perito en Chillán, Región de Ñuble, Chile. Opera como CVR Propiedades SpA. Hasta ahora mezclaba nombres de marca; se están separando sus dos líneas de negocio en dos dominios:

- `cvrpropiedades.cl` — operaciones: venta, arriendo, asesoría de compra. **No es este encargo.**
- `cvrtasaciones.cl` — informes firmados por el perito. **Este encargo.**

El repositorio de este encargo es el sitio estático que hoy está en `C:\Users\carlo\Downloads\cvr-website`, publicado con Netlify, repo `github.com/carlosvital84/cvr-website`. Hoy se llama "CVR Propiedades" y su `netlify.toml` apunta a `cvrpropiedades.cl`. Ambas cosas están mal y las corriges tú: el contenido de este sitio es íntegramente pericial y pasa a ser cvrtasaciones.cl.

## Objetivo

Convertir este sitio en el sitio de la línea de informes de CVR, con la marca correcta, el dominio correcto, dos páginas de servicio nuevas, y contenido educativo interactivo que haga que un cliente entienda qué es una tasación y qué va a recibir.

## Marca y dominio

- Marca visible en toda la navegación, títulos y metadatos: **CVR Tasaciones**.
- Descriptor bajo la marca, donde haya espacio para una línea: "Peritajes y tasaciones".
- Pie legal en todas las páginas, exactamente este texto con el RUT como marcador: `CVR Tasaciones es la línea de peritajes y tasaciones de CVR Propiedades SpA · RUT {{RUT_PENDIENTE}} · Chillán, Región de Ñuble`. Deja `{{RUT_PENDIENTE}}` literal; Carlos lo completa.
- Dominio canónico: `cvrtasaciones.cl`. Actualiza `netlify.toml`: la redirección www→sin-www, el comentario de cabecera y cualquier referencia a cvrpropiedades.cl.
- `sitemap.xml` y `robots.txt`: todas las URL con el dominio nuevo. El sitemap solo lista páginas de este sitio.
- Donde hoy diga "CVR Propiedades" refiriéndose a este sitio, pasa a "CVR Tasaciones". **Excepción:** la razón social CVR Propiedades SpA se mantiene tal cual en pies legales y en la política de privacidad, porque es la persona jurídica y no cambia.
- Enlace cruzado: en la navegación o el pie, un enlace a `https://cvrpropiedades.cl` rotulado "Venta y arriendo de propiedades". No construyas ese sitio aquí.

## Páginas existentes (se conservan, se mejoran)

`index.html`, `nosotros.html`, `due-diligence.html`, `estudio-titulos.html`, `matriz-riesgo-hidrico.html`, `peritaje-judicial.html`, `tasacion-comercial.html`, `paquete-hereditario.html`, `contacto.html`, `privacidad.html`, `404.html`.

El copy de estas páginas fue trabajado y auditado por Carlos los días 17 y 20 de noviembre de 2026. **No lo reescribas por gusto.** Su tono es sobrio, directo, sin adornos y sin guiones largos, y las cifras llevan su fuente. Respeta eso. Solo corrige: estructura, accesibilidad, metadatos, jerarquía de encabezados, marca y errores concretos.

## Páginas nuevas (2)

### 1. `tasacion-derechos-agua.html`
Tasación de derechos de aprovechamiento de aguas. Es un servicio en el que Carlos tiene formación específica y hoy no tiene página. Es distinto de `matriz-riesgo-hidrico.html`: la matriz evalúa el riesgo hídrico de un predio que alguien va a comprar; esto valoriza el derecho de agua en sí. Enlaza a la matriz y aclara la diferencia en una línea.

Debe cubrir: qué es un derecho de aprovechamiento, la distinción entre consuntivo y no consuntivo, qué documentación se necesita (inscripción en el Conservador de Bienes Raíces, expediente DGA), y para qué suele pedirse la tasación (compraventa, partición, garantía bancaria, causa judicial).

### 2. `tasacion-renta-arriendo.html`
Tasación de renta de arriendo. Servicio que Carlos ya presta —entregó uno en noviembre de 2026— y que no tiene página. Útil para fijar renta de mercado, para juicios de arrendamiento y para peritajes donde el valor en disputa es la renta, no el inmueble.

## Contenido educativo interactivo (3 módulos)

Esto es el corazón del encargo. El objetivo declarado de Carlos: que el cliente que llega entienda su trabajo y el servicio que recibe. Cada módulo es HTML + CSS + JavaScript propio, sin dependencias externas, sin CDN, funcionando con el `Content-Security-Policy` que ya está en `netlify.toml` (revísalo antes de escribir: `script-src 'self' 'unsafe-inline'`, no hay `connect-src` a terceros salvo formspree).

### Módulo A — "Cómo se llega a un valor" (en `tasacion-comercial.html`)
Explicador de los tres enfoques de tasación: **comparación**, **costo** e **ingreso**. Interactivo: el visitante elige qué tipo de bien quiere tasar (casa habitada, terreno sin construir, local comercial arrendado, predio agrícola) y el módulo muestra qué enfoque pesa más en ese caso y por qué, en dos o tres frases por enfoque.

### Módulo B — "Tasación, avalúo fiscal y tasación bancaria no son lo mismo" (en `index.html` o página propia)
Es la confusión más común de sus clientes y le cuesta explicaciones en cada encargo. Comparación de tres columnas: quién la hace, para qué sirve, quién la acepta, y por qué los tres números son distintos sin que ninguno esté equivocado. Sobrio, sin desacreditar al SII ni a los bancos.

### Módulo C — "Conversor de turnos de riego" (en `tasacion-derechos-agua.html`)
Calculadora: el visitante ingresa su turno de riego (horas por ciclo, duración del ciclo en días, caudal del canal) y obtiene el caudal equivalente en litros por segundo y su proporción del canal. Es un cálculo que los clientes de aguas no saben hacer y es la razón por la que llegarían a este sitio.

Reglas para los tres módulos:
- Muestra siempre la fórmula o el criterio usado, no solo el resultado.
- Cierra con un descargo visible: es una orientación referencial y no sustituye un informe de tasación firmado.
- Funciona con teclado y es legible en un teléfono.
- Si JavaScript está deshabilitado, el contenido explicativo sigue siendo legible; lo que se pierde es solo la interacción.

## Restricción dura: normas y derechos de autor

Carlos trabaja bajo NCh 3658/1:2021 (Tasación de bienes, obligaciones y derechos — Parte 1), NCh 3658/2:2022 e IVS 2025. Tiene los PDF en `C:\Users\carlo\Downloads\Normas INN`.

**No los abras para copiar texto y no los uses como fuente de redacción.** El PDF de la NCh es una copia con licencia de un solo usuario emitida a nombre de un tercero (Transsa Consultores Inmobiliarios SpA) y prohíbe expresamente la reproducción y la publicación en internet. El IVS 2025 trae la misma cláusula del IVSC.

Lo que sí puedes hacer:
- Citar las normas por número y título, como referencia bibliográfica. Ejemplo admitido: "Los informes se emiten conforme a NCh 3658/1:2021 y a las Normas Internacionales de Valuación (IVS) 2025."
- Explicar los conceptos profesionales con palabras propias. Los tres enfoques de tasación (comparación, costo, ingreso) son conceptos del oficio y los puedes explicar libremente.

Lo que no:
- Nada de texto literal de las normas, ni párrafos, ni definiciones transcritas, ni capturas de los PDF, ni los PDF subidos al sitio.
- **Ninguna cita normativa inventada.** No atribuyas a una norma un número de cláusula, una exigencia o una definición que no puedas respaldar. Si no estás seguro de qué dice una norma, no lo afirmes: describe la práctica profesional sin colgarla de un artículo. Una cita falsa en el sitio de un perito que declara en tribunales es un daño real, no un detalle.

## Estándar técnico (criterio de "terminado")

Verificable, en todas las páginas:

1. Un solo `<h1>` por página, sin saltos de nivel de encabezado.
2. Contraste de texto conforme WCAG 2.2 AA: 4.5:1 en texto normal, 3:1 en texto grande.
3. Navegación completa con teclado, con indicador de foco visible. Todo control interactivo alcanzable con Tab.
4. Toda imagen con `alt` que describa su contenido; `alt=""` si es decorativa.
5. En teléfono (375 px de ancho) no hay desborde horizontal; margen lateral de 16 px.
6. `<title>`, `meta description` y Open Graph propios y distintos en cada página. Ninguno heredado ni duplicado.
7. Datos estructurados `schema.org` válidos: `LocalBusiness` en el sitio y `Service` en cada página de servicio, con el nombre de marca correcto.
8. Un solo `<main>` por página, con `<nav>`, `<header>` y `<footer>` correctamente usados.
9. Formularios: toda entrada con su `<label>` asociada, y mensajes de error que se anuncien a un lector de pantalla.
10. Sin enlaces rotos internos. Verifícalos.
11. El `Content-Security-Policy` de `netlify.toml` se respeta: si un módulo necesita algo que la política no permite, ajusta la política de forma mínima y justifica el cambio en el informe, no la aflojes.
12. HTML válido. Sin etiquetas sin cerrar ni atributos duplicados.

## Lo que está prohibido

- **No inventes testimonios de clientes.** Si encuentras testimonios en el código y no hay evidencia de que sean reales, elimínalos y anótalo. No redactes nuevos.
- **No inventes cifras.** Ni años de experiencia, ni cantidad de informes emitidos, ni plazos, ni precios. Si una cifra existe en el sitio actual, se mantiene; si falta una cifra, deja `{{PENDIENTE: descripción}}` y anótalo.
- No agregues dependencias, frameworks ni CDN. Este sitio es HTML, CSS y JavaScript propio, y así se queda.
- No cambies el stack a Next.js ni a ningún generador de sitios.
- No toques el repositorio `cvr_consultoria_app`. Es otro encargo.
- **No despliegues, no hagas push, no borres nada fuera del alcance.** Trabajas en un worktree aislado. Publicar lo decide Carlos.

## Qué entregar

En tu rama, dentro del worktree:

1. Todos los archivos modificados y los nuevos.
2. Un archivo `INFORME-HERMES.md` en la raíz del worktree con:
   - Lista de archivos creados y modificados, uno por línea, con qué cambió en cada uno.
   - Lista de los `{{PENDIENTE: ...}}` que dejaste y qué necesita decidir Carlos en cada uno.
   - Qué eliminaste y por qué, en particular testimonios o cifras sin respaldo.
   - Cómo verificaste el contraste, la jerarquía de encabezados y los enlaces: con qué herramienta o comando, y el resultado.
   - Qué no alcanzaste a hacer, si algo quedó fuera.

No afirmes haber hecho algo que no hiciste. Tu informe se audita contra el diff y contra el disco, archivo por archivo.
