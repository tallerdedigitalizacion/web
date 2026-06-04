# Taller de Digitalización

Landing page estática en Astro para vender el diagnóstico de Caos Operativo y captar leads mediante una autoevaluación interactiva.

Incluye un backend serverless en AWS para guardar leads, calcular el diagnóstico en servidor y enviar emails desde plantillas.

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

Después de desplegar la API en AWS, copia el output `LeadsApiUrl` en:

```ts
formEndpoint: "https://xxxxxxxxxx.execute-api.eu-west-1.amazonaws.com/prod/"
```

## Backend AWS

El backend está en TypeScript y usa:

- Hono sobre AWS Lambda.
- API Gateway REST pública.
- DynamoDB para leads, respuestas y rate limit.
- Amazon SES para enviar emails.
- SMTP de Zoho Mail como alternativa configurable.
- AWS CDK para infraestructura.

Endpoints:

- `POST /lead/diagnostic`: guarda lead, respuestas del wizard, score e interpretación; envía el diagnóstico por email.
- `POST /lead/method`: guarda lead y envía el método completo por email con adjunto si existe el PDF.
- `GET /health`: comprobación simple de API.

Código:

```text
backend/src
infra
```

## Deploy del backend

Requisitos:

- AWS CLI configurado con credenciales.
- CDK bootstrap hecho en la cuenta/región.
- Remitente verificado en Amazon SES.
- Si SES está en sandbox, los destinatarios de prueba también deben estar verificados en SES.

Comandos:

```bash
npm run backend:typecheck
npm run cdk:synth
npm run cdk:deploy
```

Variables recomendadas para deploy:

```bash
SENDER_EMAIL=info@tallerdedigitalizacion.com
NOTIFY_EMAIL=info@tallerdedigitalizacion.com
EMAIL_DRIVER=ses
PUBLIC_SITE_URL=https://tallerdedigitalizacion.com
BOOKING_URL=https://calendly.com/tallerdedigitalizacion-info/30min
ALLOWED_ORIGINS=https://tallerdedigitalizacion.com,http://localhost:4322,http://localhost:4323
IP_HASH_SALT=cambia-esto-por-un-valor-largo-y-secreto
npm run cdk:deploy
```

Para usar SMTP en lugar de SES:

```bash
EMAIL_DRIVER=smtp
SMTP_HOST=smtp.zoho.eu
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=info@tallerdedigitalizacion.com
SMTP_PASSWORD=contraseña-o-app-password-de-zoho
npm run cdk:deploy
```

No publiques sin `SENDER_EMAIL`, `EMAIL_DRIVER` e `IP_HASH_SALT`.

## Seguridad de formularios

El endpoint es público, así que se han añadido controles básicos:

- CORS con orígenes permitidos.
- Validación estricta con Zod.
- Honeypot invisible.
- Tiempo mínimo antes de enviar el formulario.
- Límite de tamaño de payload.
- Rate limit por IP hasheada y acción en DynamoDB.
- No se guarda la IP en claro.

Esto reduce abuso básico, pero no sustituye controles más avanzados como WAF, captcha adaptativo o listas de bloqueo si hubiera tráfico malicioso real.

## PDF del método

El adjunto del método se toma desde:

```text
public/downloads/metodo-auditoria-caos-operativo.pdf
```

CDK lo empaqueta dentro de la Lambda en cada deploy. Si el archivo no existe, el email del método se envía sin adjunto.

## GitHub Pages

El frontend sigue siendo estático. Para publicar:

```bash
npm run build
```

Publica la carpeta `dist` o usa el flujo de GitHub Pages ya configurado. El dominio esperado es:

```text
https://tallerdedigitalizacion.com
```

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

Las páginas `/aviso-legal`, `/politica-privacidad` y `/politica-cookies` contienen textos legales en español. Revisar antes de publicar.
