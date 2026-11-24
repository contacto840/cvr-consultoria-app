# Estándar visual CVR — alto ticket, prioridad móvil

Fuente única para el aspecto de `cvrtasaciones.cl` y `cvrpropiedades.cl`. Escrito el 23 de noviembre de 2026 a partir de una auditoría de los tokens que ya existen en los dos sitios.

Carlos pidió "un estándar alto de página, que sea móvil, buena fluidez, que parezca de alto ticket". Esto lo traduce a valores concretos y verificables, porque "que se vea caro" no se puede auditar y un token sí.

---

## 1. Auditoría: de dónde partimos

**Componentes revisados:** 2 sistemas · **Problema principal:** no son el mismo sistema

| | `cvrtasaciones.cl` | `cvrpropiedades.cl` |
|---|---|---|
| Modo | claro, fondo crema `#f8f6f1` | oscuro, fondo casi negro `#050c17` |
| Dorado | `#c9a84c` | `#c5a85b` |
| Navy | `#1a2e4a` / `#243d62` / `#0d1e33` | `#050c17` / `#091628` / `#0d1f36` |
| Radio | `6px` | `12px` y `8px` |
| Tipografía | Segoe UI del sistema | Inter + Playfair Display |
| Escala de espaciado | no existe (solo `--gutter`) | no existe |
| Escala tipográfica | no existe | no existe |
| Tokens de movimiento | uno (`--trans: 0.25s ease`) | ninguno |
| `prefers-reduced-motion` | no | una regla |
| Valores sin token | 58 hex en el CSS | varios |

### El hallazgo que importa

**Son dos marcas de la misma empresa que se enlazan entre sí, y un cliente que cruza de una a la otra no va a reconocer la misma firma.** Los dos dorados se diferencian en un matiz que nadie percibe como intención, solo como descuido. Las escalas de navy no coinciden en ningún valor. El radio es el doble en un sitio que en el otro.

Eso es justamente lo que separa un sitio que parece de alto ticket de uno que no. La percepción de precio alto no viene de adornos: viene de que todo esté deliberado y repetido sin falla. Dos dorados parecidos son más dañinos que dos colores claramente distintos, porque leen como error.

### Acciones por prioridad

1. **Un solo juego de tokens de marca para los dos sitios.** Mismo dorado, misma escala de navy, mismo radio, misma tipografía, mismo espaciado, mismo movimiento.
2. **Agregar las escalas que faltan**: tipografía fluida, espaciado, elevación y movimiento. Hoy los tamaños y márgenes se eligen a mano cada vez, y eso es lo que produce la sensación de desorden.
3. **Eliminar los valores sin token.** Ningún hex ni ningún `px` suelto donde deba ir una variable.

### Lo que NO cambia

Cada sitio conserva su modo: **tasaciones en claro, propiedades en oscuro**. No es incoherencia, es la diferencia correcta: un sitio de informes se lee como un documento y uno de propiedades necesita que las fotos manden. Con los tokens, la tipografía, el radio y el ritmo compartidos, se reconocen como la misma firma en dos registros. Y conserva el trabajo de contenido ya hecho y auditado, que es bueno.

---

## 2. Tokens

Se declaran en `:root` y **nada se escribe a mano fuera de ahí**.

### Color de marca, compartido

```
--cvr-gold:        #c9a84c   /* el dorado único. Gana el de tasaciones */
--cvr-gold-light:  #e2c47a   /* realces y foco sobre oscuro */
--cvr-gold-ink:    #7d5f1e   /* dorado como TEXTO sobre superficie clara */
--cvr-navy:        #1a2e4a
--cvr-navy-mid:    #243d62
--cvr-navy-deep:   #0d1e33
--cvr-navy-abyss:  #050c17   /* el fondo del sitio oscuro */
```

Regla dura: **`--cvr-gold` no se usa nunca como color de texto sobre superficie clara.** No llega a 4.5:1. Para eso está `--cvr-gold-ink`. El dorado claro es solo para superficies oscuras.

### Superficie, por modo

Cada sitio mapea tokens semánticos a los de marca. El CSS de los componentes usa **solo** los semánticos, y así el mismo componente sirve en los dos sitios:

```
--surface        /* fondo de página */
--surface-raised /* tarjetas */
--surface-sunken  
--ink            /* texto principal */
--ink-soft       /* texto secundario */
--ink-meta       /* metadatos, fuentes, fechas */
--line           /* bordes */
--accent         /* el dorado que corresponda al modo */
--accent-ink     /* el dorado legible como texto en ese modo */
--focus          /* anillo de foco con contraste suficiente en ese modo */
```

### Tipografía fluida

Una familia con serif para titulares y sans para texto, las dos ya presentes en el sitio oscuro. La escala es fluida con `clamp()`, que es lo que hace que no haya saltos entre teléfono y escritorio:

```
--step--1: clamp(0.83rem, 0.80rem + 0.15vw, 0.89rem)
--step-0:  clamp(1.00rem, 0.96rem + 0.20vw, 1.09rem)
--step-1:  clamp(1.20rem, 1.13rem + 0.35vw, 1.37rem)
--step-2:  clamp(1.44rem, 1.33rem + 0.56vw, 1.73rem)
--step-3:  clamp(1.73rem, 1.55rem + 0.88vw, 2.18rem)
--step-4:  clamp(2.07rem, 1.80rem + 1.35vw, 2.75rem)
--step-5:  clamp(2.49rem, 2.08rem + 2.03vw, 3.47rem)
```

Reglas: medida de 60 a 75 caracteres por línea en texto corrido, `line-height` 1.6 en párrafos y 1.15 en titulares, y **nada de texto bajo 16px en móvil**, porque además evita que el navegador haga zoom al enfocar un campo.

### Espaciado

Una escala, y nada fuera de ella:

```
--space-3xs: 0.25rem   --space-2xs: 0.5rem    --space-xs: 0.75rem
--space-s:   1rem      --space-m:   1.5rem    --space-l:  2rem
--space-xl:  3rem      --space-2xl: 4rem      --space-3xl: 6rem
--gutter:    clamp(1rem, 0.5rem + 2.5vw, 2rem)
```

El ritmo vertical entre secciones es lo que más comunica precio. Secciones generosas, no apretadas: `--space-2xl` o `--space-3xl` entre bloques en escritorio, `--space-xl` en móvil.

### Radio, elevación y bordes

```
--radius-sm: 6px   --radius: 10px   --radius-lg: 16px   --radius-pill: 999px
--elev-1: 0 1px 2px rgba(13,30,51,0.06), 0 2px 8px rgba(13,30,51,0.04)
--elev-2: 0 4px 12px rgba(13,30,51,0.08), 0 12px 32px rgba(13,30,51,0.06)
--elev-3: 0 8px 24px rgba(13,30,51,0.10), 0 24px 56px rgba(13,30,51,0.08)
```

En modo oscuro las sombras no se ven: ahí la elevación se expresa con un borde de un píxel más claro y un fondo un paso más alto, nunca con una sombra más negra.

Una sola sombra fuerte por pantalla como máximo. Las sombras grandes y repetidas abaratan.

### Movimiento

```
--dur-fast: 120ms   --dur: 200ms   --dur-slow: 320ms
--ease:     cubic-bezier(0.2, 0, 0.2, 1)
--ease-out: cubic-bezier(0, 0, 0.2, 1)
```

Obligatorio, y es el punto que hoy falta en los dos sitios:

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

Solo se animan `transform` y `opacity`. **Nunca** `width`, `height`, `top`, `left`, `margin` ni `box-shadow`: eso provoca recálculo de layout y es exactamente la falta de fluidez que Carlos nota. Nada que se mueva solo, nada en bucle, ningún carrusel automático.

---

## 3. Componentes: estados obligatorios

Ningún componente se da por terminado sin los cinco estados. La falta de estados es el delator más claro de un sitio barato: un botón que no responde al pasar el cursor se siente roto aunque funcione.

| Componente | Variantes | Estados exigidos |
|---|---|---|
| Botón | primario, secundario, fantasma, WhatsApp | reposo, hover, foco visible, activo, deshabilitado, cargando |
| Campo de formulario | texto, número, área, casilla, radio | reposo, foco, relleno, error, deshabilitado, solo lectura |
| Tarjeta | servicio, propiedad, dato | reposo, hover si es enlace, foco si es enlace |
| Tabla | honorarios, comparación, datos | encabezado fijo si desplaza, contenedor con foco, vacía |
| Insignia | dato propio, por confirmar, a cotizar | una sola, sin hover |
| Herramienta interactiva | las cinco del proyecto | inicial sin resultado, calculando, resultado, entrada inválida |
| Aviso | descargo, error, éxito | estático, anunciado a lectores de pantalla cuando cambia |

Reglas transversales:

- **Área de toque mínima 44×44 px** en todo control, con el espaciado que haga falta alrededor. Es la causa número uno de que un sitio se sienta mal en teléfono.
- Foco visible siempre, con anillo de 3px y 2px de separación, en un color que contraste con **su** superficie. Nunca `outline: none` sin reemplazo.
- Nada depende solo del color: un error lleva texto, un estado lleva etiqueta.

---

## 4. Móvil y fluidez: criterios medibles

Esto es lo que se audita, y lo que no se cumple se devuelve.

**Disposición**
1. Ningún desborde horizontal entre 320 y 430 px de ancho. Se mide con `scrollWidth` igual al ancho del viewport, página por página.
2. Canal lateral de 16 px como mínimo en teléfono.
3. Todo contenedor con `overflow-x` lleva `role="region"`, `tabindex="0"` y `aria-label`, y el texto de ayuda no supone un dedo: menciona también el tabulador.
4. Todo contenedor de grid o flex que aloje algo ancho usa `minmax(0, 1fr)` y `min-width: 0`. Sin eso, el ancho mínimo del contenido estira la página entera, que es el defecto que ya apareció una vez en la calculadora de costos.

**Rendimiento y estabilidad**
5. Desplazamiento de disposición acumulado (CLS) por debajo de 0,05. Toda imagen y todo video con `width` y `height` o `aspect-ratio` declarados, para que nada salte al cargar.
6. Mayor elemento visible (LCP) bajo 2,5 s en 4G simulado.
7. Ninguna animación que toque propiedades de layout. Ninguna tarea larga que bloquee el hilo al cargar.
8. Fuentes con `font-display: swap` y precarga de la que se use en el titular. Si una fuente es externa, se autohospeda: ningún recurso de terceros, que además ya está prohibido en los dos sitios.
9. Imágenes en formato moderno, dimensionadas al uso real y con `loading="lazy"` salvo la del primer pliegue.

**Percepción de alto ticket**
10. Jerarquía tipográfica clara, con pocos tamaños y mucho contraste entre el titular y el texto. Un sitio caro tiene menos variedad, no más.
11. Espacio en blanco generoso y constante. El ritmo repetido es lo que lee como cuidado.
12. Un acento, no tres. El dorado se gana apareciendo poco: en el acento de un titular, en el borde de una tarjeta destacada, en el botón principal. Si está en todo, no destaca nada.
13. Toda cifra visible lleva su fuente y su fecha. En servicios periciales la credibilidad *es* el lujo.
14. Ningún recurso genérico de banco de imágenes que contradiga lo anterior. Antes que una foto de archivo de un apretón de manos, no va ninguna foto.

**Accesibilidad, que es parte del estándar y no un extra**
15. WCAG 2.2 AA: 4.5:1 en texto normal, 3:1 en texto grande y en componentes de interfaz.
16. Un solo `<h1>` por página, sin saltos de nivel.
17. Recorrido completo con teclado, en orden lógico, con enlace para saltar al contenido.
18. Todo campo con su `<label>` asociada y los errores anunciados.

---

## 5. Tabla de honorarios

Carlos pidió una tabla de honorarios. Va en los dos sitios, cada uno con sus servicios, **y se construye desde un solo archivo de datos** para que actualizar un precio sea cambiar una línea y no buscar por el código.

Columnas, en este orden:

| Servicio | Qué incluye | Qué determina el precio | Honorario |
|---|---|---|---|

- **Qué incluye** es la columna que justifica el precio. Es la que hay que escribir bien: qué recibe el cliente, en qué formato, con qué alcance.
- **Qué determina el precio** evita la conversación incómoda: deja claro por qué dos encargos parecidos cuestan distinto.
- **Honorario** admite tres formas y ninguna más: una cifra, `Desde $X` cuando hay un mínimo real, o **`A cotizar`**.

### Regla que no se negocia

**Mientras Carlos no entregue las cifras, la columna dice `A cotizar` y no se inventa ningún número, ningún rango ni ningún "desde".** Una tabla con la columna en "a cotizar" es un entregable completo y legítimo para servicios periciales: comunica el alcance, que es lo que convence, y no compromete un precio. Una tabla con precios inventados es una oferta comercial falsa que después obliga a Carlos.

Debajo de cada tabla, una línea fija: el honorario se fija por escrito antes de empezar y no varía después, salvo que cambie el alcance acordado.

### Servicios de `cvrtasaciones.cl`

Tasación comercial de inmuebles · Informe pericial para causa judicial · Tasación de derechos de aprovechamiento de aguas · Tasación de renta de arriendo · Estudio de títulos · Due diligence predial · Matriz de riesgo hídrico · Regularización de herencias.

### Servicios de `cvrpropiedades.cl`

Venta de propiedades · Arriendo y administración · Asesoría de compra · Programa de corredores asociados.

---

## 6. Dos hechos que quedan fijos

**No está inscrito en la lista de peritos.** Carlos lo confirmó el 23 de noviembre de 2026. Los sitios dicen lo que sí hace, emitir informes periciales de parte para causas judiciales, y no insinúan inscripción, registro, nómina ni nombramiento en ningún tribunal, Corte ni institución. El texto de `nosotros.html` que hoy dice "mientras no esté confirmada" se reescribe en afirmativo: ya está confirmado que no, y dejarlo como pendiente sugiere que podría llegar.

**Su calificación profesional** se expresa con la fórmula verificable de [credenciales-publicables.md](credenciales-publicables.md): Administrador Público, diplomado en Tasación Inmobiliaria y Agrícola (Braniff, 2022), aprobado en el Curso de Tasación Inmobiliaria de la Universidad Adolfo Ibáñez (2026), diplomado en Recursos Hídricos (Universidad de Concepción, 2026). Nada de "certificado". El diplomado de Derecho Inmobiliario de la UNAB, en curso.
