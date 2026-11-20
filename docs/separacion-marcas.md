# Separación de marcas: cvrpropiedades.cl y cvrtasaciones.cl

Documento de alcance. Fecha: 20 de noviembre de 2026.
Estado: **propuesta pendiente de visto bueno de Carlos Vivanco.**

---

## 1. Punto de partida (lo que existe hoy)

| | `cvr_consultoria_app` | `cvr-website` |
|---|---|---|
| Ubicación | `C:\Users\carlo\Desktop\cvr_consultoria_app` | `C:\Users\carlo\Downloads\cvr-website` |
| Stack | Next.js 16.2.6, React 19, Prisma 7 + Neon, MercadoPago, Vercel | HTML + CSS estático, Netlify |
| Repo | sin remoto configurado | `github.com/carlosvital84/cvr-website` |
| Marca en pantalla | "CVR Consultoría Predial" | "CVR Propiedades" |
| Dominio que ya declara | `cvrpropiedades.com` (JSON-LD) | `cvrpropiedades.cl` (`netlify.toml`) |
| Contenido | tasación express gratuita, informe con perito pagado, listado de propiedades, portal de corredores, admin, pagos | estudio de títulos, due diligence, peritaje judicial, matriz de riesgo hídrico, tasación comercial, paquete hereditario, quién firma, contacto, privacidad |
| Último trabajo | mayo 2026 | 17 y 20 de noviembre de 2026 |

### Los dos problemas de fondo

1. **La marca está cruzada con el contenido.** El sitio que se llama "CVR Propiedades" contiene íntegramente la línea pericial. El sitio que tiene el módulo de corretaje declara en su Open Graph "No somos corredores. Somos tu filtro de riesgo."
2. **Hay cuatro nombres en circulación** para dos líneas: CVR Propiedades, CVR Peritajes y Tasaciones (papelería de autorizaciones), CVR Consultoría Predial (sitio web) y CVR Propiedades SpA (razón social).

### Advertencia legal, antes de seguir

Hablamos de "dos empresas", pero legalmente hay **una sola**: CVR Propiedades SpA. Un RUT, una contabilidad, una responsabilidad. Lo que se separa es la **marca comercial** y el **canal**, no la persona jurídica. Consecuencia práctica: el pie legal, los datos de facturación y la política de privacidad de **ambos** sitios deben identificar a CVR Propiedades SpA. Presentar cvrtasaciones.cl como si fuera otra empresa, sin decir de quién es, es exactamente el tipo de cosa que una contraparte usa para objetar un informe pericial en tribunales. Si de verdad quieres dos empresas separadas, eso es una conversación con tu contador, no un cambio de sitio web.

---

## 2. Reparto de líneas (propuesta)

**Criterio de corte: qué entrega el servicio.**

- Si el entregable es **un informe firmado por el perito**, va en `cvrtasaciones.cl`.
- Si el entregable es **una operación cerrada** (una venta, un arriendo, una compra asesorada), va en `cvrpropiedades.cl`.

Este criterio es mejor que separar "inmobiliario vs. pericial" porque no deja servicios ambiguos: el due diligence y el estudio de títulos son informes técnicos firmados, aunque su cliente esté comprando una casa. Y es el corte que un tribunal, un banco o un comprador entienden sin que se lo expliques.

### `cvrtasaciones.cl` — la línea de informes

| Servicio | Estado hoy |
|---|---|
| Tasación comercial inmobiliaria | página escrita (`tasacion-comercial.html`) |
| Informe pericial judicial | página escrita (`peritaje-judicial.html`) |
| Tasación de derechos de aprovechamiento de aguas | **falta**; hoy solo existe la matriz de riesgo hídrico, que es otra cosa |
| Tasación de renta de arriendo | **falta**; servicio ya prestado, sin página |
| Estudio de títulos | página escrita (`estudio-titulos.html`) |
| Due diligence predial | página escrita (`due-diligence.html`) |
| Matriz de riesgo hídrico | página escrita (`matriz-riesgo-hidrico.html`) |
| Regularización de herencias | página escrita (`paquete-hereditario.html`) |

### `cvrpropiedades.cl` — la línea de operaciones

| Servicio | Estado hoy |
|---|---|
| Venta de propiedades | aplicación con listados y BD, sin contenido escrito |
| Arriendo y administración | **falta** |
| Asesoría de compra (acompañamiento al comprador) | **falta** |
| Portal de corredores asociados | aplicación existente |

### Consecuencia operativa

- El sitio estático actual **se muda completo** a `cvrtasaciones.cl`. No hay que portar contenido entre sitios: cambia la marca, el dominio y se le suman las dos páginas que faltan (aguas y renta de arriendo).
- El Next.js **se reescribe de cara al corretaje**. Se elimina el "No somos corredores" y la tasación express gratuita se traslada a cvrtasaciones.cl, que es donde corresponde un informe.
- Cada sitio enlaza al otro en el punto exacto en que el cliente lo necesita: desde una ficha de propiedad en venta, "pide el estudio de títulos"; desde un informe de tasación, "si quieres venderla".

---

## 3. Marca visible (propuesta, me pediste decidirla)

| Dominio | Marca visible | Pie legal |
|---|---|---|
| `cvrpropiedades.cl` | **CVR Propiedades** | CVR Propiedades SpA · RUT · Chillán, Región de Ñuble |
| `cvrtasaciones.cl` | **CVR Tasaciones** | CVR Tasaciones es la línea de peritajes y tasaciones de CVR Propiedades SpA · RUT · Chillán, Región de Ñuble |

**Por qué así:**

- **El nombre tiene que decir lo mismo que el dominio.** Un cliente que recibe un informe firmado y después escribe la dirección en el navegador debe reconocer lo que ve. "CVR Peritajes y Tasaciones" en un sitio que se llama cvrtasaciones.cl obliga al cliente a hacer el trabajo de reconocer que es lo mismo. "CVR Tasaciones" no.
- **"CVR Peritajes y Tasaciones" no se bota, baja de rango.** Pasa de nombre a descriptor: aparece en el membrete de los informes, bajo la marca, como "CVR Tasaciones — Peritajes y Tasaciones". Así tu papelería ya emitida sigue siendo coherente y no tienes que desdecirte de informes ya entregados.
- **"CVR Consultoría Predial" se jubila.** No está en tu papelería ni en tus informes; solo está en el sitio web que nunca se publicó con ese nombre. Es un cuarto nombre que no compra nada.
- **La razón social va en los dos pies de página**, por lo dicho en la advertencia legal.

### Dominios adicionales

`cvrpropiedades.com` → redirección 301 permanente a `cvrpropiedades.cl`. No se publica contenido ahí. Motivo: tu mercado es Chile, el `.cl` da señal local en buscadores, y dos sitios con el mismo contenido se compiten entre sí.

---

## 4. Arquitectura técnica (propuesta)

| Sitio | Stack | Hosting | Motivo |
|---|---|---|---|
| `cvrtasaciones.cl` | el sitio estático actual, mejorado | Netlify | Es contenido informativo más formularios. No necesita base de datos. Estático es más rápido, más barato y no se cae. |
| `cvrpropiedades.cl` | el Next.js actual, reescrito | Vercel | Necesita base de datos para los listados de propiedades, el portal de corredores y los pagos. |

**Dos repos separados, no un monorepo.** Cada sitio tiene su ciclo de vida, su hosting y su marca. Un monorepo con dos marcas dentro es la forma más segura de que un día aparezca el logo equivocado en el sitio equivocado.

### Nota obligatoria para quien escriba el código

Este proyecto corre **Next.js 16.2.6**, que tiene cambios de API respecto de versiones anteriores. Antes de escribir código hay que leer la guía correspondiente en `node_modules/next/dist/docs/`. Está exigido en el `AGENTS.md` del repo y no es negociable.

---

## 5. Qué significa "subir el estándar"

Pediste mejorar lo visual, subir el estándar y hacer páginas interactivas y educativas para que el cliente entienda el trabajo. Lo traduzco a criterios verificables, porque "mejor" no se puede auditar:

**Estructura y fundamentos (ambos sitios)**
1. Jerarquía de encabezados correcta: un solo `h1` por página, sin saltos de nivel.
2. Contraste de texto que cumpla WCAG 2.2 AA (4.5:1 en texto normal).
3. Navegable completo con teclado, con foco visible.
4. Funciona en teléfono sin desbordes horizontales, con 16 px de margen lateral.
5. Datos estructurados `schema.org` correctos por tipo de servicio.
6. Metadatos y Open Graph propios por página, no heredados.
7. Sitemap y `robots.txt` por dominio, cada uno apuntando solo a su propio sitio.
8. Tiempo de carga: Largest Contentful Paint bajo 2,5 s en 4G.

**Contenido educativo e interactivo (lo que diferencia)**
9. **cvrtasaciones.cl**: un explicador de cómo se llega a un valor de tasación (los tres enfoques, qué pesa cada uno); un conversor de turnos de riego a acciones y caudal, que es un cálculo que tus clientes de aguas no saben hacer; una línea de tiempo de un peritaje judicial, con plazos reales; un simulador de qué documentos se necesitan según el caso.
10. **cvrpropiedades.cl**: una calculadora de costos reales de compra (impuestos, notaría, conservador, corretaje); un diagnóstico de riesgo de un predio en diez preguntas, que termina derivando al informe que corresponda; fichas de propiedad con ubicación, plano y estado de títulos.
11. Toda cifra visible en pantalla lleva su fuente y su fecha. Es lo que ya hiciste bien en el sitio estático el 17 de noviembre y es lo que te sostiene frente a una contraparte.

**Lo que no se hace**
12. Ningún testimonio de cliente inventado. El Next.js actual tiene una sección "Lo que dicen nuestros clientes": si esos testimonios no son reales y autorizados por escrito, se eliminan. En una causa judicial un testimonio falso en tu propio sitio es un regalo para la contraparte.
13. Ninguna cifra de experiencia que no puedas probar. El Next.js dice "Más de 20 años": si la cifra es correcta se mantiene, si es redondeo hacia arriba se corrige.

---

## 5 bis. Hallazgo grave, anterior a cualquier mejora visual

Revisando el Next.js encontré algo que importa más que la separación de marcas.

`src/lib/pdf-generator.ts` emite automáticamente un PDF que:

1. se titula **"INFORME OFICIAL DE TASACIÓN"**;
2. afirma haber sido *"elaborado bajo los criterios de la Norma Chilena NCh 3658 de Tasación de Bienes"*;
3. imprime un bloque de firma con **"Carlos Vivanco R. — Perito Tasador Certificado"**;
4. y en el cuerpo dice que los valores son referenciales y *"no reemplazan una tasación formal in situ"*.

Ese documento sale de una consulta a una tabla de valores por comuna. Sin inspección, sin homologación de comparables, sin que lo revise nadie. Las cuatro afirmaciones no pueden ser verdad al mismo tiempo, y la segunda y la tercera simplemente no lo son.

**Por qué es grave y no un detalle de redacción:** Carlos declara como perito en causas civiles en curso. Un documento auto-emitido, con su firma impresa, titulado "oficial" e invocando una norma que no se aplicó, es exactamente lo que una contraparte necesita para atacar su credibilidad. No tiene que probar que ese PDF específico está mal: basta mostrar que el sitio del perito emite informes "oficiales" automáticos para poner en duda todo lo que firme. Y el daño alcanza a causas en las que ese PDF nunca intervino.

**Corrección, antes de cualquier mejora visual:** el PDF pasa a llamarse "Estimación referencial de valor", se le quita la mención a NCh 3658 y se reemplaza por la descripción exacta de lo que sí se hizo (valores de referencia por comuna, con su año y tamaño de muestra, datos que ya están en la base), se le quita el bloque de firma, y el descargo sube al encabezado en vez de quedar enterrado al final. Lo que el cliente paga pasa a ser un encargo de tasación que tú ejecutas a mano, con plazo, no una descarga automática.

Decir con precisión lo que se hizo da más credibilidad que invocar una norma. Un comprador que lee "valores de referencia de 2025 para su comuna, muestra de N casos" entiende qué compró. Uno que lee "informe oficial bajo NCh 3658" y después descubre que nadie fue a ver la casa, no vuelve.

---

## 5 ter. Las normas no se pueden reproducir en el sitio

Tienes los PDF en `C:\Users\carlo\Downloads\Normas INN`. Dos cosas:

- La copia de **NCh 3658/1:2021** es una licencia de un solo usuario emitida a nombre de **Transsa Consultores Inmobiliarios SpA**, no a CVR. Prohíbe expresamente la reproducción y la publicación en internet.
- **IVS 2025** trae la misma cláusula del IVSC: ninguna parte puede reproducirse sin permiso escrito.

Aplicar las normas en tu trabajo es tuyo y nadie lo discute. Copiar su texto a un sitio público es otra cosa. Así que los sitios las citan por número y título, como referencia bibliográfica, y explican los conceptos con palabras propias. Los tres enfoques de tasación (comparación, costo, ingreso) son conceptos del oficio y se explican libremente.

Queda prohibido en los dos encargos, y lo audito: ninguna cita normativa inventada. Atribuir a una norma una cláusula o una exigencia que no dice es peor que no citarla.

---

## 6. Reparto del trabajo

| Quién | Qué |
|---|---|
| **Hermes Agent** | El trabajo pesado: reescritura de ambos sitios, las páginas nuevas, los módulos interactivos. Un encargo por repo, en worktree aislado, para que nunca haya dos agentes editando lo mismo. |
| **Claude** | Los encargos, la auditoría de cada entrega (diff completo, build, lint, accesibilidad, seguridad) y la integración. |
| **Carlos** | El visto bueno a este documento, los textos que solo tú puedes confirmar (precios, cifras de experiencia, testimonios reales), la configuración de DNS en NIC Chile, y el despliegue. |

**Hermes no despliega.** Corre con las confirmaciones omitidas, así que no se le delega nada irreversible: ni `push`, ni despliegue, ni borrados. Construye en una rama; publicar lo decides tú. Esto va contra lo que supusiste al pedírmelo, y es a propósito.

---

## 7. Decisiones que siguen siendo tuyas

1. El reparto de la sección 2.
2. Las marcas de la sección 3.
3. Si "más de 20 años" y los testimonios del sitio actual son reales.
4. Cuál es tu calificación profesional exacta y verificable, para reemplazar "Perito Tasador Certificado".
5. Los precios y honorarios que se publican, si alguno.
6. El RUT de la SpA, para los pies legales.
7. Cuándo se publica cada sitio.

## 8. Estado del trabajo

- Encargo para `cvrtasaciones.cl`: escrito, en `docs/encargos/hermes-cvrtasaciones.md`.
- Encargo para `cvrpropiedades.cl`: escrito, en `docs/encargos/hermes-cvrpropiedades.md`.
- Ninguno lanzado todavía. Esperan el visto bueno de las secciones 2 y 3, porque todo el contenido que escriba Hermes depende del reparto.
- Nada desplegado, nada publicado, ningún `push`.
