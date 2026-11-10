# Taller de Digitalización: instrucciones para Claude

## Requisitos obligatorios de toda landing de campaña (medición y trazabilidad)

Las landings reciben tráfico de pago de Google Ads: cada euro se paga y el dato de origen no puede perderse. Antes de dar por terminada una landing, cumple todo esto y verifícalo. Si una petición mía contradice un requisito, avísame antes de implementarla.

Estructura
- Una landing por campaña, con ruta propia y estable (p. ej. /lp/<id>-<nombre>). El CTA principal (WhatsApp, formulario o lead magnet) está en la propia página de aterrizaje, no en otra.
- Mensaje coherente con el anuncio que la enlaza, móvil primero, carga rápida, sin ventanas emergentes intrusivas, aviso de cookies y política de privacidad enlazada.
- Ninguna redirección debe perder parámetros (http→https, www→apex, barra final).

Convención de parámetros
- utm_source=google, utm_medium=cpc, utm_campaign=<id>-<nombre> (p. ej. C02-maps-toledo), utm_content=<anuncio>, utm_term=<palabra clave>, más el identificador de clic de Google (gclid, gbraid o wbraid).

Captura y persistencia
- Lee esos parámetros en la primera carga y arrástralos en todos los enlaces internos (sin almacenar). Guárdalos en cookie o localStorage solo con consentimiento analítico.
- Los formularios llevan campos ocultos: source, medium, campaign, content, term, clickId, landing (ruta, sin parámetros) y pageUrl. Una visita posterior sin parámetros nunca sobrescribe una atribución anterior.
- El envío de un lead no depende del consentimiento de cookies.

Consentimiento
- Consent Mode v2 con estado por defecto denied (ad_storage, analytics_storage, ad_user_data, ad_personalization), declarado antes de cargar ninguna etiqueta de Google.

Eventos (nombres y parámetros fijos)
- whatsapp_click, telefono_click, email_click, reservar_click: link_url, link_text, link_id, page_path, page_location.
- linkedin_click, cv_click (enlaces de «Quién está detrás» de las landings de campaña): mismos parámetros. No son conversiones.
- generate_lead con lead_type: exactamente uno por acción de lead, sin duplicados.
- reserva_completada tras una cita completada.
- Sin datos personales (nombre, email, teléfono) en parámetros de eventos ni en URLs.

WhatsApp y avisos
- El enlace lleva texto prellenado con (ref: <utm_source>/<utm_campaign>[/<utm_content>]).
- El email de aviso de cada lead muestra todos los parámetros de atribución, incluidos term y clickId.

Verificación obligatoria antes de dar por cerrada una landing
- Prueba con ?gclid=TEST123&utm_source=google&utm_medium=cpc&utm_campaign=C99-prueba&utm_content=A&utm_term=prueba, aceptando y rechazando cookies: eventos y parámetros en GA4, enlace de WhatsApp, campos del formulario, email y base de datos.
- Informa OK / FALLA por punto y actualiza la especificación de medición. Cuando cambie la medición, entrégame un bloque "Para el marketing manager".

## Notas de implementación de la medición en este repo

Complementan la sección anterior; no la sustituyen.

- Procedimiento reproducible de verificación y especificación de eventos: `docs/verificacion-medicion.md`. Ayudas:
  `scripts/verificar-medicion-navegador.js` (consola del navegador) y `scripts/verificar-medicion.ts` (servidor, ejecutar con
  `node --import tsx scripts/verificar-medicion.ts`).
- La lógica de consentimiento, atribución, enlaces, WhatsApp y eventos está en `src/components/CookieBanner.astro`; el
  `consent default` de Google y la carga de `gtag.js` van en el `<head>` de `src/layouts/BaseLayout.astro` (debe ir lo primero). Los
  formularios no tienen `<input type="hidden">`: se envían por `fetch` con JSON y la atribución viaja en el campo `attribution`
  (más `pageUrl`), que sale de `window.tdAttribution()`. Eso es lo que cuenta como «campos ocultos». Un formulario nuevo debe
  usar `window.tdAttribution?.()` y `window.tdTrackEvent?.("generate_lead", { lead_type })`.
- Los scripts de página que llamen a `window.tdTrackEvent` al cargar deben hacerlo con un `<script>` normal (módulo diferido), no
  `is:inline`: el banner de cookies se monta después del contenido y, si no, el evento se pierde.
- Cambiar el esquema de `attribution` (`backend/src/schemas.ts`) exige desplegar el backend (`npm run cdk:deploy`) **antes** que
  la web. La web se despliega sola al hacer push a `main`.
- Cada lead también crea una fila en Notion («CRM · Prospectos») desde `backend/src/notion.ts`, en paralelo al email y sin
  que un fallo de Notion lo impida. Necesita `NOTION_TOKEN` al desplegar (`npm run cdk:deploy`); sin él se omite con un aviso en
  logs. Verificación: `node --import tsx scripts/verificar-notion.ts`.
- Las reservas de Cal.com crean una fila en Notion (Canal de entrada «Reserva de llamada») por webhook: `POST /webhook/cal`
  (`backend/src/calWebhook.ts`), firmado con `CAL_WEBHOOK_SECRET` (también se pasa al desplegar). Verificación:
  `node --import tsx scripts/verificar-cal-webhook.ts`; detalle en `docs/verificacion-medicion.md` (F).
- Las páginas `reserva-confirmada` y `booking-confirmed` son `noindex` y están fuera del sitemap; no enlazarlas desde la web.

### Brechas conocidas frente a los requisitos (a 7-nov-2026)

- Consent Mode v2: implementado (script en el `<head>` de `BaseLayout.astro`; el banner solo hace `consent update`). Falta la etiqueta de Google Ads / Conversion Linker (ver siguiente punto).
- Etiqueta de Google Ads (`AW-…`) y Conversion Linker: no existen; las conversiones se importan desde GA4.
- Redirecciones (`src/config/legacyRedirects.mjs`: `/funnel-web`, `/auditoria-web`, `/herramientas-internas-medida`, etc.): ahora conservan la query y el hash con un script, pero GitHub Pages no puede dar un 301 HTTP; no usarlas como URL final de un anuncio.
- Sin consentimiento analítico, `landing` es la página donde se envía el formulario, no la de entrada.
- Las landings de campaña no usan `/lp/…`: tienen ruta propia con nombre descriptivo (`/desarrollo-software-a-medida/`, `/custom-software-development/`, `/automatizacion-procesos-ia/`, `/ai-process-automation/`; ver `docs/verificacion-medicion.md`). Plantilla: `src/layouts/CampaignLayout.astro`; contenido: `src/data/campaigns.ts`.
- La autoevaluación de auditoría web (Lambda propia, `PUBLIC_WEB_AUDIT_API_URL`) guarda la atribución pero no envía email de aviso.
