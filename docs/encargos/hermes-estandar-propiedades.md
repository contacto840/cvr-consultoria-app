# Encargo: estándar visual, tabla de honorarios y cierre de pendientes en cvrpropiedades.cl

## Contexto

Repositorio: `C:\Users\carlo\Desktop\.cvr-main-integracion`, rama **`main`**. Ojo: `main` NO está en `C:\Users\carlo\Desktop\cvr_consultoria_app`, que es el mismo repositorio en otra rama y es el espacio de trabajo de otra tarea. **Trabaja solo en el worktree que te asigne el script y no cambies de rama.**

Es `cvrpropiedades.cl`, de **CVR Propiedades**: corretaje, arriendo y asesoría de compra. Next.js 16.2.6, React 19.2.4, Prisma 7 con PostgreSQL en Neon, MercadoPago, Vercel. Carlos Vivanco Riquelme, Chillán, Región de Ñuble.

Hay un sitio hermano, `cvrtasaciones.cl` (estático, repositorio `cvr-website`), con la línea de informes. Recibe el mismo estándar en un encargo paralelo. **No lo toques.**

Carlos pidió "un estándar alto de página, que sea móvil, buena fluidez, que parezca de alto ticket, que dé seguridad y confianza al cliente".

## Antes de escribir código: lee la documentación

Next.js **16.2.6** tiene cambios de API respecto de versiones anteriores y tu conocimiento previo está desactualizado. La documentación de la versión instalada está en `node_modules/next/dist/docs/` y es obligatorio leerla, según el `AGENTS.md` del repo. Las que necesitas: `01-app/01-getting-started/05-server-and-client-components.md`, `11-css.md`, `14-metadata-and-og-images.md`, `02-guides/forms.md`, y `06-fetching-data.md` si tocas datos.

**Build en worktree:** usa `npx next build --webpack`; Turbopack no compila ahí por el enlace de `node_modules`. Si el build falla con un error de tipos que menciona una ruta que ya no existe, borra `.next` y reconstruye: son artefactos de una estructura anterior.

---

## Parte 1 — Tokens compartidos con el sitio hermano

**El problema de fondo:** los dos sitios de CVR no comparten lenguaje visual, y es lo que impide que parezcan de alto ticket. Este sitio usa dorado `#c5a85b` y el hermano `#c9a84c`: dos dorados que se diferencian en un matiz que nadie lee como intención, solo como descuido. Las escalas de navy no coinciden en ningún valor y el radio es el doble.

**Gana el dorado del sitio hermano.** Reemplaza en `src/app/globals.css`:

```css
--cvr-gold:        #c9a84c;  /* era #c5a85b */
--cvr-gold-light:  #e2c47a;
--cvr-gold-ink:    #7d5f1e;  /* dorado como TEXTO sobre superficie clara */
--cvr-navy:        #1a2e4a;
--cvr-navy-mid:    #243d62;
--cvr-navy-deep:   #0d1e33;
--cvr-navy-abyss:  #050c17;  /* el fondo de este sitio, se conserva */
```

Este sitio **sigue en modo oscuro** y eso no cambia: es la diferencia correcta, porque un sitio de propiedades necesita que las fotos manden y uno de informes se lee como un documento. Lo que se comparte es el dorado, la escala de navy, la tipografía, el radio, el espaciado y el movimiento.

Regla dura: **el dorado `--cvr-gold` no se usa como color de texto sobre superficie clara**, no llega a 4.5:1. Para eso está `--cvr-gold-ink`.

Agrega las escalas que hoy no existen (no hay ninguna escala tipográfica, ninguna de espaciado y ningún token de movimiento):

```css
--step--1: clamp(0.83rem, 0.80rem + 0.15vw, 0.89rem);
--step-0:  clamp(1.00rem, 0.96rem + 0.20vw, 1.09rem);
--step-1:  clamp(1.20rem, 1.13rem + 0.35vw, 1.37rem);
--step-2:  clamp(1.44rem, 1.33rem + 0.56vw, 1.73rem);
--step-3:  clamp(1.73rem, 1.55rem + 0.88vw, 2.18rem);
--step-4:  clamp(2.07rem, 1.80rem + 1.35vw, 2.75rem);
--step-5:  clamp(2.49rem, 2.08rem + 2.03vw, 3.47rem);

--space-3xs: 0.25rem; --space-2xs: 0.5rem;  --space-xs: 0.75rem;
--space-s:   1rem;    --space-m:   1.5rem;  --space-l:  2rem;
--space-xl:  3rem;    --space-2xl: 4rem;    --space-3xl: 6rem;

--radius-sm: 6px; --radius: 10px; --radius-lg: 16px; --radius-pill: 999px;

--dur-fast: 120ms; --dur: 200ms; --dur-slow: 320ms;
--ease: cubic-bezier(0.2, 0, 0.2, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
```

El radio pasa de 12px a 10px para igualar al hermano.

**En modo oscuro las sombras no se ven**: la elevación se expresa con un borde de un píxel más claro y un fondo un paso más alto, nunca con una sombra más negra. Revisa `--shadow` con ese criterio.

Obligatorio, porque hoy solo hay una regla aislada:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Reglas: pasa los tamaños de letra a `--step-*` y los márgenes y rellenos a `--space-*`; medida de 60 a 75 caracteres por línea, `line-height` 1.6 en párrafos y 1.15 en titulares, nada bajo 16px en móvil; **solo se animan `transform` y `opacity`** (nunca `width`, `height`, `top`, `left`, `margin` ni `box-shadow`, que fuerzan recálculo de disposición y son la falta de fluidez que Carlos nota); nada que se mueva solo ni en bucle ni ningún carrusel automático; un acento y no tres, el dorado se gana apareciendo poco.

## Parte 2 — Dos defectos de toque que encontré auditando

1. **`.nav-toggle` mide 43×37 px.** Es el control más tocado del sitio en teléfono y está bajo el mínimo de 44 en los dos lados. En el sitio hermano ya mide 44×44; igualalo.
2. **Los enlaces de tarjeta `.link-arrow` miden 23 px de alto** ("Ver el servicio →", "Hacer el diagnóstico →"). Súbelos a 44 px de alto efectivo con relleno, sin cambiar el texto.

Área de toque de **44×44 px como mínimo en todo control**, con la única excepción de los enlaces de texto en línea dentro de un párrafo. Los radios del estimador están envueltos en etiquetas de 294×74 y están bien: no los toques.

## Parte 3 — Tabla de honorarios

Ruta nueva `/honorarios`, enlazada desde la navegación y el pie, y desde cada página de servicio. Cuatro columnas: **Servicio · Qué incluye · Qué determina el precio · Honorario**.

| Servicio | Honorario |
|---|---|
| Venta de propiedades | 2% + IVA del precio de venta, por parte |
| Arriendo | 50% de la primera renta + IVA, por parte |
| Administración mensual | 8% de la renta mensual + IVA |
| Asesoría de compra | Honorario fijo desde 12 UF + IVA |
| Corredores asociados | Reparto 50/50 de la comisión de la parte aportada |

Esto cierra cuatro marcadores que hoy existen: `{{PENDIENTE: honorarios, definir porcentaje...}}` en `servicios/venta`, `{{PENDIENTE: honorarios de arriendo y administración...}}` en `servicios/arriendo`, `{{PENDIENTE: honorarios de asesoría de compra...}}` en `servicios/asesoria-de-compra` y `{{PENDIENTE: condiciones y comisiones del programa de corredores...}}` en `corredores`.

**Datos en un solo archivo** (por ejemplo `src/lib/honorarios.ts`), y la tabla y las menciones en las páginas de servicio se leen de ahí. Cambiar un precio tiene que ser una línea.

**El argumento de confianza más fuerte del sitio, y hay que escribirlo explícito en la página de asesoría de compra:** el honorario es **fijo y no un porcentaje del precio**, a propósito. Un porcentaje hace ganar más al asesor cuando el cliente compra y cuando compra caro, que es exactamente el conflicto de interés que el servicio dice resolver. Con honorario fijo, a CVR le da lo mismo si el cliente compra o se arrepiente, y eso es lo que está comprando. Dilo con esas palabras, sin adornos.

**Declara quién paga.** En Chile es costumbre que la comisión la paguen ambas partes y no está fijado por ley. Dilo explícitamente, antes de que alguien firme una orden de corretaje: es información que la mayoría de los sitios esconde y publicarla genera justo la confianza que se busca.

Reglas: debajo de la tabla, fijo, **el honorario se fija por escrito antes de empezar y no varía después salvo que cambie el alcance acordado**; "desde" significa un mínimo real; **IVA siempre explícito**; los recargos van en la tabla y no en letra chica; **ningún precio tachado, ninguna oferta, ningún "antes/ahora", ninguna cuenta regresiva**. Si muestras pesos, usa el valor de UF de `src/lib/uf.ts` con su fecha a la vista, y si no está disponible muestra solo UF.

## Parte 4 — Cerrar los pendientes restantes

Decisiones ya tomadas; aplícalas tal cual.

1. **Retira el pago automático del informe de tasación.** Estaba en $15.000, heredado del flujo de MercadoPago, menos de la mitad de lo que cobra un banco por el trabajo más liviano del rubro. Ese servicio pasa a cotizarse: el formulario envía una solicitud y CVR responde con la cotización y el plazo por escrito. La estimación referencial en línea queda **gratis**. No elimines el código de pagos; déjalo inalcanzable desde la interfaz y anota en el informe qué quedó sin usar.
2. **Plazo del encargo** (`src/lib/encargo.ts`): "se acuerda por escrito al aceptar el encargo". Nada de inventar días.
3. **Política de reembolso** (términos): como no se cobra en línea, las condiciones de cada encargo se acuerdan por escrito antes de empezar y no hay cobro anticipado. Redáctalo así.
4. **Domicilio y correo de privacidad**: usa `contacto@cvrpropiedades.com` como canal para ejercer los derechos de datos, y "Chillán, Región de Ñuble, Chile" como localidad. **No publiques ninguna dirección de calle**: la que aparece en los certificados tributarios de Carlos corresponde a un inmueble cedido por un tercero y no nos corresponde publicarla.
5. **Plazos de conservación de datos**: consultas de contacto 12 meses, solicitudes de estimación 24 meses, publicaciones de propiedades mientras estén activas más 12 meses. Son la política propuesta y van marcados como **pendientes de revisión legal**, visible en la página.
6. **Transferencia internacional de datos.** Este es el punto importante y hoy está vacío. La base de datos está en **Neon** y el sitio en **Vercel**, los dos fuera de Chile, así que los datos personales de quien llena un formulario salen del país y la Ley 21.719 obliga a declararlo. **Averigua la región real** de la base leyendo la cadena de conexión en la configuración (no la publiques, solo el país o la región) y la de Vercel en `.vercel/project.json` o la documentación del proveedor, y declara: a qué países van los datos, quién es el encargado de cada tratamiento y bajo qué instrumento contractual (el acuerdo de tratamiento de datos de cada proveedor). Si no puedes determinar una región con certeza, **dilo como no determinado** y deja el marcador; no la adivines. Marca la sección como pendiente de revisión legal.
7. **Calificación profesional** (`{{PENDIENTE: calificación profesional exacta}}` en la portada): usa exactamente esta fórmula, que se sostiene en tres documentos de Carlos: *"Administrador Público, diplomado en Tasación Inmobiliaria y Agrícola (Braniff Institute, 2022), aprobado en el Curso de Tasación Inmobiliaria de la Universidad Adolfo Ibáñez (2026) y diplomado en Recursos Hídricos (Universidad de Concepción, 2026)"*. **Nunca "certificado"**, que no dice certificado por quién. El diplomado en Derecho Inmobiliario de la UNAB solo puede mencionarse como **en curso**: el respaldo es un certificado de alumno regular, no de egreso.
8. **Carlos no está inscrito en la lista de peritos** de ninguna Corte. Lo confirmó. No insinúes inscripción, registro, nómina ni nombramiento en ningún tribunal ni institución.
9. **Nunca una cifra de experiencia inmobiliaria.** Los 23 años de trayectoria de Carlos son de servicio público, no de tasación ni corretaje: su formación inmobiliaria parte en 2022. No publiques "23 años" ni variantes en este sitio.
10. **Dos columnas nuevas en la base**, que propuso el encargo anterior y apruebo: agrega a `TasacionRequest` los campos opcionales `ufValueCLP` y `ufDate`, y vuelve `estimatedValueCLP` nullable, para no reconstruir la UF desde el monto guardado. Genera la migración de Prisma pero **no la apliques contra la base de producción**: deja el archivo de migración y dilo en el informe.

## Parte 5 — Confianza

"Que dé seguridad y confianza" se traduce a cosas concretas:

1. **Toda cifra visible lleva su fuente y su fecha.** La calculadora de costos ya lo hace; extiéndelo a donde falte.
2. **Qué recibe el cliente antes de pagar**: qué incluye cada servicio, en qué formato y en cuánto tiempo. La incertidumbre es lo que frena una compra de alto ticket.
3. **Qué NO incluye cada servicio.** Decirlo da más confianza que omitirlo.
4. **Fichas de propiedad sin datos personales**: sector y comuna, nunca la dirección exacta de una propiedad habitada ni el teléfono del propietario. Ya se corrigió en la API; verifica que ninguna vista pública los muestre.
5. Un solo camino de contacto claro por página.
6. Ningún recurso genérico de banco de imágenes. Antes que una foto de archivo de un apretón de manos, no va ninguna foto.

## Criterios medibles (se auditan; lo que falla se devuelve)

1. `npx next build --webpack`, `npx tsc --noEmit` y `npx eslint src` sin errores ni advertencias nuevas.
2. Ningún desborde horizontal entre 320 y 430 px: `scrollWidth` igual al ancho del viewport, ruta por ruta.
3. Área de toque 44×44 mínimo, salvo enlaces de texto en línea.
4. Contraste WCAG 2.2 AA: 4.5:1 en texto normal, 3:1 en texto grande y en componentes.
5. Un solo `<h1>` por ruta, sin saltos de nivel.
6. Teclado completo, orden lógico, foco visible de 3 px con 2 px de separación, enlace para saltar al contenido.
7. Contenedores con `overflow-x` con `role="region"`, `tabIndex={0}` y `aria-label`.
8. Toda imagen con `width` y `height` o `aspect-ratio`, para que nada salte al cargar.
9. `metadata` propia por ruta, JSON-LD válido, `/honorarios` en el sitemap, y `/admin` y `/propiedades/agregar` siguen fuera del sitemap y con `noindex`.
10. Los cinco estados en cada control: reposo, hover, foco, activo, deshabilitado, más cargando donde aplique.
11. Sin claves ni secretos en el código; `.env.example` actualizado si agregas una variable.
12. `src/lib/admin-auth.ts` **no se toca**: falla cerrado, rechaza la clave filtrada y compara en tiempo constante.
13. Las correcciones del PDF se mantienen: se titula "ESTIMACIÓN REFERENCIAL DE VALOR", sin mención a ninguna norma, sin firma, con el descargo en el encabezado.

## Prohibido

- **No inventes datos**: honorarios distintos a los de la tabla, plazos, aranceles, cifras de experiencia, credenciales, inscripciones, citas normativas ni testimonios.
- No redactes testimonios de clientes. Si aparece alguno, elimínalo y anótalo.
- No agregues dependencias ni bibliotecas de componentes o de animación.
- No cambies la versión de Next, React ni Prisma; no ejecutes `next upgrade`.
- No apliques migraciones contra la base de producción.
- No toques `.env`, `.vercel/` ni la configuración de despliegue, ni `docs/`, ni el repositorio `cvr-website`, ni `herramientas/`.
- **No despliegues, no hagas push, no borres nada fuera del alcance.**

## Qué entregar

Los archivos modificados y los nuevos, más un `INFORME-HERMES.md` con: archivos uno por línea y qué cambió; los 13 criterios verificados uno por uno con el comando usado y su resultado; la salida pegada de build, tsc y eslint; qué región determinaste para Neon y Vercel y cómo; qué marcadores cerraste y cuáles quedan y por qué; el archivo de migración generado; y qué no alcanzaste a hacer.

No afirmes haber hecho algo que no hiciste. Se audita contra el diff, se reconstruye y se prueba en un navegador a 375 px. En encargos anteriores declaraste cero problemas de estructura y había una página que desbordaba a 686 px, y afirmaste que una clave estaba publicada en una pantalla de login cuando no lo estaba. Lo que no puedas comprobar, dilo como no comprobado: eso no se reprocha, inventarlo sí.
