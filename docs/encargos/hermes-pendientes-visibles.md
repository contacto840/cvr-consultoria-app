# Encargo: ningún `{{PENDIENTE}}` puede llegar a la pantalla del cliente

Repositorio: `C:\Users\carlo\Desktop\.cvr-main-integracion` (Next.js, cvrpropiedades.cl).
Parte del trabajo que dejaste sin commitear en el worktree `hermes/20261123-230554`: continúa ahí,
no empieces de nuevo.

Antes de escribir código, lee la guía correspondiente en `node_modules/next/dist/docs/`: esta versión
de Next.js no es la que conoces.

## El defecto

Quedaron marcadores de plantilla que **se renderizan al visitante**:

- `src/app/(sitio)/privacidad/page.tsx`: tres veces, incluida la frase que explica qué significa el
  marcador. Una política de privacidad que muestra `{{PENDIENTE}}` destruye exactamente la confianza
  que el rediseño busca construir, y es la página que un cliente desconfiado va a leer.
- `src/lib/costos-compra.ts`: cuatro notas que la calculadora imprime tal cual junto a cada monto
  (`costos-calculator.tsx` las concatena con ` · ${item.nota}`).

Tu informe declaró honestamente que no podías determinar la región de Vercel ni el país del correo.
Eso es correcto y no cambia: **lo que está mal no es el dato que falta, es publicar el andamio.**

## Qué hay que hacer

Redactar en cada caso una frase verdadera que no prometa un dato que no tenemos y que no deje un
marcador a la vista. No inventes la región, la cuenta ni el arancel.

1. **Privacidad — región de Vercel.** Di lo que sí consta: el alojamiento es Vercel, el tratamiento
   principal ocurre en Estados Unidos, y la región concreta de ejecución se informa por escrito a
   quien la solicite. Quita el marcador y la frase meta que lo explica.
2. **Privacidad — proveedor de correo.** Igual: el correo se envía por un proveedor SMTP, los datos
   del envío se tratan bajo su acuerdo de tratamiento, y el proveedor concreto se informa a
   solicitud. Sin marcador.
3. **Privacidad — aviso de cabecera.** La frase «Los datos marcados con {{PENDIENTE}} no están
   confirmados» desaparece junto con los marcadores. Mantén el aviso de que el texto es una versión
   preliminar pendiente de revisión legal: eso sigue siendo cierto.
4. **`costos-compra.ts`.** Cada nota pasa a decir qué es el valor y con quién se confirma, en la voz
   del sitio: que es un valor referencial y que el monto exacto lo entrega la notaría, el Conservador
   o el banco al momento de la operación. Sin `{{PENDIENTE}}`, sin inventar aranceles.
5. **Deja un registro de lo que sigue faltando** en `docs/datos-pendientes.md` (una línea por dato,
   con quién lo confirma). Que no esté en pantalla no significa que se olvide.

## Un retroceso que hay que revertir

En `src/lib/pdf-generator.ts` quitaste de los descargos la frase «y no aplica una norma de
tasación». Esa frase protege: es la que separa el cálculo automático de un informe normado.
Devuélvela al descargo, con la redacción que tenía.

## Restricciones que siguen vigentes

- No cambies ningún honorario ni inventes plazos, aranceles, cifras ni testimonios.
- No apliques la migración de Prisma. No hagas push ni despliegues.
- No reintroduzcas el cobro en línea ni el precio del informe en la interfaz.
- Mantén lo ya verificado: cero desborde a 320/375/430, áreas de toque ≥ 44×44, contraste AA,
  un solo `h1` por ruta, `prefers-reduced-motion`.

## Terminado

Commit en la rama `hermes/20261123-230554` (incluye lo que ya tenías sin commitear). En el informe:

- `grep -rn "PENDIENTE" src/` no devuelve ninguna cadena que se renderice (solo comentarios de
  código, si queda alguno, y dilo explícitamente);
- capturas o lectura del DOM de `/privacidad` y de la calculadora de costos mostrando el texto nuevo;
- `npx next build --webpack`, `npx tsc --noEmit` y `npx eslint src` en cero;
- la frase de la norma de vuelta en el PDF, citada textual en el informe.
