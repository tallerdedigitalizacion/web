// Verificación de la parte de navegador de la medición. Se pega entera en la consola de DevTools de la página
// que se quiere comprobar (localhost o producción) y deja un objeto `tdVerify` con tres ayudas:
//
//   tdVerify.report()            -> resumen de atribución, enlaces, cookies y eventos (devuelve un objeto)
//   tdVerify.interceptLeads()    -> desde ahora los formularios NO se envían: el cuerpo de cada POST queda en
//                                   tdVerify.leads (así se prueba un envío sin crear un lead real)
//   tdVerify.events()            -> eventos enviados a GA4 (nombre y parámetros) desde que se cargó la página
//   tdVerify.driveQuiz(respuestas?) -> (solo C05) rellena el cuestionario «¿Dónde estás tú?» como lo haría una persona, abre el
//                                   resultado y devuelve título y líneas. Sin argumento usa una combinación de ejemplo
//   tdVerify.quiz()              -> (solo C05) comprueba los eventos del cuestionario y la guía: OK / FALLA por punto
//                                   (quiz_start, quiz_complete, descarga_lead_magnet, suscripcion_curso; ningún generate_lead)
//
// Procedimiento completo en docs/verificacion-medicion.md. No modifica la web: solo lee y, si se pide, intercepta fetch.
(() => {
  const clickIds = ["gclid", "gbraid", "wbraid"];
  const fields = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", ...clickIds];
  const decode = (value) => {
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  };

  const tdVerify = {
    leads: [],

    events() {
      return (window.dataLayer || [])
        .map((entry) => Array.from(entry))
        .filter((entry) => entry[0] === "event")
        .map(([, name, params]) => ({ name, params }));
    },

    // Cuestionario de C05. Respuestas = { doc_procesos, automatizacion_previa, infraestructura, dependencia_persona, trazabilidad,
    // situaciones: [..] } con los valores internos (si, parcial, no, nose, varias, alguna, ninguna, equipo, externo, cerrada, otro,
    // retraso, para, esfuerzo, facturas, clientes, datos, informes, pedidos, persona). Termina en el resultado (no envía nada).
    async driveQuiz(answers = { doc_procesos: "si", automatizacion_previa: "ninguna", infraestructura: "externo", dependencia_persona: "retraso", trazabilidad: "esfuerzo", situaciones: ["facturas", "clientes"] }) {
      const root = document.querySelector("[data-pq]");
      if (!root) return "esta página no tiene el cuestionario (solo /automatizacion-procesos-ia/ y /ai-process-automation/)";
      const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      for (const key of ["doc_procesos", "automatizacion_previa", "infraestructura", "dependencia_persona", "trazabilidad", "situaciones"]) {
        [].concat(answers[key]).forEach((value) => root.querySelector(`input[data-pq-input="${key}"][value="${value}"]`).click());
        await wait(40);
        root.querySelector("[data-pq-next]").click();
        await wait(60);
      }
      return {
        titulo: root.querySelector("[data-pq-result-title]").textContent,
        enlaceGuia: root.querySelector("[data-pq-result-guide]").textContent + " -> " + root.querySelector("[data-pq-result-guide]").getAttribute("href"),
        lineas: [...root.querySelectorAll("[data-pq-result-lines] li")].map((li) => li.textContent),
      };
    },

    quiz() {
      const events = tdVerify.events();
      const named = (name) => events.filter((event) => event.name === name);
      const results = [];
      const check = (label, ok, detail = "") => results.push({ punto: label, resultado: ok ? "OK" : "FALLA", detalle: detail });
      const has = (params, keys) => keys.every((key) => params && params[key] !== undefined && params[key] !== "");
      const start = named("quiz_start");
      const complete = named("quiz_complete");
      const downloads = named("descarga_lead_magnet");
      const leads = named("generate_lead").filter((event) => event.params && event.params.lead_type === "guia_automatizacion");
      check("quiz_start: uno por intento, con idioma", start.length === 1 && has(start[0].params, ["idioma"]), JSON.stringify(start.map((e) => e.params)));
      check("quiz_complete: idioma y los 6 parámetros del resultado", complete.length >= 1 && has(complete[0].params, ["idioma", "doc_procesos", "automatizacion_previa", "infraestructura", "dependencia_persona", "trazabilidad", "punto_partida", "num_situaciones"]), JSON.stringify(complete.map((e) => e.params)));
      check("quiz_complete: punto_partida es uno de los 5 valores", complete.length > 0 && ["fase-1", "fase-1-calma", "fase-2-pequeno", "fase-2-limitada", "fase-2"].includes(complete[0].params.punto_partida), complete[0] ? complete[0].params.punto_partida : "(no hay)");
      check("descarga_lead_magnet (si se ha pulsado un enlace a la guía): link_url, link_text, link_id, page_path, page_location, idioma", downloads.length === 0 || downloads.every((event) => has(event.params, ["link_url", "link_text", "link_id", "page_path", "page_location", "idioma"])), downloads.length === 0 ? "ninguno todavía: pulsa el enlace del resultado o el botón de descarga" : JSON.stringify(downloads.map((e) => e.params.link_id)));
      check("generate_lead NO se emite con el cuestionario ni con la guía (no es un lead)", leads.length === 0, `${leads.length} (debe ser 0)`);
      const flat = JSON.stringify(events.filter((event) => ["quiz_start", "quiz_complete", "descarga_lead_magnet", "suscripcion_curso", "generate_lead"].includes(event.name)).map((event) => event.params));
      check("sin datos personales (email, @, nombre) en los parámetros", !/@/.test(flat) && !/"(email|name|nombre|phone|telefono)"/i.test(flat));
      return { eventosDelCuestionario: events.filter((event) => ["quiz_start", "quiz_complete", "descarga_lead_magnet", "suscripcion_curso", "generate_lead"].includes(event.name)), comprobaciones: results };
    },

    interceptLeads() {
      if (tdVerify._originalFetch) return "ya estaba activo";
      tdVerify._originalFetch = window.fetch;
      window.fetch = async (url, options) => {
        const isLead = /\/lead\//.test(String(url));
        if (!isLead) return tdVerify._originalFetch(url, options);
        let body = options && options.body;
        try {
          body = JSON.parse(body);
        } catch {
          // Cuerpo que no es JSON: se deja tal cual.
        }
        tdVerify.leads.push({ url: String(url), body });
        return new Response(JSON.stringify({ ok: true, emailDelivered: true, message: "(simulado)" }), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      };
      return "activo: los envíos a /lead/* se guardan en tdVerify.leads y NO se envían";
    },

    report() {
      const url = new URL(window.location.href);
      const urlParams = {};
      fields.forEach((key) => {
        if (url.searchParams.get(key)) urlParams[key] = url.searchParams.get(key);
      });

      const internal = [...document.querySelectorAll("a[href]")]
        .map((a) => new URL(a.href, window.location.href))
        .filter((u) => u.origin === window.location.origin && !/\.[a-z0-9]{2,5}$/i.test(u.pathname));
      const carrying = internal.filter((u) => fields.some((key) => u.searchParams.has(key)));

      const cookieNames = document.cookie.split(";").map((c) => c.split("=")[0].trim()).filter(Boolean);
      const remote = performance
        .getEntriesByType("resource")
        .map((r) => r.name)
        .filter((n) => /googletagmanager|google-analytics|analytics\.google|googleadservices|doubleclick|facebook|chatbase/.test(n))
        .map((n) => n.split("?")[0]);

      // Pings de GA4 con su estado de consentimiento: gcs=G100 (todo denegado, sin cookies) o G111 (concedido).
      const pingsGA4 = performance
        .getEntriesByType("resource")
        .map((r) => r.name)
        .filter((n) => /\/g\/collect/.test(n))
        .map((n) => ({ evento: (n.match(/[&?]en=([^&]+)/) || [])[1], gcs: (n.match(/[&?]gcs=([^&]+)/) || [])[1] }));

      let storedAttribution = null;
      let consent = null;
      try {
        storedAttribution = sessionStorage.getItem("td_attribution");
        consent = localStorage.getItem("td_cookie_consent");
      } catch {
        // Almacenamiento no disponible.
      }

      return {
        url: window.location.href,
        parametrosEnLaUrl: urlParams,
        consentimiento: consent ? JSON.parse(consent) : "sin decidir",
        atribucionGuardada: storedAttribution ? JSON.parse(storedAttribution) : null,
        tdAttribution: window.tdAttribution ? window.tdAttribution() : "no disponible",
        whatsapp: [...document.querySelectorAll('a[href*="wa.me/"]')].map((a) => decode(new URL(a.href).searchParams.get("text") || "")),
        reservaCal: [...document.querySelectorAll('a[href^="https://cal.com"]')].slice(0, 2).map((a) => a.href),
        enlacesInternos: { total: internal.length, conParametros: carrying.length, ejemploSinParametros: internal.filter((u) => !carrying.includes(u)).slice(0, 3).map((u) => u.pathname) },
        cookies: cookieNames,
        peticionesTerceros: [...new Set(remote)],
        gtag: typeof window.gtag,
        pingsGA4,
        eventos: tdVerify.events(),
      };
    },
  };

  window.tdVerify = tdVerify;
  console.log("tdVerify listo. Prueba: tdVerify.report() · tdVerify.interceptLeads() · tdVerify.events() · (C05) tdVerify.driveQuiz() · tdVerify.quiz()");
})();
