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

> Con el consentimiento analítico aceptado, GA4 envía de verdad los eventos (también desde `localhost`). Para ver solo la
> parte local usa DebugView y filtra por `localhost`, o prueba con «Rechazar», que no envía nada.

## Pasos

### A. Sin decidir las cookies (el caso más frecuente en móvil)

1. Abre la URL de prueba **sin tocar el banner** y ejecuta `tdVerify.report()`.
2. Espera: `consentimiento: "sin decidir"`, `cookies: []`, `peticionesTerceros: []`, `gtag: "undefined"`.
3. `tdAttribution` con los 7 valores y `clickIdType: "gclid"`. WhatsApp con `(ref: google/C99-prueba/A)`. El enlace a Cal.com
   con `utm_*` y `gclid`. `enlacesInternos.conParametros == total`.
4. Pulsa un enlace interno (clic real). La nueva URL lleva los parámetros y `tdAttribution` los conserva. Nota: **sin
   consentimiento, `landing` pasa a ser la página actual**, no la de entrada (no se guarda nada).

### B. Aceptar

1. En la URL de prueba, pulsa «Aceptar todas».
2. Espera: cookies `_ga`, `_ga_*`, `_gcl_aw` (el gclid) y `chatbase_anon_id`; `td_attribution` en `sessionStorage` con los
   parámetros y `landing`; `gtag: "function"`.
3. Eventos (`tdVerify.events()` o DebugView): `aceptacion_cookies`. Haz clic en WhatsApp, teléfono, email y reservar: cada uno
   genera `whatsapp_click`, `telefono_click`, `email_click`, `reservar_click` con `link_url, link_text, link_id, page_path,
   page_location`.
4. Navega a una URL **sin parámetros** de la misma pestaña: `tdAttribution()` sigue devolviendo la atribución guardada y su
   `landing` original.
5. Navega a una URL con parámetros distintos: la atribución se sustituye entera (sin restos del clic anterior).
6. Desplázate hasta el final: aparece el evento automático `scroll` con `percent_scrolled = 90` (medición mejorada de GA4).

### C. Rechazar

1. En la URL de prueba, pulsa «Rechazar».
2. Espera: ninguna cookie, ninguna petición a Google, Chatbase ni Meta, `sessionStorage` vacío, `gtag: "undefined"`.
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

## Eventos: cuáles son de conversión

| Evento | Qué es | ¿Evento clave? |
|---|---|---|
| `generate_lead` (con `lead_type`) | Lead capturado: **canónico**, uno por acción | **Sí** |
| `reserva_completada` | Cita confirmada en Cal.com | **Sí** |
| `whatsapp_click` | Intención de contacto por WhatsApp | Sí (conversión secundaria) |
| `telefono_click` | Intención de llamada | Sí (conversión secundaria) |
| `reservar_click` | Intención de reservar | No como principal: cuenta a la vez que `reserva_completada` |
| `email_click` | Intención de escribir | Opcional |
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

- Sin Consent Mode v2 ni etiqueta de Google Ads (`AW-`): no implementado.
- Sin consentimiento, `landing` es la página donde se envía el formulario, no la de entrada.
- Las redirecciones de `astro.config.mjs` (`/funnel-web`, etc.) son `meta refresh` y pierden la query: no usarlas en anuncios.
- La autoevaluación web (`PUBLIC_WEB_AUDIT_API_URL`, Lambda propia) guarda la atribución pero **no envía email de aviso**.
- La atribución persistida (solo con consentimiento) vive en `sessionStorage`: no sobrevive a cerrar la pestaña ni se comparte
  entre pestañas.

## Informe de verificación (plantilla)

```
Landing: /lp/<id>-<nombre>/        Fecha:
A. Sin decidir cookies   OK / FALLA
B. Aceptar               OK / FALLA
C. Rechazar              OK / FALLA
D. Formulario/BD/email   OK / FALLA   (salida de verificar-medicion.ts)
E. Cal.com + gracias     OK / FALLA
Notas:
```
