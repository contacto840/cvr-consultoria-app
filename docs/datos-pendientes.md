# Datos pendientes

Registro de lo que el sitio todavía no puede afirmar. Desde el 24 de noviembre de
2026 ningún marcador de plantilla se renderiza: donde falta un dato, la página
publica la parte que sí consta y dice con quién se confirma el resto, y el dato
vivo queda anotado acá. Una línea por dato.

Este archivo reemplaza el formulario de 19 preguntas que estaba antes (commit
`960f2c3`): los honorarios, el precio del informe y el domicilio ya quedaron
resueltos en el código y en `/honorarios`.

| Dato que falta | Quién lo confirma | Dónde se usa |
| --- | --- | --- |
| Región de ejecución del proyecto en Vercel | Cuenta de Vercel de CVR Propiedades, en la configuración del proyecto | `/privacidad`, sección 4 |
| Proveedor SMTP concreto que envía la estimación y los avisos | Credenciales de producción (`SMTP_HOST`) y el proveedor que las emitió | `/privacidad`, sección 4 |
| País donde ese proveedor SMTP procesa los datos | El mismo proveedor, según su acuerdo de tratamiento | `/privacidad`, sección 4 |
| Tasa y tope vigentes del impuesto de timbres para crédito hipotecario | El banco o el contador de CVR Propiedades | `/herramientas/costos-de-compra`, ítem «Impuesto de timbres y estampillas» |
| Arancel notarial de referencia | La notaría con la que se firme la operación | `/herramientas/costos-de-compra`, ítem «Gastos notariales» |
| Arancel de inscripción del Conservador de Bienes Raíces de Chillán | El Conservador de Bienes Raíces de Chillán | `/herramientas/costos-de-compra`, ítem «Inscripción en el Conservador» |
| Valores de los certificados municipales (informaciones previas y otros) | La municipalidad correspondiente | `/herramientas/costos-de-compra`, ítem «Certificados y trámites previos» |
| Valor del certificado de avalúo del SII | El SII | `/herramientas/costos-de-compra`, ítem «Certificados y trámites previos» |
| Plazos de conservación por categoría (12 meses, 24 meses y publicaciones) | La abogada de CVR Propiedades SpA | `/privacidad`, secciones 2 y 5 |
| Revisión legal completa de la política, incluida la sección 4 de transferencias internacionales | La abogada de CVR Propiedades SpA | `/privacidad`, aviso de cabecera |

## Regla de redacción

Mientras un dato de esta tabla no esté confirmado, no se publica ni se marca en
pantalla: se publica lo que consta y se dice con quién se confirma el resto. Un
marcador visible no es transparencia; es una tarea sin terminar a la vista de un
cliente que entró a la política de privacidad para decidir si confía.

## Pendientes que no son datos de pantalla

- Inscripción en la lista de peritos de la Corte de Apelaciones de Chillán: por
  confirmar con Carlos. La regla de qué se publica vive en
  `docs/credenciales-publicables.md`, regla 7.
- Plazo de entrega y política de reembolso de un informe encargado: decisión de
  Carlos. El sitio no publica un plazo propio: dice que se acuerda por escrito en
  cada encargo.
