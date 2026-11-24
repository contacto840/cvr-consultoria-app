# Datos pendientes para publicar los dos sitios

Llena este archivo y con él armo el encargo a Hermes para que reemplace los marcadores en los dos repositorios de una sola pasada. También puedes contestarme en el chat si prefieres; esto es solo para que no se te pierda ninguno.

Escribe tu respuesta después de la flecha. Si algo no aplica o lo quieres dejar fuera del sitio, escribe `OMITIR` y se elimina el párrafo completo en vez de quedar a medias.

Hay 19 decisiones. Las de la sección A y B son las que más bloquean, porque sin ellas las páginas de servicio no se pueden publicar.

---

## A. Honorarios

**1. Venta de propiedades** — porcentaje de comisión y sobre qué se calcula, más las condiciones (si hay mínimo, si incluye IVA, qué incluye el servicio).
→

**2. Arriendo y administración** — qué cobras por la gestión del arriendo y qué por la administración mensual.
→

**3. Asesoría de compra** — es el servicio de alto ticket del sitio de propiedades.
→

**4. Programa de corredores asociados** — condiciones y cómo se reparte la comisión.
→

**5. Tasación de derechos de aprovechamiento de aguas**
→

**6. Tasación de renta de arriendo**
→

**7. El precio de la tasación pagada está en $15.000** en `src/lib/encargo.ts`. Ese valor no lo pusiste tú para este servicio: es el que venía en el flujo de MercadoPago. Confirma el precio real o dime el nuevo.
→

Si prefieres no publicar precios y dejar todo "a cotizar", escribe `A COTIZAR` en los que correspondan. Es una decisión legítima para servicios periciales, y más segura que publicar una cifra que después no puedas sostener.

---

## B. Cómo opera el encargo

**8. Plazo de entrega del encargo de tasación**, contado desde cuándo (desde el pago, desde la inspección, desde que llegan los documentos). Hoy la pantalla de pago promete un trabajo humano sin decir cuánto demora, y eso es lo que un cliente reclama.
→

**9. Política de reembolso y cancelación** — qué pasa si el cliente se arrepiente antes de la inspección, y después de ella.
→

---

## C. Quién firma

**10. Tu calificación profesional exacta.** Ya te propuse una fórmula que se sostiene en tres documentos tuyos: *"Administrador Público, diplomado en Tasación Inmobiliaria y Agrícola (Braniff, 2022) y aprobado en el Curso de Tasación Inmobiliaria de la Universidad Adolfo Ibáñez (2026)"*. Escribe `ACEPTO` si te sirve, o la que quieras usar.
→

**11. ¿Estás inscrito en la lista de peritos de la Corte de Apelaciones de Chillán?** Responde `SÍ` y con qué nombre exacto aparece, o `NO`. Si es no, el sitio dirá que emites informes periciales para causas judiciales, sin insinuar una inscripción que no tienes.
→

**12. Domicilio legal y correo para asuntos de privacidad.** El domicilio tiene que ser uno que puedas recibir notificaciones. Si no quieres publicar una dirección particular, dime una casilla o la dirección de una oficina.
→

---

## D. Formulario de contacto

**13. ID de Formspree.** Esto no te lo puedo pedir hecho: hay que crear el formulario en formspree.io con tu cuenta y copiar el ID que te dan (es algo como `xqaklabc`, no un correo). Mientras no esté, el formulario de contacto de cvrtasaciones.cl no funciona, y hoy tampoco funcionaba antes de este trabajo.
→

Si prefieres no usar Formspree, dímelo y encargo que el formulario se resuelva con Netlify Forms, que ya viene incluido en tu hosting y no necesita cuenta aparte. Es lo que yo haría.

---

## E. Datos que hay que cotizar o consultar

Estos no los sabes de memoria y no conviene inventarlos. Hasta tenerlos, la calculadora de costos los muestra como "a cotizar" y **no los suma**, así que el sitio puede publicarse sin ellos sin decir nada falso.

**14. Arancel notarial de referencia** — con la notaría con la que trabajas.
→

**15. Arancel de inscripción del Conservador de Bienes Raíces de Chillán**
→

**16. Tasa y tope vigentes del impuesto de timbres y estampillas** para crédito hipotecario, con tu contador o un banco. Hoy la calculadora usa 0,066% mensual con tope de 90 días, marcado "Por confirmar", y **esa cifra sí suma al total**. Si está mal, un cliente presupuesta mal.
→

**17. Valores de certificados municipales y del certificado de avalúo del SII**
→

---

## F. Para tu abogada

**18. Plazos de conservación de datos**, por categoría: consultas de contacto, solicitudes de estimación de valor, y publicaciones de propiedades. La Ley 21.719 pide decir cuánto tiempo se guarda cada cosa y no sirve poner "indefinidamente".
→

**19. Transferencia internacional de datos.** Esto lo encontré yo y no estaba en la lista: tu base de datos está en **Neon** y el sitio en **Vercel**, los dos fuera de Chile. Eso significa que los datos personales de quien llena un formulario salen del país, y la ley obliga a declararlo, decir a qué países van y con qué garantía contractual. La página de privacidad tiene el párrafo escrito pero sin esos datos. Tu abogada tiene que revisar este punto, no solo rellenarlo.
→

---

## Lo que no te estoy preguntando porque es trabajo, no dato

- **El valor de la UF está fijo en el código.** El estimador convierte a pesos con una UF que no se actualiza, así que la cifra en pesos se va desviando día a día. Esto es un encargo para Hermes, no una decisión tuya: hay que leer la UF de la fuente oficial y, mientras no se pueda, mostrar solo UF y no pesos.
- **El panel de administración y el formulario de agregar propiedades** quedaron funcionando pero con la estética antigua. Dime si lo encargo.
