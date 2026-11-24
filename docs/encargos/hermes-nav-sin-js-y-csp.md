# Encargo: el menú móvil sin JavaScript, y la CSP sin `'unsafe-inline'`

Repositorio: `C:\Users\carlo\Downloads\cvr-website` (cvrtasaciones.cl, estático, Netlify, sin build).
Continúa sobre la rama `hermes/20261123-230226` (último commit `884356e`), no sobre `master`.

Tú mismo levantaste el primer defecto al cerrar el encargo anterior, y tenías razón en no mezclarlo
ahí. Va ahora, con el segundo que sale del mismo sitio.

## 1. El menú de navegación no puede depender de JavaScript

Bajo 820 px `.nav__links` está en `display: none` y solo `.nav__links.open` lo muestra; esa clase la
pone un script. Con JavaScript apagado, el botón de menú no responde en las 16 páginas. Se llega a
todo por el pie, pero un menú que no abre en un teléfono es el primer segundo de la visita, y este
sitio se vende como mobile-first.

Resuélvelo en CSS, no con otro script: `<details>`/`<summary>` o `:target`, lo que deje mejor el
teclado y el lector de pantalla. Requisitos:

- abre y cierra sin JavaScript, en las 16 páginas;
- con JavaScript, el comportamiento actual se mantiene o mejora: Escape cierra y devuelve el foco al
  botón, `aria-expanded` refleja el estado, el foco es visible;
- el control sigue midiendo al menos 44×44;
- nada de `<noscript>` que avise del problema: eso es escribir el defecto en la página.

## 2. Saca el JavaScript en línea y endurece la CSP

Hoy `netlify.toml` declara `script-src 'self' 'unsafe-inline'`, y lo necesita porque el script del
menú (y el del formulario) están repetidos dentro de cada HTML. Con `'unsafe-inline'`, la CSP deja
de proteger contra inyección de scripts, que es casi todo lo que esa política aporta en un sitio sin
terceros.

- Mueve todo el JavaScript en línea a uno o dos archivos propios (por ejemplo `sitio.js`), iguales
  para todas las páginas, con `?v=` como el CSS.
- Deja `script-src 'self'`, sin `'unsafe-inline'`.
- Si algún `style="…"` en línea impide quitar también `'unsafe-inline'` de `style-src`, dilo en el
  informe con la lista exacta; no lo quites a medias ni rompas estilos por cumplir.
- No agregues recursos de terceros ni cambias nada más de la CSP.

## Restricciones que siguen vigentes

- No toques `honorarios.js`, `scripts/generar-honorarios.mjs` ni los valores de honorarios.
- No inventes cifras, plazos ni testimonios. No toques `docs/` ni el sitio hermano.
- No hagas push ni despliegues.
- Mantén lo verificado: cero desborde a 320/375/430, toque ≥ 44×44, contraste AA, un solo `h1`,
  cero hex a mano fuera de `:root`, cero `@keyframes`, los honorarios visibles sin JavaScript.
- Sube el `?v=` del CSS solo si cambias el CSS.

## Terminado

Commit en `hermes/20261123-230226`. En el informe, con navegador real:

- el menú abre y cierra **con JavaScript desactivado** a 375 px, en las 16 páginas;
- con JavaScript, Escape cierra y el foco vuelve al botón; `aria-expanded` correcto;
- recorrido de teclado completo en una página de cada tipo;
- cero violaciones de CSP bajo la política nueva, con el formulario de contacto enviando (con y sin
  JavaScript) como ya lo probaste;
- `grep` que demuestre que no queda ningún `<script>` con cuerpo dentro de los HTML;
- los honorarios siguen visibles sin JavaScript y `node scripts/generar-honorarios.mjs --check` sale
  en cero.
