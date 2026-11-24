# Encargo: dejar cvrtasaciones.cl listo para publicar

## Contexto

Repositorio: `C:\Users\carlo\Downloads\cvr-website`. Es el sitio `cvrtasaciones.cl` de CVR Tasaciones, la línea de peritajes y tasaciones de CVR Propiedades SpA (Carlos Vivanco Riquelme, Chillán, Región de Ñuble). Sitio estático de HTML, CSS y JavaScript propio, publicado con Netlify. Catorce páginas. Ya pasó una auditoría y está integrado en `master`.

Quedan cuatro marcadores `{{PENDIENTE}}` y uno de ellos deja el formulario de contacto sin funcionar. Carlos pidió que el sitio quede funcionando sin tener que decidir nada más. **Los cuatro se cierran sin inventar ningún dato**, y así hay que hacerlo: si en algún punto te falta un hecho, no lo rellenes, deja el marcador y dilo en el informe.

---

## 1. Los dos honorarios

En `tasacion-derechos-agua.html:120` y `tasacion-renta-arriendo.html:119`:

```html
<div class="price-box__value"><span class="pendiente">{{PENDIENTE: monto del honorario}}</span></div>
```

Carlos no va a publicar un monto. En las dos páginas, el párrafo que viene inmediatamente después ya explica bien de qué depende el honorario y dice que la cotización se entrega por escrito tras la evaluación inicial, así que no falta información: falta sacar la cifra que no existe.

Reemplaza el contenido de ese `price-box__value` por **`A cotizar`**, con el mismo tratamiento visual que tendría un monto, y quita la clase `pendiente` de ahí. Revisa si la clase `.pendiente` queda sin uso en todo el sitio y, si es así, elimínala también del CSS.

No agregues rangos, ni "desde", ni cifras de referencia, ni ejemplos de precio. Ni en estas páginas ni en ninguna otra.

## 2. La inscripción en la lista de peritos

En `nosotros.html:175` hay un comentario HTML:

```html
<!-- {{PENDIENTE: inscripción en lista de peritos, confirmar con Carlos}} -->
```

El texto visible de esa página ya resuelve el asunto correctamente: dice que el sitio no declara la inscripción y que mientras no esté confirmada se dice lo que sí se hace, emitir informes periciales de parte para causas judiciales. Eso es exacto y se queda tal cual.

**Borra solo el comentario.** No toques el texto visible, no agregues ninguna afirmación sobre inscripción, registro, nómina o nombramiento en ningún tribunal, Corte o institución.

## 3. El formulario de contacto: pasar a Netlify Forms

`contacto.html:113` apunta a `https://formspree.io/f/{{PENDIENTE:ID_FORMSPREE}}`. Antes de este trabajo apuntaba a `https://formspree.io/f/contacto@cvrpropiedades.com`, que nunca fue un endpoint válido: **el formulario del sitio no ha funcionado nunca**. Quien haya escrito por ahí no llegó a Carlos.

Formspree exige crear una cuenta y copiar un ID. Netlify Forms no: viene incluido en el hosting que el sitio ya usa y no necesita cuenta ni clave. Pásalo a Netlify Forms.

Lo que hay que resolver:

1. El `<form>` con `method="POST"`, un atributo `name` propio y `data-netlify="true"`. Netlify detecta el formulario en el HTML desplegado; lee la documentación de Netlify Forms antes de escribirlo y no supongas la API de memoria.
2. **Protección contra spam sin servicios de terceros.** Usa el campo trampa de Netlify (`data-netlify-honeypot`) con su campo oculto correspondiente, bien escondido y marcado para que un lector de pantalla no lo anuncie ni lo pida. **No agregues reCAPTCHA ni ningún widget externo**: metería scripts y cookies de terceros, que están prohibidos en este sitio y obligarían a un banner de consentimiento.
3. El envío por JavaScript ya existe en la página: adáptalo para que publique al destino que Netlify espera, con el cuerpo codificado como corresponde, y que siga mostrando el mensaje de éxito y de error en la propia página sin recargar. Si el envío falla, el mensaje debe seguir ofreciendo WhatsApp como alternativa, como hace hoy.
4. **Tiene que funcionar también sin JavaScript**: con el formulario nativo, Netlify acepta el envío igual. Verifica que el `form` funcione sin el interceptor, y si Netlify necesita una página de agradecimiento para ese caso, créala con la estética del sitio y en la misma línea sobria del resto.
5. Actualiza el `Content-Security-Policy` de `netlify.toml`: hoy permite `connect-src https://formspree.io` y `form-action 'self' https://formspree.io`. Quita formspree de las dos y deja lo mínimo que Netlify Forms necesite. **No aflojes la política para que algo funcione**: si hace falta un permiso, agrégalo acotado y justifícalo en el informe.
6. Busca en todo el repositorio cualquier otra mención a formspree —en HTML, CSS, JavaScript, comentarios o `netlify.toml`— y déjala consistente. No pueden quedar restos.
7. Netlify Forms tiene un tope de envíos en el plan gratuito. Averigua cuál es y anótalo en el informe para que Carlos lo sepa; no hace falta que lo pongas en el sitio.

## 4. Revisión final de publicación

Antes de cerrar, recorre las catorce páginas y verifica:

1. **No queda ningún `{{PENDIENTE` ni `{{RUT_PENDIENTE` en ningún archivo.** Si alguno no pudiste cerrar sin inventar un dato, déjalo y dilo en el informe: es la única razón admitida para que sobreviva uno.
2. El pie legal está completo y es el mismo en las catorce: `CVR Tasaciones es la línea de peritajes y tasaciones de CVR Propiedades SpA · RUT 78.342.064-3 · Chillán, Región de Ñuble`.
3. No hay enlaces internos rotos, y los enlaces a `cvrpropiedades.cl` son los de la línea inmobiliaria, con el rótulo correcto.
4. `sitemap.xml` lista las catorce páginas reales, todas con el dominio `cvrtasaciones.cl`, sin ninguna que no exista y sin dejar fuera las dos nuevas ni `terminos.html`. `robots.txt` apunta al sitemap de este dominio.
5. Ninguna cita normativa con artículo o cláusula. Las únicas referencias admitidas son NCh 3658/1:2021, NCh 3658/2:2022 e IVS 2025, por número y título.
6. Ninguna cifra de experiencia, ningún "años en el mercado", ningún "certificado". Ningún testimonio de cliente.
7. Un solo `<h1>` por página, contraste WCAG 2.2 AA, navegación completa con teclado con foco visible, ningún desborde horizontal a 375 px con 16 px de margen, y los contenedores con `overflow-x` con `role="region"`, `tabindex="0"` y `aria-label`.
8. Cero scripts, estilos, fuentes, imágenes o iframes de terceros. Todo del propio dominio.
9. Las tres herramientas interactivas funcionan, muestran su fórmula o criterio y llevan el descargo visible sin desplazar.

Si en esta revisión encuentras algo roto, arréglalo y dilo. Si encuentras algo que **no** puedes arreglar sin una decisión de Carlos, déjalo y anótalo con precisión.

---

## Prohibido

- **No inventes ningún dato de negocio**: honorarios, montos, rangos, plazos, descuentos, condiciones de pago, garantías ni políticas de reembolso.
- **No inventes hechos sobre Carlos**: credenciales, inscripciones, años de experiencia, cantidad de informes, clientes, domicilio ni cargos.
- **No inventes citas normativas**: ninguna cláusula, artículo ni definición atribuida a una norma.
- No inventes ni redactes testimonios de clientes, ni casos presentados como reales.
- No agregues dependencias, frameworks, CDN, fuentes externas, analítica ni cookies no esenciales.
- No cambies el stack: HTML, CSS y JavaScript propio.
- No toques `docs/` de ningún repositorio, ni el repositorio `cvr_consultoria_app`. Ahí hay otro encargo en curso.
- **No despliegues, no hagas push, no borres nada fuera del alcance.** Trabajas en un worktree aislado. Publicar lo decide Carlos.

## Criterio de terminado

El sitio queda publicable: ningún marcador a la vista, el formulario de contacto envía de verdad, y los nueve puntos de la revisión final verificados uno por uno con evidencia.

## Qué entregar

En tu rama, dentro del worktree:

1. Los archivos modificados y los nuevos.
2. Un `INFORME-HERMES.md` en la raíz del worktree con:
   - archivos creados y modificados, uno por línea, con qué cambió en cada uno;
   - **cómo probaste que el formulario envía**: qué hiciste, qué respondió, y qué pasa si el envío falla y si no hay JavaScript. Si no pudiste probar un envío real porque requiere el sitio desplegado en Netlify, **dilo con esas palabras** y explica qué sí verificaste (el marcado que Netlify exige, el destino, el cuerpo, la política de seguridad) y qué queda por comprobar en el primer despliegue;
   - el tope de envíos del plan gratuito de Netlify Forms, con la fuente;
   - qué documentación de Netlify Forms consultaste;
   - el resultado de los nueve puntos de la revisión final, punto por punto, con el comando o la herramienta que usaste en cada uno;
   - la confirmación de que no queda ningún `{{PENDIENTE` en el repositorio, con la salida del comando que lo comprueba;
   - qué no alcanzaste a hacer, y qué dejaste sin cerrar por necesitar una decisión de Carlos.

No afirmes haber hecho algo que no hiciste. Tu informe se audita contra el diff y contra el disco, archivo por archivo, y las catorce páginas se prueban en un navegador a 375 px. En el encargo anterior sobre este mismo sitio declaraste cero problemas de estructura y había dos tablas desplazables que un usuario de teclado no podía recorrer. Lo que no puedas comprobar, dilo como no comprobado: eso no se te reprocha, inventarlo sí.
