// Verificación de la parte de navegador de la medición. Se pega entera en la consola de DevTools de la página
// que se quiere comprobar (localhost o producción) y deja un objeto `tdVerify` con tres ayudas:
//
//   tdVerify.report()            -> resumen de atribución, enlaces, cookies y eventos (devuelve un objeto)
//   tdVerify.interceptLeads()    -> desde ahora los formularios NO se envían: el cuerpo de cada POST queda en
//                                   tdVerify.leads (así se prueba un envío sin crear un lead real)
//   tdVerify.events()            -> eventos enviados a GA4 (nombre y parámetros) desde que se cargó la página
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
        eventos: tdVerify.events(),
      };
    },
  };

  window.tdVerify = tdVerify;
  console.log("tdVerify listo. Prueba: tdVerify.report() · tdVerify.interceptLeads() · tdVerify.events()");
})();
