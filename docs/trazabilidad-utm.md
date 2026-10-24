# Trazabilidad: UTM y origen de los leads

Todo enlace que apunte a la web desde fuera (bios, descripciones, perfiles, firmas, publicaciones, QR) lleva UTM.
Sin UTM, el tráfico de redes llega a GA4 como `Direct`: los navegadores integrados de Instagram, Facebook y TikTok
no envían referrer.

## Convención

Siempre en minúsculas, sin espacios ni tildes. Cuatro parámetros:

| Parámetro | Qué es | Valores |
|---|---|---|
| `utm_source` | Plataforma donde está el enlace | `instagram`, `facebook`, `linkedin`, `youtube`, `tiktok`, `google`, `email`, `whatsapp`, `qr` |
| `utm_medium` | Tipo de colocación | `social` (bio, perfil, publicación), `video` (YouTube), `email`, `organic` (ficha de Google), `referral` (QR, tarjeta, firma) |
| `utm_campaign` | Dónde o con qué pieza | Ubicación fija (`bio`, `perfil`, `firma`, `tarjeta`, `gbp`) o pieza concreta: `2026-10-caso-billar` |
| `utm_content` | Variante, solo si hay dos enlaces en el mismo sitio | `boton-reserva`, `enlace-principal`, `descripcion` |

`source` + `medium` hacen que GA4 clasifique bien el canal (Organic Social, Organic Video, Email). Con `medium=social`
y `source=instagram`, el tráfico aparece en *Organic Social*, no en *Direct*.

La pieza concreta va en `utm_campaign` con fecha y tema (`aaaa-mm-tema`). Así se ve qué publicación trajo visitas.

## Enlaces listos para pegar

Destino general: el hub (`/hub/`), que reparte a reservar, WhatsApp, informe gratuito, test y blog.

| Dónde | Enlace |
|---|---|
| Instagram, bio | `https://tallerdedigitalizacion.com/hub/?utm_source=instagram&utm_medium=social&utm_campaign=bio` |
| TikTok, bio (límite de 80 caracteres, por eso sin `utm_campaign`) | `https://tallerdedigitalizacion.com/hub/?utm_source=tiktok&utm_medium=social` |
| Facebook, botón y "Sobre" de la página | `https://tallerdedigitalizacion.com/hub/?utm_source=facebook&utm_medium=social&utm_campaign=perfil` |
| LinkedIn, perfil personal | `https://tallerdedigitalizacion.com/hub/?utm_source=linkedin&utm_medium=social&utm_campaign=perfil` |
| YouTube, enlaces del canal | `https://tallerdedigitalizacion.com/hub/?utm_source=youtube&utm_medium=video&utm_campaign=perfil` |
| YouTube, descripción de un vídeo | `https://tallerdedigitalizacion.com/<pagina>/?utm_source=youtube&utm_medium=video&utm_campaign=<aaaa-mm-tema>` |
| Ficha de Google (web) | `https://tallerdedigitalizacion.com/?utm_source=google&utm_medium=organic&utm_campaign=gbp` |
| Publicación en Google Business | `https://tallerdedigitalizacion.com/<pagina>/?utm_source=google&utm_medium=organic&utm_campaign=gbp-<aaaa-mm-tema>` |
| Firma de email | `https://tallerdedigitalizacion.com/hub/?utm_source=email&utm_medium=referral&utm_campaign=firma` |
| Tarjeta o QR | `https://tallerdedigitalizacion.com/hub/?utm_source=qr&utm_medium=referral&utm_campaign=tarjeta` |
| Publicación en redes (cualquier plataforma) | `https://tallerdedigitalizacion.com/<pagina>/?utm_source=<plataforma>&utm_medium=social&utm_campaign=<aaaa-mm-tema>` |

La web de destino de una publicación es la página relacionada con el tema (caso, guía, servicio), no siempre el hub.

## Qué hace la web con los UTM

- Los guarda durante la sesión (solo si se aceptan las cookies analíticas) y los añade a los enlaces de reserva (cal.com),
  aunque el visitante navegue por otras páginas.
- Los envía con cada formulario (`attribution` en el lead: origen, canal, campaña, contenido y página de entrada).
  El email de aviso de lead incluye una línea `Origen:`.
- Añade un código visible al mensaje de WhatsApp, por ejemplo `(ref: instagram/bio)`. WhatsApp no admite parámetros.
  Quien escribe puede borrarlo.
- Sin consentimiento analítico no se guarda nada entre páginas: solo vale el UTM de la página de entrada.
- Eventos del hub: uno por enlace (`hub_servicios`, `hub_informe_web`, `hub_linkedin`, `hub_instagram`…).
  Reservar, WhatsApp y reseña mantienen `reservar_click`, `whatsapp_click` y `resena_click`, con el parámetro `link_id`.

## Pendiente en GA4 (se hace en la interfaz, no en el código)

1. **Eventos clave.** Marcar como evento clave `reservar_click`, `whatsapp_click`, `telefono_click`, `email_click`,
   `generate_lead` y `reserva_completada`. Hoy solo hay 2 eventos clave.
2. **Dimensión personalizada.** Registrar `link_id` (ámbito: evento) para distinguir desde qué botón del hub se reserva.
3. **Tráfico interno.** Crear el filtro de tráfico interno con la IP de la oficina y de casa: ahora mismo las pruebas propias
   cuentan como visitas y como clics de reserva.
4. **Informe de adquisición.** Revisar *Informes > Adquisición > Adquisición de tráfico* con dimensión
   *Fuente / medio de la sesión* para ver cada enlace de la tabla anterior.

## Comprobar un enlace

Abrir el enlace con UTM, aceptar las cookies analíticas y mirar en GA4 *Informes > Tiempo real*: la fuente debe salir como
`instagram / social`, no como `(direct) / (none)`.
