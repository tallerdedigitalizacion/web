# Instrucciones para el proyecto "Distribuidor de contenido": enlaces con UTM

Texto para pegar en las **Instrucciones del proyecto** (Project instructions) de Claude. Las instrucciones se leen en
cada conversación del proyecto, así que no dependen de que Claude "recuerde" nada. La memoria del proyecto es más
frágil: solo sirve como refuerzo.

---

## Pegar a partir de aquí

### Regla obligatoria: todo enlace a tallerdedigitalizacion.com lleva UTM

Cada vez que generes una publicación, un post, una descripción de vídeo, un correo o cualquier pieza que incluya un
enlace a `https://tallerdedigitalizacion.com`, ese enlace DEBE llevar parámetros UTM. Sin UTM, Google Analytics clasifica
la visita como "Direct" y no se puede saber qué publicación la trajo. No entregues ninguna pieza con un enlace sin UTM.

**Formato:**

`https://tallerdedigitalizacion.com/<pagina>/?utm_source=<plataforma>&utm_medium=<medio>&utm_campaign=<aaaa-mm-tema>`

**Reglas de los valores:** minúsculas, sin espacios, sin tildes, sin eñes. Separar palabras con guion.

| Parámetro | Valor |
|---|---|
| `utm_source` | La plataforma donde se publica: `instagram`, `facebook`, `linkedin`, `youtube`, `tiktok`, `google` (Google Business), `email`, `whatsapp` |
| `utm_medium` | `social` para Instagram, Facebook, LinkedIn y TikTok. `video` para YouTube. `organic` para Google Business. `email` para correos |
| `utm_campaign` | La pieza concreta, con el formato `aaaa-mm-tema` (año, mes y tema corto). Ejemplo: `2026-10-caso-billar` |
| `utm_content` | Opcional. Solo si la misma pieza lleva dos enlaces al mismo sitio, para distinguirlos: `boton-reserva`, `enlace-principal`, `descripcion` |

**Ejemplos:**

- Post de LinkedIn sobre el caso del billar:
  `https://tallerdedigitalizacion.com/portfolio/?utm_source=linkedin&utm_medium=social&utm_campaign=2026-10-caso-billar`
- Mismo tema en Instagram:
  `https://tallerdedigitalizacion.com/portfolio/?utm_source=instagram&utm_medium=social&utm_campaign=2026-10-caso-billar`
- Descripción de un vídeo de YouTube:
  `https://tallerdedigitalizacion.com/<pagina>/?utm_source=youtube&utm_medium=video&utm_campaign=2026-10-tema`
- Publicación de Google Business:
  `https://tallerdedigitalizacion.com/<pagina>/?utm_source=google&utm_medium=organic&utm_campaign=gbp-2026-10-tema`

**Cómo aplicarlo:**

1. Si la misma pieza se publica en varias redes, genera **un enlace distinto por red**, cambiando solo `utm_source`
   (y `utm_medium` si procede). El `utm_campaign` es el mismo en todas, para poder comparar redes con la misma pieza.
2. El destino es la página relacionada con el tema (caso, guía, servicio). Usa `/hub/` solo si no hay una página concreta.
3. Si la URL ya tiene una `?`, añade los UTM con `&`.
4. Los enlaces a WhatsApp (`wa.me`) y a Cal.com no llevan UTM: WhatsApp no los admite y la web ya añade el origen a las
   reservas. Enlaza a la web, no directamente a esos servicios.
5. Antes de entregar la pieza, revisa que cada enlace a tallerdedigitalizacion.com tenga `utm_source`, `utm_medium` y
   `utm_campaign`. Si falta alguno, corrígelo.
6. Al final de cada entrega, lista los enlaces con UTM en una tabla (plataforma, enlace), para poder copiarlos.

## Fin del texto a pegar

---

## Cómo ponerlo en el proyecto

1. Abre el proyecto "Distribuidor de contenido" en claude.ai.
2. En el panel derecho, junto a **Instrucciones** (*Instructions*), pulsa el lápiz.
3. Pega el bloque de arriba **al final** de las instrucciones que ya tienes, sin borrar nada.
4. Guarda. Vale para las conversaciones nuevas; las abiertas antes no lo recogen.
5. Como prueba, pide un post cualquiera y comprueba que el enlace sale con UTM. Si no sale, dile "falta el UTM":
   si falla de forma repetida, sube la regla al principio de las instrucciones.

La fuente de verdad de la convención es [docs/trazabilidad-utm.md](trazabilidad-utm.md) en el repositorio de la web.
Si cambia la convención, cambia en los dos sitios.
