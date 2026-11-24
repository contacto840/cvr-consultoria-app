# Tablas de honorarios CVR

Decididas el 23 de noviembre de 2026 con la autonomía que dio Carlos, a partir de una investigación del mercado chileno. **Cada cifra dice de dónde sale.** Donde no existe tarifa publicada, se dice que es una decisión de posicionamiento y con qué criterio se tomó, para que Carlos pueda discutir el criterio y no solo el número.

Todo se expresa en **UF más IVA**. En UF porque es como se cotiza el rubro en Chile y porque protege el honorario de la inflación sin renegociar. Con IVA explícito porque omitirlo es la causa más común de discusión al facturar.

Estas son las cifras que van a los sitios. Si Carlos cambia una, se cambia en un solo archivo de datos.

---

## 1. Qué dice el mercado

Resumen de lo encontrado. Las fuentes están al final.

| Dato | Valor de mercado | Calidad de la fuente |
|---|---|---|
| Comisión de venta | 2% + IVA del precio, por cada parte. Rango citado 1% a 4% | Convención firme, repetida en varias corredoras |
| Comisión de arriendo | 50% de la primera renta + IVA, por parte. Rango 50% a 100% | Convención firme |
| Administración de arriendo | 7% a 10% de la renta mensual + IVA | Convención |
| Tasación bancaria | 2,5 UF (Itaú, Banco de Chile). BancoEstado desde 2,75 UF | Tarifario de bancos, firme |
| Tasación de vivienda, tasador independiente | 2,5 a 3,5 UF + IVA. Rango general 2 a 10 UF. En pesos, $150.000 a $400.000 | Sitios comerciales, orientativo |
| Mínimo gremial | 6,0 UF, Tabla del Colegio de Arquitectos, recomendada por ASATCH | Referencia gremial citada de segunda mano. **No la verifiqué en la fuente original** |
| Recargo por peritaje judicial | Hasta 100% sobre el honorario habitual | Coincide en dos fuentes |
| Quién paga al perito | La parte que solicita la diligencia, y puede pagarse contra entrega del informe | Nota de jurisprudencia |
| Tasación de derechos de agua | **No existe tarifa publicada.** Ningún proveedor del rubro publica precios | Verificado: busqué y no hay |
| Estimación automatizada en línea | $8.990 a $9.990 | Tarifa publicada de plataformas |

### Las dos conclusiones que mandan

**No hay que competir con la tasación bancaria.** Un banco cobra 2,5 UF por una tasación hecha para decidir un crédito, con alcance mínimo y sin inspección en muchos casos. Entrar a ese precio obliga a trabajar con el alcance de un banco y destruye el margen. El mercado de Carlos es el otro: el informe que se presenta a una contraparte, a un tribunal o a una partición, donde lo que se compra es que resista el examen.

**Donde no hay tarifa publicada hay margen, no vacío.** En derechos de agua ningún competidor publica precios, y los derechos mismos se transan entre 1,5 y 68 millones de pesos por litro por segundo según la cuenca. Un honorario de tasación proporcional a un activo así no es caro: es irrelevante frente al valor en juego. Ahí el precio lo fija el alcance, no la competencia.

---

## 2. El problema que esto corrige

El código tenía el informe de tasación en **$15.000**, heredado del flujo de pago, no elegido. Eso es menos de la mitad de lo que cobra un banco por el trabajo más liviano del rubro, y menos de un décimo del mínimo gremial. Por esa cifra el informe con inspección y firma se entrega a pérdida o no se entrega, y las dos cosas terminan en un reclamo.

**Decisión:** la estimación automática en línea queda **gratis**, como herramienta de captación. El mercado cobra $8.990 por eso mismo, y regalarlo a cambio de un contacto califica mejor que cobrarlo. Lo que se vende es la tasación de verdad, al precio de abajo. El pago automático del informe se retira: ese servicio se cotiza y se acepta por escrito.

---

## 3. `cvrtasaciones.cl` — línea de informes

| Servicio | Qué incluye | Qué determina el precio | Honorario |
|---|---|---|---|
| **Estimación referencial en línea** | Valor estimado a partir de valores de referencia por comuna, sector, tipo y estado. Resultado inmediato. No lleva firma ni sirve para trámites | — | **Sin costo** |
| **Tasación comercial de inmuebles** | Inspección en terreno, homologación de comparables, informe firmado con metodología declarada conforme a NCh 3658/1:2021 e IVS 2025 | Tipo de inmueble, superficie, ubicación, cantidad de comparables verificables | **Desde 6 UF + IVA** |
| **Tasación de renta de arriendo** | Renta de mercado a una fecha, con comparables de arriendo verificados y control por capitalización | Tipo de inmueble, comparables disponibles, si es para negociar o para juicio | **Desde 5 UF + IVA** |
| **Informe pericial para causa judicial** | Informe de parte con el alcance que fije el tribunal, respaldo documental completo y disponibilidad para aclaraciones | Materia, antigüedad de los hechos, volumen del expediente, fecha de valorización que pida el tribunal | **Desde 12 UF + IVA** |
| **Tasación de derechos de aprovechamiento de aguas** | Revisión del expediente DGA, verificación de inscripción en el Conservador, comparables por cuenca, informe firmado | Número de derechos, cuenca, consuntivo o no consuntivo, estado de regularización del título | **Desde 15 UF + IVA** |
| **Estudio de títulos** | Revisión de los títulos de los últimos diez años, certificados del Conservador, gravámenes, prohibiciones y vigencia | Número de inscripciones, antigüedad, si hay herencias o subdivisiones en la cadena | **Desde 8 UF + IVA** |
| **Due diligence predial** | Estudio de títulos más situación municipal, recepción de obras, deslindes, servidumbres y situación hídrica | Superficie, rural o urbano, número de roles, complejidad de la cadena | **Desde 18 UF + IVA** |
| **Matriz de riesgo hídrico del predio** | Riesgo hídrico del predio que se va a comprar: derechos inscritos, caudal, seguridad de entrega, organización de usuarios | Cuenca, número de derechos asociados, calidad de la información disponible | **Desde 8 UF + IVA** |
| **Regularización de herencias** | Diagnóstico de la situación sucesoria, qué falta inscribir, en qué orden y con qué documentos | Número de herederos, inscripciones pendientes, antigüedad de la sucesión | **Desde 12 UF + IVA** |

### Cómo se justifica cada cifra

- **6 UF** en tasación comercial: es el mínimo gremial citado para el rubro, y queda por encima de la tasación bancaria de 2,5 UF porque el alcance es mayor. En pesos son unos $234.000, dentro del rango de $150.000 a $400.000 que se cita para un tasador independiente. Posicionado en la mitad alta de ese rango, no en el techo.
- **12 UF** en peritaje judicial: es el mínimo de 6 UF con el recargo del 100% por peritaje judicial que describen dos fuentes. No es una invención: es la regla del mercado aplicada.
- **15 UF** en derechos de agua: **decisión de posicionamiento, no dato de mercado**, porque no existe tarifa publicada. El criterio: exige revisar expediente DGA, verificar inscripción y construir comparables por cuenca, que es más trabajo que una tasación de vivienda, y es el servicio con menos competencia y con formación específica detrás. Frente a un derecho que puede valer decenas de millones por litro por segundo, es proporcionado.
- **5 UF** en renta de arriendo: por debajo de la tasación comercial porque el alcance documental es menor, pero sobre la bancaria porque requiere comparables de arriendo verificados, que son más difíciles de obtener que los de venta. Si es para juicio, aplica el recargo judicial.
- **8, 12 y 18 UF** en títulos, herencias y due diligence: **decisiones de posicionamiento**, sin tarifa de mercado encontrada. Criterio: escalan con el volumen documental real de cada uno, y el due diligence es el más caro porque contiene al estudio de títulos y le suma lo municipal, lo físico y lo hídrico.

### Recargos, declarados en la tabla y no en la letra chica

- **Peritaje judicial: +100%** sobre el honorario del servicio equivalente. Es la convención del rubro y se declara abiertamente.
- **Urgencia** bajo la mitad del plazo normal: +50%.
- **Fuera de la Región de Ñuble**: traslado y estadía, contra documento, acordados antes de aceptar.

---

## 4. `cvrpropiedades.cl` — línea de operaciones

| Servicio | Qué incluye | Qué determina el precio | Honorario |
|---|---|---|---|
| **Venta de propiedades** | Fijación de precio de lista con respaldo, publicación, gestión de visitas, negociación y acompañamiento hasta la escritura | Precio de cierre | **2% + IVA del precio, por parte** |
| **Arriendo** | Selección y evaluación del arrendatario, contrato y entrega con acta | Monto de la renta | **50% de la primera renta + IVA, por parte** |
| **Administración mensual** | Cobro, rendición mensual, coordinación de reparaciones y renovación del contrato | Renta mensual | **8% de la renta mensual + IVA** |
| **Asesoría de compra** | Acompañamiento al comprador antes de firmar: qué revisar, qué pedir, qué riesgos tiene el predio y qué informe corresponde | Tipo de propiedad y alcance acordado | **Honorario fijo desde 20 UF + IVA** |
| **Corredores asociados** | Colaboración en captación y cierre | Comisión de la operación | **Reparto 50/50 de la comisión de la parte aportada** |

### Cómo se justifica cada cifra

- **2% + IVA por parte** en venta: es el estándar más repetido del mercado chileno, dentro del rango citado de 1% a 4%. No hay razón para cobrar menos ni ventaja en cobrar más: en corretaje el precio no es el diferenciador.
- **50% de la primera renta** y **8% de administración**: convención de mercado. El 8% es el punto medio del rango 7% a 10%.
- **Honorario fijo en asesoría de compra, y no un porcentaje.** Esta es la decisión más importante de la tabla y es deliberada. Si la asesoría se cobrara como porcentaje del precio, el asesor gana más cuando el cliente compra y cuando compra caro, y eso es precisamente el conflicto de interés que el servicio dice resolver. **Un honorario fijo significa que a CVR le da lo mismo si usted compra o se arrepiente, y eso es lo que el cliente está comprando.** Hay que decirlo así en la página: es el argumento de confianza más fuerte que tiene el sitio y no cuesta nada sostenerlo.
- **20 UF** en asesoría de compra: decisión de posicionamiento, no hay mercado comparable porque casi nadie vende el servicio por separado. Son unos $780.000 frente a una compra que rara vez baja de 2.000 UF, es decir bajo el 1% de la operación, contra el riesgo de comprar un predio con el título mal. Sostenible de explicar.
- **Reparto 50/50** entre corredores: práctica habitual del rubro.

### Una decisión que conviene declarar

En Chile es costumbre que la comisión la paguen **ambas partes**. No está fijado por ley y se pacta libremente. Conviene decirlo explícitamente en la página: quién paga qué, antes de que alguien firme una orden de corretaje. Es información que la mayoría de los sitios esconde y publicarla genera exactamente la confianza que Carlos pidió.

---

## 5. Reglas de presentación en los sitios

1. **El honorario se fija por escrito antes de empezar y no varía después**, salvo que cambie el alcance acordado. Esta línea va debajo de las dos tablas, y es la que más tranquiliza.
2. **"Desde" significa un mínimo real**, no un gancho. Si un encargo va a costar más, se dice antes de aceptarlo y se explica qué lo sube. La columna "qué determina el precio" existe para que nadie se sorprenda.
3. **IVA siempre explícito.** Nunca un precio sin decir si lo incluye.
4. **UF con su valor y su fecha a la vista** cada vez que se muestre el equivalente en pesos. Si el valor de la UF no está disponible, se muestra solo UF.
5. **Los recargos van en la tabla**, no en una nota al pie. Un recargo escondido destruye en un minuto la confianza que la tabla construyó.
6. **Ningún precio tachado, ninguna oferta, ningún "antes/ahora", ninguna cuenta regresiva.** Son recursos de comercio minorista y en servicios periciales restan credibilidad en lugar de sumar urgencia.
7. La tabla se construye desde **un solo archivo de datos** por sitio. Cambiar un precio es cambiar una línea.

---

## 6. Advertencia honesta sobre estas cifras

Lo que tiene respaldo externo verificable: las comisiones de corretaje, el porcentaje de administración, las tarifas de tasación bancaria, el recargo del 100% por peritaje judicial y el rango en pesos del tasador independiente.

Lo que es decisión mía de posicionamiento, sin tarifa de mercado disponible: los honorarios de derechos de agua, estudio de títulos, due diligence, matriz hídrica, herencias y asesoría de compra. Están construidos para escalar de forma coherente entre sí y con el volumen de trabajo real de cada uno, pero son un criterio, no un hecho.

El mínimo gremial de 6 UF lo tomé de una fuente que cita la Tabla del Colegio de Arquitectos recomendada por ASATCH; **no la verifiqué en el documento original**. Como es la cifra que sostiene toda la columna del sitio de tasaciones, conviene que Carlos la confirme con el gremio. Si el mínimo real es distinto, toda la columna se mueve con él, y por eso está en un solo archivo.

---

## Fuentes

- [Cuánto cobra una corredora de propiedades en Chile 2026 — CCM Properties](https://ccmproperties.cl/guias/honorarios-corredora-propiedades-chile)
- [Comisión de corretaje en Chile: la pagan ambas partes — Divergente Propiedades](https://divergentepropiedades.cl/quien-paga-la-comision-de-corredor-en-chile)
- [Cuánto cobra una corredora de propiedades en Chile — Fauna Propiedades](https://faunapropiedades.cl/2026/10/06/cuanto-cobra-una-corredora-de-propiedades-en-chile-guia-de-comisiones-y-servicios/)
- [Corredores de propiedades: cuánto cobran en Chile — Uhomie](https://blog.uhomie.cl/legal-y-gestion/cuanto-cobran-los-corredores-de-propiedades-en-chile/)
- [Qué es la tasación de una casa — Tinsa Chile](https://www.tinsa.cl/que-es-la-tasacion-de-una-casa/)
- [Cuánto cobra un perito tasador inmobiliario — Tinsa Chile](https://www.tinsa.cl/cuanto-cobra-un-perito-tasador-inmobiliario/)
- [Cuánto cobra un tasador de propiedades en Chile — Rankia](https://www.rankia.cl/blog/mejores-creditos-hipotecarios/5305484-cuanto-cobra-tasador-propiedades-chile)
- [Tas Global SpA, tasaciones inmobiliarias](https://www.2x3.cl/profesional/tas-global-spa-tasaciones-inmobiliarias)
- [Tasador de propiedades en Chile: funciones y honorarios — Bluehome](https://bluehome.cl/blog/tasador-propiedades)
- [Valor de tasación en UF — BancoEstado](https://www.bancoestado.cl/bancoestado/inteditorformularios/genera.asp?datos=156)
- [Honorarios del perito, jurisprudencia — vLex Chile](https://vlex.cl/tags/honorarios-del-perito-59155)
- [Tasación de derechos de agua — Agroin Chile](https://www.agroinchile.cl/servicios/tasacion-derechos-de-agua)
- [Derechos de agua en Chile: cómo obtenerlos y su valor — Ingeciv](https://ingeciv.com/derechos-de-agua-en-chile-como-obtenerlos-inscribirlos-valor/)
- [Tasación online de propiedades — Propiteq](https://www.propiteq.com/)
- [Tasación de propiedades: valor comercial — Valortotal](https://valortotal.cl/)
