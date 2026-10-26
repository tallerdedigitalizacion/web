---
title: "Cuadrar las cuentas cada mes y no una vez al año: lo que hemos probado con IA"
description: "Cruzar contabilidad, ERP y bancos era un trabajo de meses una vez al año. Te cuento cómo lo hemos probado con IA en una empresa real, qué funciona y qué no."
pubDate: 2026-12-29
relatedService: "/diagnostico-digitalizacion/"
---

Si cierras las cuentas de tu empresa una vez al año, ya sabes lo que pasa: llega el momento y hay que reconstruir doce meses de golpe. Es como limpiar la casa solo en Navidad... se puede, pero te cuesta un fin de semana entero en lugar de un rato cada día.

En una empresa de telecomunicaciones con la que trabajo en remoto pasaba exactamente eso. Cuadrar las cuentas eran meses de trabajo efectivo, una vez al año, y lo hacían dos personas del equipo. Esta vez lo hemos probado de otra manera. Te cuento qué hemos hecho, qué ha salido y qué todavía no está resuelto.

## El problema: los números viven en varios sitios

Los datos de una empresa no están en un único lugar. En este caso están en el sistema del contador, en la parte de esa contabilidad que la empresa puede consultar, en el ERP de gestión propio, en las dos cuentas del banco y en el ERP de una franquicia que también se gestiona desde la empresa. Todos tienen que decir lo mismo. Casi nunca lo dicen.

¿Cómo se encontraban las diferencias? Imprimiendo las fuentes y punteando con una regla: importe a importe, cliente a cliente, asiento a asiento. Un trabajo arduo y tedioso, y por eso se hacía una vez al año y con mucha dificultad.

## Lo que hemos hecho

Con la persona que lleva la administración montamos un proyecto de Claude pensado solo para este trabajo. Le fuimos enseñando cómo se hace el cruce, con el criterio de quien lleva años haciéndolo: qué diferencias son normales, cuáles hay que mirar dos veces y por qué.

Hay un detalle técnico que importa, y te lo digo en corto: trabajamos por lotes y con ficheros, no metiendo todo de golpe en una conversación. Si lo metes todo de golpe, la herramienta acaba resumiendo y pierde detalle por el camino, y en contabilidad el detalle es justo lo que buscas.

La primera pasada la sacamos en una tarde.

## Qué ha salido

En esa primera iteración cruzó tres meses de contabilidad contra el resto de fuentes, cruzó los movimientos de los bancos y cruzó un lote de 10 clientes con sus cuentas contables.

Según el criterio de quien lo revisa, la máquina encuentra lo que ya se había encontrado a mano y además encuentra cosas que se habían escapado. Dicho sin adornos: el resultado ya está, como mínimo, a la altura del trabajo manual de antes, y se ha hecho en una fracción del tiempo. Y lo hace sin cansarse a la hora de puntear, que es donde una persona más se equivoca.

## Lo que no está resuelto

Para que no te lleves una idea equivocada:

- **No funciona al 100 %.** Cada diferencia la revisa una persona con su criterio. La máquina propone, no decide.
- **Son tres meses y un lote de 10 clientes.** Falta probarlo con un año completo y con más volumen.
- **Hay que seguir refinando.** Mucho del criterio vive en la cabeza de quien lleva años con esto, y hay que ir pasándolo al sistema poco a poco.
- **No sustituye al contador** ni a quien lleva las cuentas. Les quita el puntear y les deja el criterio, que es lo que de verdad aporta.

## Qué cambia si se hace cada mes

Esto es todavía una hipótesis, no un dato: si el cruce se hace cada mes, cada cierre son unas horas en lugar de meses una vez al año. Lo iremos midiendo mes a mes y te lo contaré cuando lo tengamos.

Lo que sí se ve ya es lo siguiente. Con las cuentas al día, los errores salen cuando aún se pueden arreglar y las decisiones se toman con tiempo, no a final de año con prisa. Eso no es una promesa de ahorro; es la condición para poder buscarlo.

## ¿Esto me sirve en mi negocio?

A menor escala, probablemente sí. Si tu contabilidad está en un sitio, tus facturas en otro y el banco en otro, y cada cierto tiempo alguien tiene que comprobar a mano que todo coincide, tienes el mismo problema, solo que más pequeño.

Una pregunta para empezar, antes de pensar en ninguna herramienta: **¿qué cruzas hoy a mano en tu negocio, y cada cuánto?** Si la respuesta es "una vez al año y con dolor", hay margen.

Si quieres que lo miremos juntos, [pide una revisión gratuita de 20 minutos](/diagnostico-digitalizacion/#contacto) o escríbeme **CUENTAS** por WhatsApp al 632 99 01 33. Te digo qué cruzas, qué se puede automatizar y qué conviene seguir haciendo a mano. Si no te encaja, te lo digo igual.
