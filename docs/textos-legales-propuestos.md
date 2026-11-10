# Textos legales propuestos (sin publicar)

Pendientes de tu revisión. **No están en la web.** Los dos primeros bloques hay que revisarlos con quien lleve el
asesoramiento legal antes de publicarlos.

## 1. Política de privacidad: tratamiento en el CRM (Notion)

Para `src/pages/politica-privacidad.astro` (apartado «Destinatarios y encargados del tratamiento» y, si procede, en la
finalidad de los formularios) y su equivalente en inglés `privacy-policy.astro`.

**Español**

> Los datos que facilitas en los formularios, autoevaluaciones y descargas (nombre, email, teléfono si lo indicas, tu mensaje
> o la necesidad que declares y el origen de tu visita, por ejemplo la campaña publicitaria desde la que llegaste) se guardan
> además en nuestro CRM, que utiliza Notion (Notion Labs, Inc.) como encargado del tratamiento, para poder atender tu
> solicitud y hacer su seguimiento. Notion puede tratar datos fuera del Espacio Económico Europeo conforme a las garantías
> que ofrece (cláusulas contractuales tipo).

**English**

> The data you provide in forms, self-assessments and downloads (name, email, phone if you give one, your message or the need
> you describe, and the origin of your visit, such as the ad campaign you came from) is also stored in our CRM, which uses
> Notion (Notion Labs, Inc.) as a data processor, so that we can handle your request and follow it up. Notion may process
> data outside the European Economic Area under the safeguards it offers (standard contractual clauses).

Antes de publicarlo, confirma que el encargo con Notion está firmado (DPA de Notion) y la base legal que quieres citar.

## 2. Política de cookies: Consent Mode

Este texto **ya está aplicado** en la rama en `src/pages/politica-cookies.astro` (apartados 3.2, 3.3, 5, 9 y 11 y la tabla de
cookies). Se deja aquí por si prefieres otra redacción. La frase pedida («solo se envían señales agregadas sin cookies») la he
sustituido por una más exacta, porque esas señales incluyen la dirección IP y datos del navegador, y no son «agregadas» en el
momento del envío:

> Las etiquetas de Google (Google Analytics 4 y la medición de Google Ads) se cargan en todas las visitas, pero con el
> consentimiento denegado por defecto (Consent Mode v2). Mientras el usuario no acepte la categoría correspondiente, no se
> escribe ninguna cookie de Google y Google solo recibe señales técnicas sin cookies, como la página visitada, el origen de la
> visita y datos del navegador, además de la dirección IP propia de cualquier conexión. Esas señales no se asocian a un
> identificador persistente del navegador y sirven para medir de forma agregada y estimar conversiones.

Si prefieres la frase literal, es «sin consentimiento solo se envían señales agregadas sin cookies». Mi recomendación es no
usarla: afirma más de lo que ocurre.

## 3. Texto del banner (ya aplicado)

> Usamos cookies necesarias para que la web funcione. Sin tu permiso, Google solo recibe señales técnicas sin cookies. Las
> analíticas, el chat de ayuda y la medición de anuncios solo se activan si las permites.
