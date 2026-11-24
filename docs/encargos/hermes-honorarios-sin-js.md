# Encargo: la tabla de honorarios no puede depender de JavaScript

Repositorio: `C:\Users\carlo\Downloads\cvr-website` (sitio estático cvrtasaciones.cl, Netlify, sin build).
Partes del trabajo ya hecho en la rama `hermes/20261123-230226` (commit `e4a353a`): parte de ahí, no de `main`.

## El defecto

`honorarios.js` quedó como única fuente de los honorarios y eso está bien como criterio de
mantenimiento, pero el HTML que se publica quedó vacío:

- `honorarios.html` tiene `<tbody id="tablaHonorarios">` y `<tbody id="tablaRecargos">` sin filas.
- Las ocho fichas de servicio muestran el texto de relleno «Honorario publicado en la tabla».

Consecuencias reales, no teóricas:

1. **Buscadores.** La página de honorarios es la que un cliente busca y la que Google debe indexar.
   Hoy se indexa una página sin un solo precio. Es exactamente la página que no puede quedar vacía.
2. **Sin JavaScript.** Un bloqueador, una red corporativa o un error de carga dejan la página
   principal de precios sin contenido. El `<noscript>` que invita a escribir no sustituye el precio:
   el sitio entero se construyó para que el cliente no tenga que preguntar cuánto cuesta.
3. **Confianza.** En un servicio de alto ticket, una tabla de precios que a veces no aparece es peor
   que no tenerla.

## Qué hay que hacer

El precio debe estar en el HTML servido. Mantén `honorarios.js` como la fuente que se edita, pero
que el HTML no dependa de él para mostrarse:

1. **Escribe en el HTML las filas de las dos tablas y el honorario de cada ficha**, con el mismo
   marcado y las mismas clases que hoy genera el JS (mismo `data-label`, mismo `role`, misma clase
   `honorario` / `honorario--libre`). El HTML publicado debe verse idéntico con y sin JavaScript.
2. **`honorarios.js` deja de pintar y pasa a verificar.** Al cargar, compara lo que hay en el DOM
   con `DATOS`:
   - si coinciden, no toca nada (cero parpadeo, cero reflow);
   - si no coinciden, corrige el texto **y** emite un `console.warn` que diga exactamente qué
     servicio está desincronizado y qué valor esperaba.
   Así el archivo sigue siendo la fuente y la deriva se nota.
3. **Deja escrito cómo se cambia un precio** en un comentario al inicio de `honorarios.js`: editar
   el valor en `DATOS`, actualizar la fila correspondiente del HTML, y que la consola queda limpia
   si quedó bien. Dos lugares, pero con un verificador que avisa; es el precio de no tener build.
4. **Quita el `<noscript>` que pide escribir para conocer la tarifa**: deja de ser cierto. Si quieres
   dejar un `<noscript>`, que diga solo lo que siga siendo verdad.
5. Si en vez de esto prefieres generar el HTML desde `honorarios.js` con un script Node que se corra
   a mano (`node scripts/generar-honorarios.mjs`) y dejar el resultado commiteado, también sirve y es
   mejor: una sola fuente de verdad y HTML estático publicado. Requisito: el script no puede ser
   parte del despliegue de Netlify, se corre en local y se commitea su salida; y debe tener modo
   `--check` que falle si el HTML commiteado no corresponde a los datos.

## Restricciones que siguen vigentes

- No cambies ninguna cifra de honorario ni inventes plazos, rangos, páginas ni testimonios.
- No agregues recursos de terceros. La CSP de `netlify.toml` no se toca.
- No toques `docs/` ni el sitio hermano. No hagas push ni despliegues.
- Mantén lo ya verificado: cero desborde horizontal a 320/375/430, áreas de toque ≥ 44×44,
  contraste ≥ 4,5:1, un solo `h1`, cero hex a mano fuera de `:root`, cero `@keyframes`.
- Sube el `?v=` del CSS solo si cambias el CSS.

## Terminado

Commit en la misma rama `hermes/20261123-230226`. En el informe, demuestra con el navegador real:

- `honorarios.html` **con JavaScript desactivado** muestra las nueve filas y los tres recargos, con
  los mismos valores que con JavaScript;
- las ocho fichas muestran su honorario sin JavaScript;
- cero desborde a 375 px en las dos condiciones;
- la consola no emite ninguna advertencia de desincronización;
- y, cambiando a mano un valor en `DATOS`, la advertencia sí aparece y nombra el servicio.
