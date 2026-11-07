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
- Toda la lógica de consentimiento, atribución, enlaces, WhatsApp y eventos está en `src/components/CookieBanner.astro`. Los
  formularios no tienen `<input type="hidden">`: se envían por `fetch` con JSON y la atribución viaja en el campo `attribution`
  (más `pageUrl`), que sale de `window.tdAttribution()`. Eso es lo que cuenta como «campos ocultos». Un formulario nuevo debe
  usar `window.tdAttribution?.()` y `window.tdTrackEvent?.("generate_lead", { lead_type })`.
- Los scripts de página que llamen a `window.tdTrackEvent` al cargar deben hacerlo con un `<script>` normal (módulo diferido), no
  `is:inline`: el banner de cookies se monta después del contenido y, si no, el evento se pierde.
- Cambiar el esquema de `attribution` (`backend/src/schemas.ts`) exige desplegar el backend (`npm run cdk:deploy`) **antes** que
  la web. La web se despliega sola al hacer push a `main`.
- Las páginas `reserva-confirmada` y `booking-confirmed` son `noindex` y están fuera del sitemap; no enlazarlas desde la web.

### Brechas conocidas frente a los requisitos (a 7-nov-2026)

- Consent Mode v2: **no implementado**. GA4 solo se carga tras aceptar, sin `gtag('consent', …)`.
- Etiqueta de Google Ads (`AW-…`) y Conversion Linker: no existen; las conversiones se importan desde GA4.
- Redirecciones de `astro.config.mjs` (`/funnel-web`, `/auditoria-web`, etc.): `meta refresh` que pierde la query.
- Sin consentimiento analítico, `landing` es la página donde se envía el formulario, no la de entrada.
- No existe ninguna ruta `/lp/…` todavía.
- La autoevaluación de auditoría web (Lambda propia, `PUBLIC_WEB_AUDIT_API_URL`) guarda la atribución pero no envía email de aviso.
