# Encargo: estándar visual de alto ticket y tabla de honorarios en cvrtasaciones.cl

## Contexto

Repositorio: `C:\Users\carlo\Downloads\cvr-website`, rama `master`. Es `cvrtasaciones.cl`, de **CVR Tasaciones**, la línea de peritajes y tasaciones de CVR Propiedades SpA (Carlos Vivanco Riquelme, Chillán, Región de Ñuble). Sitio estático de HTML, CSS y JavaScript propio, Netlify, 15 páginas. Ya está publicable y auditado: no queda ningún marcador pendiente.

Carlos pidió "un estándar alto de página, que sea móvil, buena fluidez, que parezca de alto ticket, que dé seguridad y confianza al cliente", y una tabla de honorarios.

Hay un sitio hermano, `cvrpropiedades.cl` (Next.js, otro repositorio), que recibe el mismo estándar en un encargo paralelo. **No lo toques.**

---

## Parte 1 — Tokens: el problema de fondo

Los dos sitios de CVR no comparten lenguaje visual, y es lo que impide que parezcan de alto ticket. Este sitio usa dorado `#c9a84c` y el otro `#c5a85b`: dos dorados que se diferencian en un matiz que nadie lee como intención, solo como descuido. Las escalas de navy no coinciden y el radio es la mitad.

En este sitio el dorado y el navy ya son los correctos y **no cambian**. Lo que falta son las escalas que no existen. Hoy `style.css` tiene 58 colores escritos a mano fuera de `:root`, ninguna escala tipográfica, ninguna escala de espaciado y un solo token de movimiento.

Agrega a `:root`, conservando los tokens de color que ya están:

```css
/* Tipografía fluida: sin saltos entre teléfono y escritorio */
--step--1: clamp(0.83rem, 0.80rem + 0.15vw, 0.89rem);
--step-0:  clamp(1.00rem, 0.96rem + 0.20vw, 1.09rem);
--step-1:  clamp(1.20rem, 1.13rem + 0.35vw, 1.37rem);
--step-2:  clamp(1.44rem, 1.33rem + 0.56vw, 1.73rem);
--step-3:  clamp(1.73rem, 1.55rem + 0.88vw, 2.18rem);
--step-4:  clamp(2.07rem, 1.80rem + 1.35vw, 2.75rem);
--step-5:  clamp(2.49rem, 2.08rem + 2.03vw, 3.47rem);

/* Espaciado: una escala, y nada fuera de ella */
--space-3xs: 0.25rem; --space-2xs: 0.5rem;  --space-xs: 0.75rem;
--space-s:   1rem;    --space-m:   1.5rem;  --space-l:  2rem;
--space-xl:  3rem;    --space-2xl: 4rem;    --space-3xl: 6rem;

/* Radio y elevación */
--radius-sm: 6px; --radius: 10px; --radius-lg: 16px; --radius-pill: 999px;
--elev-1: 0 1px 2px rgba(13,30,51,0.06), 0 2px 8px rgba(13,30,51,0.04);
--elev-2: 0 4px 12px rgba(13,30,51,0.08), 0 12px 32px rgba(13,30,51,0.06);
--elev-3: 0 8px 24px rgba(13,30,51,0.10), 0 24px 56px rgba(13,30,51,0.08);

/* Movimiento */
--dur-fast: 120ms; --dur: 200ms; --dur-slow: 320ms;
--ease: cubic-bezier(0.2, 0, 0.2, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
```

Y obligatorio, porque hoy no está:

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

Reglas:

1. **Reemplaza los 58 hex sueltos por los tokens de color que ya existen.** Si alguno no corresponde a ningún token, agrégalo a `:root` con un nombre semántico; no lo dejes escrito a mano.
2. Pasa los tamaños de letra a la escala `--step-*` y los márgenes y rellenos a la escala `--space-*`. Donde un valor no cuadre con ningún paso, usa el paso más cercano: el objetivo es el ritmo repetido, no conservar el píxel.
3. Medida de 60 a 75 caracteres por línea en texto corrido, `line-height` 1.6 en párrafos y 1.15 en titulares. Nada de texto bajo 16px en móvil.
4. **Solo se animan `transform` y `opacity`.** Nunca `width`, `height`, `top`, `left`, `margin` ni `box-shadow`: eso fuerza recálculo de disposición y es la falta de fluidez que Carlos nota. Nada que se mueva solo, nada en bucle, ningún carrusel automático.
5. Una sola sombra fuerte por pantalla como máximo. Las sombras grandes y repetidas abaratan.
6. Un acento, no tres: el dorado se gana apareciendo poco. Si está en todo, no destaca nada.
7. Espacio generoso y constante entre secciones: `--space-2xl` o `--space-3xl` en escritorio, `--space-xl` en móvil. El ritmo repetido es lo que lee como cuidado.
8. **No cambies ni una palabra del contenido.** El copy fue escrito y auditado y es bueno. Este encargo es tipografía, espaciado, color, movimiento y la tabla nueva.

---

## Parte 2 — Tabla de honorarios

Página nueva `honorarios.html`, enlazada desde la navegación y desde el pie, y además desde cada página de servicio.

Cuatro columnas en este orden: **Servicio · Qué incluye · Qué determina el precio · Honorario**.

| Servicio | Honorario |
|---|---|
| Estimación referencial en línea | Sin costo |
| Tasación comercial de inmuebles | Desde 4,5 UF + IVA |
| Tasación de renta de arriendo | Desde 4,5 UF + IVA |
| Estudio de títulos | Desde 5,5 UF + IVA |
| Matriz de riesgo hídrico del predio | Desde 7 UF + IVA |
| Regularización de herencias | Desde 7 UF + IVA |
| Due diligence predial | Desde 8,5 UF + IVA |
| Informe pericial para causa judicial | Desde 9 UF + IVA |
| Tasación de derechos de aprovechamiento de aguas | Desde 15 UF + IVA |

Las columnas "qué incluye" y "qué determina el precio" las redactas tú a partir del contenido que ya tiene cada página de servicio. **No inventes alcances nuevos**: resume lo que la página ya promete. "Qué determina el precio" es la columna que evita la conversación incómoda de por qué dos encargos parecidos cuestan distinto.

**Datos en un solo lugar.** Los honorarios van en un único archivo de datos (por ejemplo `honorarios.js` con un arreglo de objetos) y la tabla se construye desde ahí, incluidas las menciones en las páginas de servicio. Cambiar un precio tiene que ser cambiar una línea. Hoy hay cuatro precios en pesos escritos en el HTML (`due-diligence.html`, `estudio-titulos.html`, `matriz-riesgo-hidrico.html`, `tasacion-comercial.html`) y dos "A cotizar": todos pasan a leerse del archivo de datos y quedan expresados en UF según la tabla de arriba.

**Conversión a pesos.** Si muestras el equivalente en pesos, tiene que llevar el valor de la UF usado y su fecha. Como este sitio es estático y no tiene servidor, **lo más simple y honesto es mostrar solo UF** y una línea que diga que el equivalente en pesos se calcula al valor de la UF del día de la cotización. No pongas una UF escrita a mano: se desvía y nadie lo nota.

### Reglas que no se negocian

1. Debajo de la tabla, fijo: **el honorario se fija por escrito antes de empezar y no varía después, salvo que cambie el alcance acordado.**
2. **"Desde" significa un mínimo real**, no un gancho.
3. **IVA siempre explícito.**
4. **Los recargos van en la tabla, no en letra chica.** Son tres: peritaje judicial +100% sobre el servicio equivalente, urgencia bajo la mitad del plazo normal +50%, y fuera de la Región de Ñuble traslado y estadía contra documento. Un recargo escondido destruye en un minuto la confianza que la tabla construyó.
5. **Ningún precio tachado, ninguna oferta, ningún "antes/ahora", ninguna cuenta regresiva.** Son recursos de comercio minorista y en servicios periciales restan credibilidad.
6. No inventes ningún honorario que no esté en la tabla de arriba, ni rangos, ni "hasta".

---

## Parte 3 — Confianza, que es lo que pidió Carlos

"Que dé seguridad y confianza al cliente" se traduce a cosas concretas, no a adjetivos. Varias ya están en el sitio; verifica y completa:

1. **Toda cifra visible lleva su fuente y su fecha.** Ya se hace en la portada y en aguas; revisa que no quede ninguna suelta. En servicios periciales la credibilidad es el lujo.
2. **Quién firma, con cara y credenciales verificables.** La página `nosotros.html` ya dice que no declara inscripción en lista de peritos, lo que es correcto: Carlos confirmó que **no está inscrito**. Reescribe ese párrafo en afirmativo, porque hoy dice "mientras no esté confirmada" y eso sugiere que podría llegar. Debe decir lo que sí hace: emite informes periciales de parte para causas judiciales. **No insinúes inscripción, registro, nómina ni nombramiento en ningún tribunal, Corte ni institución.**
3. **Qué recibe el cliente, antes de pagar**: formato del entregable, cuántas páginas, qué incluye, en cuánto tiempo. La incertidumbre es lo que frena una compra de alto ticket.
4. **Qué NO incluye cada servicio.** Decirlo genera más confianza que omitirlo. Ya hay una nota así en la portada; extiéndela a cada página de servicio.
5. **Un solo camino de contacto claro por página**, sin competir con tres botones iguales.
6. Ningún recurso genérico de banco de imágenes. Antes que una foto de archivo de un apretón de manos, no va ninguna foto.

---

## Criterios medibles (se auditan y lo que falla se devuelve)

1. Ningún desborde horizontal entre 320 y 430 px de ancho: `scrollWidth` igual al ancho del viewport, página por página, las 16 ahora.
2. Canal lateral de 16 px como mínimo en teléfono.
3. **Área de toque de 44×44 px como mínimo en todo control.** Excepción: enlaces de texto en línea dentro de un párrafo. El botón de menú ya mide 44×44; no lo bajes.
4. Contraste WCAG 2.2 AA: 4.5:1 en texto normal, 3:1 en texto grande y en componentes.
5. Un solo `<h1>` por página, sin saltos de nivel.
6. Recorrido completo con teclado, en orden lógico, con foco visible de 3 px y 2 px de separación, y enlace para saltar al contenido.
7. Todo contenedor con `overflow-x` con `role="region"`, `tabindex="0"` y `aria-label`, y el texto de ayuda menciona el tabulador y no solo el dedo.
8. Toda imagen con `width` y `height` o `aspect-ratio` declarados, para que nada salte al cargar.
9. Cero scripts, estilos, fuentes, imágenes o iframes de terceros. Si usas una fuente que no sea del sistema, se autohospeda, con `font-display: swap` y precarga de la del titular.
10. Los cinco estados en cada control: reposo, hover, foco, activo y deshabilitado. Un botón que no responde al pasar el cursor se siente roto aunque funcione.
11. `sitemap.xml` incluye `honorarios.html`. `gracias.html` sigue `noindex` y `404.html` fuera del sitemap.
12. El formulario de contacto sigue funcionando con Netlify Forms, con su campo trampa, y sin JavaScript también. No toques esa parte salvo lo visual.
13. Versiona `style.css` con `?v=` al cambiarlo: se sirve `immutable` y un visitante recurrente vería el sitio roto.

---

## Prohibido

- **No cambies el contenido escrito.** Ni titulares, ni párrafos, ni el orden de los argumentos.
- **No inventes datos**: honorarios, plazos, cifras, credenciales, inscripciones, citas normativas ni testimonios.
- No agregues dependencias, frameworks, CDN, fuentes externas, analítica ni cookies no esenciales.
- No cambies el stack: HTML, CSS y JavaScript propio.
- No toques el repositorio `cvr_consultoria_app` ni ningún `docs/`.
- **No despliegues, no hagas push, no borres nada fuera del alcance.** Trabajas en un worktree aislado.

## Qué entregar

En tu rama, dentro del worktree: los archivos modificados y los nuevos, más un `INFORME-HERMES.md` con los archivos uno por línea y qué cambió, los 13 criterios medibles verificados uno por uno con el comando o la herramienta usada y su resultado, cuántos hex sueltos quedaban y cuántos quedan, y qué no alcanzaste a hacer.

No afirmes haber hecho algo que no hiciste. Se audita contra el diff y en un navegador a 375 px. En encargos anteriores declaraste cero problemas de estructura y había dos tablas que un usuario de teclado no podía recorrer, y una página del sitio hermano desbordaba a 686 px. Lo que no puedas comprobar, dilo como no comprobado: eso no se reprocha, inventarlo sí.
