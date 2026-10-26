---
title: "Ordenador lento al arrancar: el culpable era un pendrive USB, no el disco"
description: "Tres ordenadores de oficina tardaban minutos en arrancar. Cambié RAM y disco, y el problema real era un pendrive USB. Qué probar antes de gastar dinero."
pubDate: 2026-12-01
relatedService: "/mantenimiento-informatico-toledo/"
---

Si el ordenador de tu negocio tarda minutos en arrancar, lo normal es pensar que ya está viejo y que toca cambiarlo. A veces es verdad... pero antes de gastar nada, te cuento lo que me pasó en el Billar El Arrabal de Fuensalida, porque el culpable no era el que yo pensaba.

## El problema: ordenadores que tardaban minutos en arrancar

Pedro, que lleva el billar, tiene tres ordenadores en la oficina, iguales o muy parecidos. Los usa para grabar las partidas en vídeo. Los tres iban lentos: los encendías y te podías ir a por un café, porque a veces tardaban minutos en estar listos.

Lo primero fue lo evidente: **ampliar la memoria RAM**, que además hacía falta para grabar vídeo. Funcionó a medias. Ya se podía grabar y arrancaba un poco más rápido... pero seguía tardando muchísimo.

## Descartar sospechosos (y equivocarme a medias)

Me puse a pensar por eliminación, que es como me gusta atacar estos problemas:

- **La pila de la placa** (la que guarda la hora y la configuración): Pedro la había cambiado hacía poco. Descartada.
- **La fuente de alimentación**: improbable. Si los tres ordenadores sufren lo mismo, no cuadra que las tres fuentes se hayan cansado a la vez y de la misma manera.
- **El disco duro**: el común denominador. Tenía que ser él.

Probamos combinaciones durante un rato y nada cambiaba, así que compré un **SSD de 128 GB** (un disco sin piezas móviles, mucho más rápido que uno mecánico) en Amazon por 36 €. Pedro me dio 40, o sea que el material casi ni se cobró.

Me llevé el ordenador a casa y **cloné el disco antiguo al SSD con Clonezilla**, un programa gratuito que copia un disco entero, sistema incluido, sin tener que reinstalar nada. Lo arranqué con el clon... y el ordenador iba mucho más ágil. Pero el arranque seguía tardando.

Ahí tocaba dejar de adivinar.

## Lo que lo delató: los puertos USB

Mientras trasteaba vi algo raro: en ese ordenador, el teclado y el ratón solo respondían rápido si iban en unos conectores USB concretos de la parte de atrás. En otros, tardaba una eternidad en reconocer el ratón.

Y además tenía enchufados dos "pinchos" más: un receptor Bluetooth para un teclado numérico inalámbrico y otro pincho para tener internet por wifi. Los cambié de puerto, atrás y delante... y seguía tardando.

¿Qué probé entonces? Lo más tonto y lo más útil: **desenchufarlo todo**. Sin nada, el ordenador arrancaba en **25 segundos**.

Fui enchufando de uno en uno. El culpable: el pincho del wifi, que además de dar internet se identificaba como una unidad de almacenamiento, como si fuera un pendrive.

## Por qué un pendrive hace eso

Me explico. Cuando enciendes un ordenador, antes de cargar Windows, la BIOS (el programa mínimo de la placa, el que decide por dónde empezar) va mirando **en qué dispositivos hay un sistema para arrancar**. Si tiene el USB en su lista, se pone a consultar cada cosa que le hayas enchufado... y con un dispositivo que se identifica de forma rara, se queda esperando.

Es como si, para abrir el local cada mañana, primero tuvieras que probar la llave en todas las puertas del polígono. Al final abres la tuya, pero has perdido un buen rato.

## La solución: cero euros y cinco minutos en la BIOS

Entré en la BIOS y dejé **solo el disco duro como dispositivo de arranque**. Los USB los puse en "No boot", que significa "no busques aquí nada para arrancar". Los teclados, ratones y pinchos siguen funcionando igual, simplemente la BIOS ya no los examina al encender.

Arranqué con todo conectado: **25 segundos**. Reinicié para comprobarlo y seguía perfecto.

Te lo digo claro, para ser justo: no probé la BIOS antes de comprar el SSD, así que no puedo asegurarte que el disco sobrara. Probablemente el SSD ayudó, porque el disco original era uno mecánico. Pero sí sé que **sin tocar la BIOS el arranque no bajaba de ahí**, y que eso lo podía haber descubierto el primer día sin gastar un euro.

Cuando Pedro llegó a casa y vio la diferencia, me llamó para que haga lo mismo con los otros dos ordenadores.

## Qué probar antes de tirar un ordenador "lento"

Si te pasa algo parecido, este es el orden que seguiría ahora:

1. **Apaga, desenchufa todo lo USB** (pendrives, receptores, dongles, discos externos) y cronometra cuánto tarda en arrancar.
2. Si tarda mucho menos, **enchufa los dispositivos de uno en uno**, reiniciando cada vez. El que haga que vuelva a ir lento es el sospechoso.
3. Entra en la BIOS y mira el **orden de arranque**: lo normal es dejar solo el disco del sistema. Apunta lo que cambias.
4. Solo si nada de eso funciona, piensa en la RAM o en cambiar el disco por un SSD.

Una precaución: si alguna vez necesitas arrancar desde un pendrive para reinstalar el sistema, tendrás que volver a activarlo en la BIOS. Por eso conviene anotar lo que tocas.

## Lo que queda pendiente en el billar

El disco antiguo de 320 GB lo guardé como copia de seguridad. Cuando hagamos los otros dos ordenadores, la idea es quitar el lector de CD y poner ese disco como unidad secundaria para guardar más vídeos de las partidas.

Y queda la cámara: las webcams con las que graban son bastante malas. Le voy a sugerir que conecte su teléfono por USB y use su cámara, que graba mucho mejor y no cuesta nada.

Porque lo que Pedro quiere no es un ordenador rápido... es que la grabación y la experiencia de la gente que juega sea buena. El ordenador es un medio, igual que internet o la cámara.

## ¿Tu ordenador o los de tu oficina tardan una eternidad?

Antes de comprar equipos nuevos, merece la pena una revisión. Si estás por Fuensalida, Torrijos, La Sagra o el sur de Madrid, puedo mirarlo en persona; y si no, por videollamada o con [soporte remoto](/soporte-remoto/).

Escríbeme **ARRANQUE** por WhatsApp al 632 99 01 33 y te cuento en 20 minutos qué puede estar frenando tus equipos. También puedes ver cómo trabajo el [mantenimiento informático para empresas](/mantenimiento-informatico-toledo/) o dejarme tus datos en el [formulario](#contacto).
