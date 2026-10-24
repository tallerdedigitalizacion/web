# Mapa de ofertas con nombres de comprador

> **Actualización:** los precios, plazos e inclusiones de este mapa ya están definidos (estimados, a corregir) en `src/data/offers.ts` y se muestran en la web. Las columnas FALTA de abajo son el estado anterior.

Objetivo: que cada servicio tenga una versión que se pueda **buscar y comprar como un objeto** (resultado + precio + plazo), y que "a medida" sea el nivel superior, no el titular.

Las frases de búsqueda son **hipótesis**, no datos. Se validan con el Planificador de palabras clave y una campaña de prueba en Google Ads (ver el final).

Leyenda de precio: **✔** ya está publicado · **FALTA** necesito que lo definas · **N/A** no se vende por búsqueda.
Todos los precios sin IVA, como en la web actual.

## A. Ya empaquetado (precio publicado)

| Nombre de comprador | Frases que puede escribir | Resultado | Precio | Plazo |
|---|---|---|---|---|
| Auditoría de facturas de proveedores | "revisar facturas de proveedores", "cobros duplicados proveedores", "conciliación de proveedores" | Sabes qué pagas sin tener ni deber | ✔ 490 € cerrado | FALTA |
| Dar de baja el software antiguo sin perder el histórico | "migrar datos de programa antiguo", "recuperar datos software obsoleto", "dejar de pagar licencia programa" | Cancelas la licencia y consultas el histórico con IA | ✔ desde 900 € | FALTA |
| Automatizar la entrada de facturas | "automatizar facturas proveedores", "OCR facturas", "contabilizar facturas automáticamente" | Las facturas entran solas, una persona valida | ✔ desde 2.500 € | FALTA |
| Consulta de cobertura por IA | "comprobar cobertura fibra por dirección" | Respuesta inmediata por dirección | ✔ desde 1.200 € | FALTA |
| Mantenimiento informático para empresas | "mantenimiento informático empresas", "informático para empresa" + ciudad | Equipos, copias y seguridad al día | ✔ desde 39 €/mes | n/a (recurrente) |
| Mantenimiento web / WordPress | "mantenimiento wordpress", "mantenimiento web empresa" | Web actualizada, con copias y cambios al mes | ✔ desde 39 €/mes | n/a (recurrente) |
| Plan de operaciones e IA | "mantenimiento de automatizaciones" | Automatizaciones vigiladas y mejoradas | ✔ desde 39 €/mes | n/a (recurrente) |

La consulta de cobertura es de nicho telecom: se vende por contacto directo, no por búsqueda.

## B. Por empaquetar (hoy es servicio, falta precio y nombre de comprador)

Prioridad **alta** = frases con intención de compra y probable demanda real. Esas son las que probaría primero en Google Ads.

| Prioridad | Servicio actual | Nombre de comprador | Frases que puede escribir | Resultado | Precio | Plazo |
|---|---|---|---|---|---|---|
| Alta | Ciberseguridad (copias) | Copias de seguridad automáticas y comprobadas | "copias de seguridad empresa", "backup para pyme", "backup servidor" | Si algo falla, recuperas todo, y está probado | FALTA | FALTA |
| Alta | Gestor de contraseñas | Gestor de contraseñas para tu equipo, instalado | "gestor de contraseñas empresas", "compartir contraseñas equipo" | Se acabó el Excel y el WhatsApp | FALTA | FALTA |
| Alta | Ciberseguridad y NIS2 | Revisión de seguridad con informe NIS2 / RGPD | "adaptación NIS2 pyme", "cumplir RGPD empresa", "auditoría ciberseguridad pyme" | Informe de qué te falta y plan para cerrarlo | FALTA | FALTA |
| Alta | Optimización de velocidad web | Web más rápida, medida antes y después | "mi web va lenta", "optimizar velocidad web", "mejorar core web vitals" | Web que carga rápido, con las cifras | FALTA | FALTA |
| Alta | Captación y seguimiento de leads | CRM para tu pyme, listo para usar | "crm para pymes", "centralizar contactos clientes", "conectar formulario con crm" | Todos los contactos en un sitio, ninguno sin respuesta | FALTA | FALTA |
| Alta | Agente de IA de atención | Chatbot con IA para tu web y WhatsApp | "chatbot ia empresa", "atención al cliente automática" | Responde dudas frecuentes y pasa a una persona | FALTA | FALTA |
| Media | Google Workspace | Google Workspace configurado, con correo de tu dominio | "correo con dominio propio empresa", "migrar a google workspace" | Correo y Drive funcionando, con permisos | FALTA | FALTA |
| Media | Reestructuración de Google Drive | Tu Google Drive ordenado | "ordenar google drive empresa", "permisos google drive" | Cualquier documento en segundos | FALTA | FALTA |
| Media | Diseño web | Web para captar clientes, precio cerrado | "diseño web pyme", "página web para empresa precio" | Web publicada que recoge contactos | FALTA | FALTA |
| Media | Funnel web | Página de venta con captación automática | "landing page para vender", "embudo de ventas web" | Página + seguimiento automático | FALTA | FALTA |
| Media | Asistente de IA con conocimiento de la empresa | ChatGPT con los documentos de tu empresa | "chatgpt con mis documentos", "ia para documentación interna" | El equipo consulta sin preguntar al dueño | FALTA | FALTA |
| Media | Integración de sistemas | Conectar tu CRM, facturación y correo | "conectar crm con facturación", "integrar erp" | Cero copiar y pegar entre programas | FALTA | FALTA |
| Baja | ERP y software de gestión | Revisión de tu ERP (o elegir uno) | "mi erp no funciona", "elegir erp pyme" | Sabes qué cambiar y qué ERP te conviene | FALTA | FALTA |
| Baja | Herramientas internas a medida | Aplicación a medida para tu equipo | "aplicación a medida empresa", "panel de control empresa" | Herramienta propia hecha a tu forma de trabajar | FALTA (por proyecto) | FALTA |
| N/A | Diagnóstico de digitalización / caos operativo / telecom | Revisión de cómo trabaja tu empresa, con informe y plan | casi nadie lo busca así | Informe priorizado y siguiente paso | FALTA | FALTA |

El diagnóstico no se vende por búsqueda. Es el **producto de entrada** al que llevan los demás (comprobadores gratuitos, outreach al nicho telecom, mensajes directos).

## C. Estructura de precio propuesta (para decidir contigo)

Para los candidatos repetibles de B (copias, contraseñas, CRM, chatbot, web) dos niveles:

- **Base** (precio cerrado): lo que se instala casi igual en todos los clientes. Se compra como un objeto.
- **A medida** (desde X €): adaptado a cómo funciona su negocio de punta a punta. Es la diferenciación.

Así el comprador entra por el objeto y descubre la personalización dentro.

## D. Lo que necesito de ti

1. **Precio** (o "desde") para cada fila marcada FALTA, empezando por las seis de prioridad alta. Si no quieres cerrar precio, dime al menos el rango.
2. **Plazo realista de entrega** para esas filas y para los cuatro casos prácticos ya publicados.
3. **Qué incluye** cada paquete Base y qué queda fuera.
4. **Qué entregas casi igual cada vez** (candidatos a nivel Base) y qué es siempre distinto.
5. **Zona**: ¿solo Toledo y 50 km, o toda España en remoto? Cambia las frases ("... Toledo" o sin ciudad).
6. **Presupuesto de prueba** de Google Ads (propongo 150–200 € en dos semanas) y si ya tienes cuenta de Google Ads y Search Console.

## E. Prueba de demanda (cuando haya precios)

Campaña de búsqueda con las frases de prioridad alta (unas 15–20), 10–15 €/día durante dos semanas. Se miran el informe de términos de búsqueda, los clics y las conversiones. Se conservan los paquetes que consiguen contactos y se descartan los demás antes de construirlos.
