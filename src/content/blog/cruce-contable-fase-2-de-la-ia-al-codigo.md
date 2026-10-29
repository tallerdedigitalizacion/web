---
title: "Cuadrar el trimestre con IA: primero que aprenda, luego que se pueda auditar"
description: "Segunda fase del cruce contable en una empresa de telecomunicaciones: la IA aprende el proceso con el pasado y después lo pasamos a código que se pueda auditar."
pubDate: 2027-01-26
relatedService: "/integracion-sistemas/"
---

Hace unas semanas te conté cómo probamos a cuadrar las cuentas de una empresa de telecomunicaciones con IA. Era la primera pasada: una tarde, tres meses de contabilidad y un lote de clientes. Hoy te cuento la segunda fase, que es donde la cosa empieza a parecerse a un producto de verdad.

Y te adelanto un dato, para que sepas de qué hablamos: con un método que todavía es flexible, sin código fijo, ya estamos en un 84 % de certeza en los cruces. Más abajo te explico qué significa y qué no.

## El problema, otra vez

La empresa tiene un montón de proveedores. Las facturas entran por distintas plataformas, hay varias cuentas de banco, y todo eso tiene que acabar en una sola contabilidad y en una sola presentación de cuentas a Hacienda.

Cuando intervienen tantos sistemas y la sincronización se hace a mano, los errores están servidos. No por descuido de nadie... es que punteando importe a importe entre cinco sitios distintos, alguien se equivoca tarde o temprano.

¿Y por qué no se arreglaba antes? Porque quitar esa niebla costaba demasiado. Hacerlo con personas era casi imposible, y hacerlo con código a medida era carísimo. Así que todo el mundo acababa en el mismo sitio: "así está suficientemente bien". Hoy ese cálculo ha cambiado.

## Fase 2: primero que aprenda, sin fijar nada

Me explico. Hemos montado un proyecto en Claude donde ordenamos el proceso formal: qué fuentes hay, en qué orden se cruzan, qué diferencias son normales y cuáles hay que mirar dos veces. Y lo dejamos trabajar de forma no determinista, es decir, que la IA razona cada caso y no sigue una receta fija.

Suena a desventaja, y lo es para el producto final. Pero para aprender es justo lo que necesitas: dejas que se equivoque, miras dónde, corriges el criterio y vuelves a pasar. Usamos el pasado de la empresa (facturas, bancos, asientos ya cerrados) para entrenar el criterio, porque ahí ya sabemos cuál era la respuesta correcta.

Es como abrir un camino por el campo: primero pisas la hierba por donde de verdad pasa la gente, y solo cuando ves por dónde va el camino, lo asfaltas. Si asfaltas antes, te quedas con una carretera que no lleva a ningún sitio.

## Fase 3: lo que se queda es código

La IA no es el producto final. Lo que queremos al terminar es una automatización determinista, o casi: que ante los mismos datos dé siempre el mismo resultado, y que puedas ver qué hizo y por qué.

¿Por qué importa tanto? Por tres cosas, en corto:

1. **Observabilidad:** poder ver qué está pasando mientras corre.
2. **Trazabilidad:** saber de dónde salió cada número.
3. **Auditabilidad:** que alguien externo pueda comprobar el cruce sin fiarse de mi palabra ni de la de una IA.

Con cuentas y con Hacienda de por medio, "la IA me dijo que cuadraba" no vale. Vale "estos son los pasos, estos los datos y este el resultado". Por eso usamos la IA para aprender el proceso y luego le pedimos que ayude a escribir el código que lo ejecuta de forma controlada.

## Qué significa ese 84 %

Es la certeza que tenemos hoy en los cruces con el modelo flexible, antes de fijar nada. Lo importante no es el número, sino la dirección: lo que sale mal se puede revisar y convertir en una regla, y cada regla sube la certeza de la siguiente pasada.

Y hay un detalle que me gusta: si salen descuadres, algunos pueden ser dinero que la empresa puede reclamar. Cifras no te voy a dar, porque no las tenemos cerradas. Pero cada descuadre que aparece es algo que antes no se veía.

## Lo que todavía no sabemos

Para que no te lleves una idea equivocada:

- **El 84 % no es el final.** Falta llegar a la certeza que se necesita para fiarse de un proceso automático, y todavía hay casos que revisa una persona.
- **No hemos pasado aún por un trimestre nuevo de principio a fin.** Ese es el examen de verdad: que la empresa tenga sus números cada trimestre sin volver al pasado.
- **Habrá que seguir afinando** con normativa nueva, proveedores nuevos y facturas con formatos raros.
- **No sustituye a quien lleva las cuentas.** Le quita el puntear y le deja el criterio.

En cuanto tengamos los resultados de las dos fases, te los cuento en otra entrada, con lo que haya salido bien y lo que no.

## ¿Y esto me sirve en mi negocio?

Si tus facturas entran por varios sitios, tienes más de una cuenta de banco y tu gestoría recibe todo al final, tienes el mismo problema a menor escala. Y la lección vale aunque no uses IA: primero aprende el proceso con el pasado, luego fíjalo para que sea comprobable.

Una pregunta para empezar: **¿cuántos sitios distintos tienes que mirar para saber si tus números cuadran?** Si son más de dos, hay margen.

Si quieres que lo miremos, [mira cómo trabajo la integración de sistemas](/integracion-sistemas/#contacto) o escríbeme **TRIMESTRE** por WhatsApp al 632 99 01 33. Te digo qué se puede automatizar, qué conviene seguir haciendo a mano y, si no te encaja, también te lo digo.
