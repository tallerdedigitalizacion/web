# Verificación de la medición (UTM, gclid y conversiones)

Procedimiento para repetir en **cada landing nueva** y cada vez que cambie la medición. Cubre lo que exige la sección
«Requisitos obligatorios de toda landing de campaña» de `CLAUDE.md`. Todo se prueba sin crear leads reales ni tocar AWS.

URL de prueba (sustituye la ruta por la de la landing):

```
/?gclid=TEST123&utm_source=google&utm_medium=cpc&utm_campaign=C99-prueba&utm_content=A&utm_term=prueba
```

## Dónde está cada cosa

| Qué | Archivo |
|---|---|
| Consentimiento, lectura y arrastre de parámetros, código de WhatsApp, eventos | `src/components/CookieBanner.astro` |
| Envío de leads (campo `attribution` del JSON de cada formulario) | cada formulario llama a `window.tdAttribution()` |
| Esquema y email de aviso | `backend/src/schemas.ts`, `backend/src/email/templates.ts` |
| Página de gracias de Cal.com (`reserva_completada`) | `src/pages/reserva-confirmada.astro`, `src/pages/booking-confirmed.astro` |
| Ayudas de verificación | `scripts/verificar-medicion-navegador.js`, `scripts/verificar-medicion.ts` |

**Sobre los «campos ocultos».** Los formularios se envían por `fetch` con JSON, no como formulario HTML. Los campos de
atribución (`source`, `medium`, `campaign`, `content`, `term`, `clickId`, `clickIdType`, `landing`) más `pageUrl` viajan en
el JSON como `attribution` y `pageUrl`. Es el equivalente de los campos ocultos y se comprueba en la pestaña Red.

## Reglas de atribución que se verifican

1. **Enlaces internos**: arrastran `gclid/gbraid/wbraid` y `utm_*` de la **URL actual**. No guardan nada en el navegador y no
   dependen del consentimiento.
2. **Orden de lectura** (formularios, WhatsApp, Cal.com): parámetros de la URL actual; si no hay, el valor guardado (solo con
   consentimiento analítico, en `sessionStorage`); si no hay, el dominio que enlaza. La URL manda **entera**: nunca se mezclan
   campos de dos clics distintos.
3. **Una visita sin parámetros no borra ni sustituye** una atribución guardada. Solo la sustituye una URL nueva con parámetros
   (último clic).
4. **El envío de un lead no depende del consentimiento.** La atribución de la URL actual viaja siempre.
5. **WhatsApp**: `(ref: <utm_source>/<utm_campaign>[/<utm_content>])`. Sin `utm_source` no se añade nada.
6. **`generate_lead`**: exactamente uno por acción de lead (el código descarta un segundo igual en menos de 3 s).

## Preparación

```bash
npm run dev          # http://localhost:4321
```

En el navegador: DevTools abierto en las pestañas Consola y Red. Para empezar de cero, en la consola:

```js
localStorage.clear(); sessionStorage.clear(); document.cookie.split(";").forEach(c => document.cookie = c.split("=")[0].trim() + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/");
```

Carga las ayudas pegando en la consola el contenido de `scripts/verificar-medicion-navegador.js` (con el servidor de
desarrollo también sirve `fetch("/@fs/<ruta del repo>/scripts/verificar-medicion-navegador.js").then(r => r.text()).then(eval)`).
Hay que volver a cargarlas tras cada navegación completa. Dan `tdVerify.report()`, `tdVerify.interceptLeads()` y
`tdVerify.events()`.

> **Consent Mode v2.** `gtag` se carga siempre, con todo denegado por defecto. GA4 envía de verdad los eventos (también desde
> `localhost`): sin consentimiento llegan como pings sin cookies (`gcs=G100`) y con consentimiento concedido con cookies
> (`gcs=G111`). Para ver solo la parte local usa DebugView y filtra por `localhost`.

## Pasos

### A. Sin decidir las cookies (el caso más frecuente en móvil)

1. Abre la URL de prueba **sin tocar el banner** y ejecuta `tdVerify.report()`.
2. Espera: `consentimiento: "sin decidir"`, `cookies: []` (**ninguna cookie de Google**: ni `_ga`, ni `_ga_*`, ni `_gcl_*`),
   `gtag: "function"`, y en `pingsGA4` un `page_view` con `gcs: "G100"`. En `dataLayer` el primer elemento es
   `consent default` con los cuatro valores en `denied`, antes de `js` y `config`.
3. `tdAttribution` con los 7 valores y `clickIdType: "gclid"`. WhatsApp con `(ref: google/C99-prueba/A)`. El enlace a Cal.com
   con `utm_*` y `gclid`. `enlacesInternos.conParametros == total`.
4. Pulsa un enlace interno (clic real). La nueva URL lleva los parámetros y `tdAttribution` los conserva. Nota: **sin
   consentimiento, `landing` pasa a ser la página actual**, no la de entrada (no se guarda nada).

### B. Aceptar

1. En la URL de prueba, pulsa «Aceptar todas».
2. Espera: cookies `_ga`, `_ga_*`, `_gcl_aw` (el gclid) y `chatbase_anon_id`; `td_attribution` en `sessionStorage` con los
   parámetros y `landing`; `gtag: "function"`. En `dataLayer`, un `consent update` con los cuatro valores en `granted`
   **antes** del evento `aceptacion_cookies`, y los pings siguientes con `gcs: "G111"`. Si solo marcas «Analíticas» en
   «Configurar»: `analytics_storage` granted y `ad_*` denied (`gcs=G101`), y sin `_gcl_aw`.
3. Eventos (`tdVerify.events()` o DebugView): `aceptacion_cookies`. Haz clic en WhatsApp, teléfono, email y reservar: cada uno
   genera `whatsapp_click`, `telefono_click`, `email_click`, `reservar_click` con `link_url, link_text, link_id, page_path,
   page_location`.
4. Navega a una URL **sin parámetros** de la misma pestaña: `tdAttribution()` sigue devolviendo la atribución guardada y su
   `landing` original.
5. Navega a una URL con parámetros distintos: la atribución se sustituye entera (sin restos del clic anterior).
6. Desplázate hasta el final: aparece el evento automático `scroll` con `percent_scrolled = 90` (medición mejorada de GA4).

### C. Rechazar

1. En la URL de prueba, pulsa «Rechazar».
2. Espera: ninguna cookie de Google, `sessionStorage` vacío, `gtag: "function"`, `consent update` con todo `denied` y los
   eventos (`rechazo_cookies`, `generate_lead`, clics) como pings con `gcs: "G100"`. Ninguna petición a Chatbase ni Meta.
   Si venías de un consentimiento aceptado, la página se recarga y borra `_ga*` y `_gcl_*`.
   (`chatbase_anon_id` es de Chatbase y no se borra al retirar el consentimiento; es un comportamiento anterior a Consent Mode.)
3. Aun así: `tdAttribution` completo, WhatsApp con `(ref: …)`, enlaces internos y Cal.com con parámetros, y los leads salen con
   su atribución.

### D. Formulario, base de datos y email (sin crear un lead real)

1. En la consola: `tdVerify.interceptLeads()`. A partir de ahí los envíos a `/lead/*` **no salen**: el cuerpo queda en
   `tdVerify.leads`.
2. Rellena y envía el formulario de contacto. Comprueba `tdVerify.leads[0].body.attribution` (los 7 campos + `landing`) y
   `pageUrl`.
3. Guarda ese cuerpo en un archivo y ejecuta la parte de servidor:

   ```bash
   node --import tsx scripts/verificar-medicion.ts payload.json
   ```

   Sin argumento usa una carga de ejemplo con la URL de prueba. Imprime la fila que se guardaría en DynamoDB, el texto del
   email de aviso y una lista OK/FALLA. (`npx tsx` también sirve fuera del sandbox de Claude Code.)
4. Evento esperado: `formulario_contacto` y **un solo** `generate_lead` con `lead_type: "contact"`.

### E. Reserva en Cal.com

1. Comprueba que el enlace a Cal.com lleva `utm_*` y `gclid` (paso A.3).
2. Abre `/reserva-confirmada/?email=a@b.com&name=Prueba&uid=1` con el consentimiento aceptado. Espera: la URL queda sin query,
   un evento `reserva_completada` con `page_path` y `page_location` sin datos personales, y **ningún** `email` en el
   parámetro `dl` de las peticiones `g/collect`. Recargar la página no repite el evento.

### F. Alta del lead en Notion (CRM · Prospectos)

El backend crea una fila en Notion además de enviar el email. Hay dos comprobaciones:

1. **Sin Notion real**, con simulaciones (DynamoDB, SES y Notion): `node --import tsx scripts/verificar-notion.ts`. Comprueba el
   mapeo contra el esquema de la base, que el email sale aunque Notion falle, los reintentos y que un reenvío no duplica la
   fila.
2. **De punta a punta, con Notion real** (tras desplegar con `NOTION_TOKEN`): abre la URL de prueba, envía el formulario de
   contacto y comprueba en Notion una fila con Nombre «[PRUEBA] …», Email, Canal de entrada = Formulario web, Origen = Google
   Ads, Atribución = Confirmada, Campaña = C99-prueba, Anuncio / variante = A, Palabra clave = prueba, GCLID = TEST123,
   Landing de entrada y Código de atribución = `(ref: google/C99-prueba/A)`. Reenvía el mismo formulario antes de 60 s: no
   aparece una segunda fila. Envía otro sin parámetros: Atribución = No atribuido. Las filas «[PRUEBA]» se filtran y se borran
   a mano.

Si Notion falla, en CloudWatch aparece una línea `NOTION_SYNC_FAILED {…}` con las propiedades completas para crear la fila a
mano; si falta el token, `NOTION_SYNC_SKIPPED`.

#### Reservas de Cal.com → Notion (webhook)

Las reservas hechas en Cal.com (incrustadas en las landings o por el enlace directo) no pasan por el formulario, así que Cal.com
avisa al backend con un webhook: `POST <API>/webhook/cal` (`backend/src/calWebhook.ts`). Solo atiende `BOOKING_CREATED`; el resto
de eventos (cancelación, cambio de hora, `PING`) se ignoran con 200.

- **Alta**: una fila con Nombre y Email del asistente (no los del organizador), Teléfono si lo hay, Canal de entrada = «Reserva de
  llamada», Origen = «Cal.com» (o «Google Ads» si llega atribución), Estado = Nuevo y Necesidad declarada = «Reserva de llamada:
  <fecha y hora en Madrid> · <evento>».
- **Seguridad**: la firma HMAC-SHA256 del cuerpo en bruto (cabecera `X-Cal-Signature-256`) se comprueba con `CAL_WEBHOOK_SECRET`; sin
  firma válida, 401 y no se escribe nada. Sin secreto configurado, todo se rechaza.
- **Duplicados**: cada reserva se identifica por su `uid` (7 días); un reintento de Cal.com no crea otra fila. Si Notion falla se
  responde 200 igualmente (para que Cal.com no reintente) y queda `NOTION_SYNC_FAILED` en CloudWatch.
- **Reserva y formulario**: si la misma persona rellena el formulario y reserva, salen dos filas (Canal de entrada distinto). No se
  fusionan.
- **Atribución**: el embed de las landings (`CampaignBooking.astro`) pasa a Cal.com la atribución de la visita como `metadata[...]`
  (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `gclid`/`gbraid`/`wbraid`, `landing` y `ref` = `google/<campaña>/<anuncio>`),
  leída de `window.tdAttribution()` (URL y, con consentimiento analítico, sessionStorage). Cal.com la devuelve en `payload.metadata` del
  webhook y el backend rellena Campaña, Anuncio / variante, Palabra clave, GCLID, Landing y Código de atribución. Con campaña o clic de
  Google: Origen = «Google Ads» y Atribución = «Confirmada»; sin ellos: «Cal.com» y «No atribuido». Si el nombre o el email empiezan por
  «PRUEBA» (o la campaña acaba en «-prueba»), el nombre lleva «[PRUEBA] ». La reserva por el enlace directo de Cal.com (sin la landing)
  no lleva atribución. **Pendiente de comprobar con una reserva real**: que Cal.com conserve `metadata[...]` en el payload.
- **Evento `reserva_completada`** (embed): `lead_type=booking`, `language`, `page_path`, `page_location` y, solo con consentimiento
  (analítico o marketing), `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` y `gclid`. Una sola vez por reserva; no se
  lanza `generate_lead`.
- **Prueba sin Cal.com real**: `node --import tsx scripts/verificar-cal-webhook.ts` (firma, un solo evento, mapeo, duplicados,
  atribución y fallo de Notion). **De punta a punta**: haz una reserva de prueba y comprueba la fila; en Cal.com, Webhooks →
  el webhook → «Ping test» debe dar 200.

## Eventos: cuáles son de conversión

| Evento | Qué es | ¿Evento clave? |
|---|---|---|
| `generate_lead` (con `lead_type`) | Lead capturado: **canónico**, uno por acción | **Sí** |
| `reserva_completada` | Cita confirmada en Cal.com | **Sí** |
| `whatsapp_click` | Intención de contacto por WhatsApp | Sí (conversión secundaria) |
| `telefono_click` | Intención de llamada | Sí (conversión secundaria) |
| `reservar_click` | Intención de reservar | No como principal: cuenta a la vez que `reserva_completada` |
| `email_click` | Intención de escribir | Opcional |
| `linkedin_click`, `cv_click` | Clic en LinkedIn o en el CV (PDF) de «Quién está detrás» de las landings de campaña; `link_id` `authority-linkedin` y `authority-cv` | **No** (medir quién investiga a Pablo) |
| `formulario_contacto` | Diagnóstico del formulario de contacto | **No** (duplica `generate_lead`) |
| `descarga_metodo` | Diagnóstico de la descarga del método | **No** (duplica `generate_lead`) |
| `download_web_audit_pdf` | Diagnóstico de la guía de auditoría web | **No** (duplica `generate_lead`) |
| `finalizacion_autoevaluacion`, `submit_web_audit_self_assessment`, `web_audit_api_success`, `self_assessment_complete`, `inicio_autoevaluacion`, `self_assessment_start`, `start_web_audit_self_assessment` | Pasos del test o autoevaluación | **No** |
| `aceptacion_cookies`, `calculadora_leads_click`, `plantilla_drive_click`, `portfolio_app_click`, `descarga_anydesk`, `hub_*`, `resena_click`, `click_pagespeed_*` | Interacción | **No** |
| Automáticos de GA4: `click`, `form_start`, `form_submit`, `file_download`, `scroll`, `page_view` | Medición mejorada | **No** |

Por acción de lead, hoy salen: contacto → `formulario_contacto` + `generate_lead`; método → `descarga_metodo` +
`generate_lead`; guía web → `download_web_audit_pdf` + `generate_lead`; auditoría web →
`submit_web_audit_self_assessment` + `generate_lead` + `web_audit_api_success`; resto → `generate_lead`. Siempre exactamente
un `generate_lead`.

## Configuración externa (no está en el código)

**Cal.com** (cuenta del dueño; no se puede comprobar desde el repo):

1. UTM: `utm_source`, `utm_medium`, `utm_campaign`, `utm_term` y `utm_content` que lleva el enlace los guarda Cal.com solos en
   la reserva y los ve quien la recibe en el detalle de la cita.
2. `gclid`/`gbraid`/`wbraid`: crear en el tipo de evento una pregunta de reserva **oculta**, tipo texto corto, no obligatoria,
   con identificador `gclid` (otra para `gbraid` y otra para `wbraid`). La web ya añade el parámetro al enlace.
3. Reserva completada: en cada tipo de evento, Avanzado → «Redirect on booking» a
   `https://tallerdedigitalizacion.com/reserva-confirmada/` (español) y `https://tallerdedigitalizacion.com/booking-confirmed/`
   (inglés), con **«Forward parameters» desactivado**. Activado, Cal.com añade el email del asistente a la URL. La página
   quita la query antes de que cargue GA4, pero el dato no debería viajar. Comprueba antes que tu plan de Cal.com ofrece esta
   opción.
4. Alternativa si no hay redirección: incrustar Cal.com en una página propia con su evento `bookingSuccessful`; implica cargar
   el script de Cal.com y pedir consentimiento para él.

**GA4**: marcar los eventos clave de la tabla; excluir el tráfico interno; la medición mejorada de scroll ya está activa.

## Brechas conocidas

- Consent Mode v2 implementado (ver arriba). Sigue sin existir la etiqueta de Google Ads (`AW-`) ni Conversion Linker: las
  conversiones se importan desde GA4.
- Sin consentimiento, `landing` es la página donde se envía el formulario, no la de entrada.
- GitHub Pages no puede responder con un 301 HTTP. Las redirecciones de `src/config/legacyRedirects.mjs` (`/funnel-web`,
  `/herramientas-internas-medida`, etc.) son una página con un script que conserva query y hash, `canonical` a la página nueva y
  `meta refresh` solo sin JavaScript. Conservan UTM y gclid en el navegador, pero no son un 301 para los buscadores: no usarlas
  como URL final de un anuncio. Un 301 real exige un proxy delante (p. ej. Cloudflare) o cambiar de alojamiento.
- La autoevaluación web (`PUBLIC_WEB_AUDIT_API_URL`, Lambda propia) guarda la atribución pero **no envía email de aviso**.
- La atribución persistida (solo con consentimiento) vive en `sessionStorage`: no sobrevive a cerrar la pestaña ni se comparte
  entre pestañas.

## Landings de campaña (Comunidad de Madrid)

Dos campañas, cada una con anuncios en español y en inglés. Cada anuncio apunta a la URL de su idioma; no hay redirección
automática por idioma del navegador. Sufijo de URL final: `utm_source=google&utm_medium=cpc&utm_campaign=<id>&utm_content={creative}&utm_term={keyword}`.

| Campaña | `utm_campaign` | Español | Inglés |
|---|---|---|---|
| Producto (desarrollo de software a medida) | `C04-software` | `/desarrollo-software-a-medida/` | `/custom-software-development/` |
| Método (automatización de procesos con IA) | `C05-automatizacion` | `/automatizacion-procesos-ia/` | `/ai-process-automation/` |

- Contenido de las cuatro: `src/data/campaigns.ts` (textos comunes en `shared`, lo propio de cada página en `campaignPages`). Cuerpo:
  `src/components/CampaignPage.astro`. Plantilla (cabecera, pie, meta, schema): `src/layouts/CampaignLayout.astro`, sobre `BaseLayout`
  en modo `minimal`. Todo lo pendiente de Pablo está en `pabloMarkers` y como `[PABLO: …]`; solo se ve con `npm run dev`.
- Estructura: hero con «¿Cómo sé si esto es para mí?» (lead magnet sin email, no envía datos ni eventos) · dolores · qué hago (solo
  producto) · cómo trabajo con la escalera de precios y la garantía · quién está detrás (con el vídeo de Pablo) · casos con «antes /
  ahora» en carrusel · testimonios en vídeo (solo se muestran cuando hay vídeo) · preguntas · reserva en la página · formulario.
- Precios (fijos, sin fechas): diagnóstico 90 €, primera implementación 490 € (400 € tras el diagnóstico), plan de 6 semanas 2.490 €
  en total (2.000 € tras las dos primeras), implementación suelta 990 €. Siempre se empieza por el diagnóstico.
- La plantilla no tiene menú ni pie completo ni WhatsApp (ni botón ni enlace); el pie mínimo lleva Aviso legal (con los datos del titular y el
  email de contacto), Política de privacidad, Política de cookies y «Configurar cookies». Sin email ni teléfono a la vista, para que
  todo contacto entre por la reserva o por el formulario y se mida. Sin AnyDesk, sin «Otros servicios», sin chat.
- **Reserva dentro de la página** (`CampaignBooking.astro`): código oficial «inline embed» de Cal.com. El script de Cal.com no se carga al abrir
  la página: se carga solo si la persona ha aceptado las cookies (analíticas o marketing) o si pulsa «Ver huecos disponibles». Recibe
  los parámetros de la URL (`forwardQueryParams`). Cuando Cal.com avisa `bookingSuccessful`, la página lanza `reserva_completada` y muestra la
  confirmación; no usa la página de «reserva confirmada». Los eventos son los de 30 minutos: `llamada-gratuita-de-minutos30` en español y `free-30-min-call` en inglés (`cal` en `campaigns.ts`). Comprobado en local que el calendario carga;
  **falta probar una reserva real**.
- Eventos de cada página, además de los de CookieBanner: `reservar_click` en el botón «Ver huecos disponibles» (`link_id` `booking-embed-open`) y
  en el enlace de respaldo (`booking-fallback`); el botón del hero y el de la cabecera bajan a `#reserva` (ancla, sin evento);
  `telefono_click`, `email_click`, `reserva_completada` y `generate_lead` (`lead_type: contact`, desde el formulario).
- Selector de idioma: conserva la query completa. Aviso «This page is also available in English» (o su inverso): solo si el
  navegador está en el otro idioma, descartable, sin redirigir.
- Vídeo de Pablo (`CampaignVideo.astro`): póster y, al pulsar, reproductor de `youtube-nocookie.com`; sin nada de terceros antes del clic.
  **Propuesta pendiente de aprobación:** `video_start` y `video_complete` con `page_path` y `language`; no implementados porque añaden
  eventos nuevos a la especificación.
- Para verificar el formulario sin crear un lead real, usa la ayuda del paso D (intercepta el `fetch` antes de enviar).

## Informe de verificación (plantilla)

```
Landing: /lp/<id>-<nombre>/        Fecha:
A. Sin decidir cookies   OK / FALLA
B. Aceptar               OK / FALLA
C. Rechazar              OK / FALLA
D. Formulario/BD/email   OK / FALLA   (salida de verificar-medicion.ts)
E. Cal.com + gracias     OK / FALLA
F. Alta en Notion        OK / FALLA
Notas:
```
