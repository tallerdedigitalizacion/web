# Taller de Digitalización

Landing page estática en Astro para vender el diagnóstico de Caos Operativo y captar leads mediante una autoevaluación interactiva.

## Comandos

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Configuración principal

Cambia URLs, logo, GA4, Chatbase, WhatsApp, Calendly, Linktree, email, endpoint de formularios y textos legales en:

```text
src/config/site.ts
```

## Formularios

Los formularios usan el placeholder:

```text
[INSERTAR_ENDPOINT_FORMULARIO]
```

Puedes conectarlo a Formspree, Netlify Forms, Google Forms o un endpoint externo. Si no hay endpoint real, la descarga del diagnóstico genera una versión imprimible local y el método intenta abrir:

```text
public/downloads/metodo-auditoria-caos-operativo.pdf
```

No se incluye ese PDF. Colócalo en esa ruta cuando exista.

## GitHub Pages

El proyecto está configurado como sitio estático. Para GitHub Pages:

1. Define `PUBLIC_SITE_URL` con la URL pública real si cambia el dominio.
2. Ejecuta `npm run build`.
3. Publica la carpeta `dist`.

Si publicas en una ruta de repositorio tipo `https://usuario.github.io/repositorio/`, añade `base` en `astro.config.mjs` y ajusta `siteConfig.publicUrl`.

## Analítica y cookies

Google Analytics no se carga hasta que el usuario acepta cookies analíticas. Los eventos preparados incluyen:

- `click_reservar_llamada`
- `click_whatsapp`
- `click_linktree`
- `inicio_autoevaluacion`
- `finalizacion_autoevaluacion`
- `descarga_diagnostico`
- `descarga_metodo`
- `aceptacion_cookies`
- `rechazo_cookies`

## Legales

Las páginas `/aviso-legal`, `/politica-privacidad` y `/politica-cookies` incluyen texto legal base con placeholders visibles. Revisar antes de publicar.
