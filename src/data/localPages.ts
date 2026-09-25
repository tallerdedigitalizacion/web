export type LocalPage = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  intro: string;
  schemaService: string;
  areas: string[];
  problemsTitle: string;
  problems: string[];
  servicesTitle: string;
  services: [string, string][];
  zoneTitle: string;
  zoneText: string[];
  approachTitle: string;
  approach: [string, string][];
  faq: [string, string][];
  related: [string, string][];
  finalCta: string;
};

export const localPages: LocalPage[] = [
  {
    slug: "informatico-empresas-toledo",
    title: "Informático para empresas en Toledo | Taller de Digitalización",
    description: "Informático para empresas y autónomos en Toledo: ordenadores, correo, red, copias de seguridad y web. Soporte en remoto el mismo día y visitas presenciales.",
    eyebrow: "Informático · Toledo",
    h1: "Informático para empresas en Toledo.",
    intro: "Cuando el correo no entra, la impresora no imprime o el ordenador de facturación no arranca, la empresa se para. Soy Pablo Leone y doy soporte informático a empresas, autónomos y PyMEs de Toledo: resuelvo en remoto lo que se puede resolver a distancia y voy a vuestra oficina cuando hace falta.",
    schemaService: "Soporte informático para empresas",
    areas: ["Toledo", "Bargas", "Olías del Rey", "Polígono de Santa María de Benquerencia"],
    problemsTitle: "Problemas que resuelvo cada semana",
    problems: [
      "El correo de la empresa no envía, no recibe o acaba en spam.",
      "Ordenadores lentos, que se cuelgan o que nadie ha actualizado en años.",
      "La impresora o el escáner de red funciona solo en algunos equipos.",
      "La wifi de la oficina se cae o no llega a todos los puestos.",
      "No hay copia de seguridad fiable de la facturación ni de los documentos.",
      "Las contraseñas están en un Excel o se pasan por WhatsApp.",
      "La web está caída, va lenta o nadie sabe dónde está alojada.",
    ],
    servicesTitle: "Qué incluye el soporte informático",
    services: [
      ["Incidencias en remoto", "Conexión segura a tu equipo para resolver problemas de software, correo, cuentas y programas sin esperar a una visita."],
      ["Visitas a tu empresa", "Instalación y revisión de equipos, red, impresoras y puestos de trabajo en tu oficina de Toledo."],
      ["Correo y Google Workspace", "Configuración de correo profesional, dominios, firmas, Drive compartido y permisos por persona."],
      ["Copias de seguridad", "Copias automáticas y comprobadas de lo importante: facturación, documentos y correo."],
      ["Seguridad básica", "Gestor de contraseñas, doble factor, antivirus y accesos que se pueden retirar cuando alguien se va."],
      ["Web y dominio", "Si la web o el dominio dan problemas, lo reviso y lo dejo documentado para que no dependa de nadie."],
    ],
    zoneTitle: "Soporte informático en Toledo capital y alrededores",
    zoneText: [
      "Trabajo con empresas de Toledo capital, el Polígono Industrial, Bargas, Olías del Rey y el resto de la comarca. Mi base está en Fuensalida, a unos 30 minutos, así que las visitas presenciales se organizan con facilidad.",
      "Aun así, la mayoría de incidencias se resuelven en remoto el mismo día: no hace falta esperar a que alguien venga para que el correo vuelva a funcionar.",
    ],
    approachTitle: "Cómo trabajo",
    approach: [
      ["Me cuentas el problema", "Por teléfono, WhatsApp o en una llamada de 30 minutos. Si es urgente, lo miramos en el momento."],
      ["Presupuesto antes de tocar nada", "Te digo qué pasa, cuánto cuesta arreglarlo y si merece la pena. Sin sorpresas en la factura."],
      ["Lo resuelvo y te lo explico", "En lenguaje normal y dejando por escrito lo que he hecho, para que la próxima vez sea más rápido."],
    ],
    faq: [
      ["¿Cuánto cuesta un informático para empresas en Toledo?", "Depende de si es una incidencia puntual o un mantenimiento continuo. Antes de empezar te doy un presupuesto cerrado; la primera llamada para entender el problema es gratuita."],
      ["¿Venís a la oficina o todo es en remoto?", "Las dos cosas. Lo que se puede resolver a distancia lo resuelvo en remoto, que es más rápido y barato. Para hardware, red o instalaciones, voy a vuestra empresa en Toledo."],
      ["¿Trabajas con autónomos y empresas pequeñas?", "Sí. Es justo el caso más habitual: autónomos y PyMEs de pocas personas que no tienen informático propio y necesitan a alguien de confianza."],
      ["¿Puedo llamarte solo cuando tenga un problema?", "Sí. Puedes contratar incidencias puntuales. Si ves que los problemas se repiten, te propondré un mantenimiento para prevenirlos, pero no es obligatorio."],
      ["¿Atiendes a particulares?", "Mi servicio está pensado para empresas y autónomos, con equipos y herramientas de trabajo."],
    ],
    related: [
      ["Mantenimiento informático en Toledo", "/mantenimiento-informatico-toledo/"],
      ["Informático en Fuensalida y Torrijos", "/informatico-fuensalida-torrijos/"],
      ["Optimización de velocidad web", "/optimizacion-velocidad-web/"],
    ],
    finalCta: "¿Tienes un problema informático en tu empresa de Toledo? Cuéntamelo y lo vemos hoy.",
  },
  {
    slug: "mantenimiento-informatico-toledo",
    title: "Mantenimiento informático para empresas en Toledo | Taller de Digitalización",
    description: "Mantenimiento informático preventivo para PyMEs en Toledo: actualizaciones, copias de seguridad, antivirus, red y soporte cuando lo necesitas. Presupuesto cerrado.",
    eyebrow: "Mantenimiento informático · Toledo",
    h1: "Mantenimiento informático para empresas en Toledo.",
    intro: "La mayoría de problemas informáticos de una empresa se ven venir: un disco que empieza a fallar, una copia de seguridad que dejó de hacerse hace meses, un equipo sin actualizar. El mantenimiento informático sirve para detectarlos antes de que paren el negocio.",
    schemaService: "Mantenimiento informático para empresas",
    areas: ["Toledo", "Torrijos", "Fuensalida", "Illescas"],
    problemsTitle: "Señales de que tu empresa necesita mantenimiento",
    problems: [
      "Cada mes surge una urgencia distinta y siempre en el peor momento.",
      "Nadie sabe con certeza si las copias de seguridad funcionan.",
      "Los equipos tienen versiones distintas de Windows, Office o antivirus.",
      "Cuando entra alguien nuevo, prepararle el ordenador y los accesos lleva días.",
      "Cuando alguien se va, sigue teniendo acceso al correo o a las carpetas.",
      "El router, la wifi o el servidor tienen la contraseña de fábrica.",
    ],
    servicesTitle: "Qué incluye el mantenimiento",
    services: [
      ["Revisión periódica", "Estado de discos, actualizaciones del sistema, antivirus y rendimiento de cada equipo."],
      ["Copias de seguridad comprobadas", "No basta con tener copia: se comprueba que se puede restaurar."],
      ["Inventario de equipos y accesos", "Qué equipos hay, quién usa qué, qué licencias pagáis y quién tiene acceso a cada cosa."],
      ["Altas y bajas de personal", "Ordenador preparado, correo y permisos listos el primer día, y accesos retirados el último."],
      ["Red y seguridad", "Router, wifi para invitados separada, contraseñas cambiadas y dispositivos actualizados."],
      ["Soporte incluido", "Las incidencias del día a día se atienden con prioridad dentro del mantenimiento."],
    ],
    zoneTitle: "Mantenimiento presencial y en remoto",
    zoneText: [
      "Gran parte del mantenimiento se hace en remoto, fuera del horario de trabajo para no interrumpir. Las revisiones presenciales se programan en empresas de Toledo, Torrijos, Fuensalida, Illescas y el resto de municipios a menos de 50 km de Fuensalida.",
      "Si tu empresa está fuera de esa zona, el mantenimiento remoto cubre casi todo: actualizaciones, copias, seguridad y soporte.",
    ],
    approachTitle: "Cómo empezamos",
    approach: [
      ["Revisión inicial", "Hago un inventario de equipos, copias, accesos y riesgos. Es la foto de partida."],
      ["Plan y cuota cerrada", "Te propongo qué revisar y con qué frecuencia, con un precio mensual fijo según el número de equipos."],
      ["Informe claro", "Cada revisión termina con un resumen en lenguaje normal: qué estaba bien, qué he corregido y qué conviene decidir."],
    ],
    faq: [
      ["¿Qué diferencia hay entre mantenimiento y soporte puntual?", "El soporte puntual arregla lo que se ha roto. El mantenimiento revisa los equipos de forma periódica para que se rompan menos cosas y, cuando pase, esté todo documentado y con copia."],
      ["¿Cuánto cuesta el mantenimiento informático de una PyME?", "Se calcula según el número de equipos, servidores y servicios que haya que cubrir. Tras la revisión inicial te doy una cuota mensual cerrada."],
      ["¿Hay permanencia?", "No trabajo con permanencias largas. Si el servicio no te aporta, puedes dejarlo."],
      ["¿Tenéis que venir cada mes a la oficina?", "No necesariamente. La mayoría de tareas se hacen en remoto. Las visitas se programan cuando hace falta revisar hardware o red."],
    ],
    related: [
      ["Informático para empresas en Toledo", "/informatico-empresas-toledo/"],
      ["Informático en Fuensalida y Torrijos", "/informatico-fuensalida-torrijos/"],
      ["Diagnóstico de caos operativo", "/diagnostico-caos-operativo/"],
    ],
    finalCta: "¿Quieres dejar de apagar fuegos informáticos cada mes? Empecemos con una revisión.",
  },
  {
    slug: "informatico-fuensalida-torrijos",
    title: "Informático en Fuensalida y Torrijos para empresas | Taller de Digitalización",
    description: "Informático en Fuensalida para empresas y autónomos de Torrijos, Novés, Portillo, Camarena, Méntrida y alrededores. Soporte cercano, en remoto o presencial.",
    eyebrow: "Informático · Fuensalida y Torrijos",
    h1: "Informático en Fuensalida y Torrijos para empresas y autónomos.",
    intro: "Taller de Digitalización está en Fuensalida. Si tienes una empresa, un comercio o eres autónomo en Fuensalida, Torrijos o los pueblos de alrededor, tienes a un informático a pocos minutos que también resuelve en remoto lo que no necesita visita.",
    schemaService: "Informático para empresas y autónomos",
    areas: ["Fuensalida", "Torrijos", "Novés", "Portillo de Toledo", "Camarena", "Méntrida", "Huecas", "Villamiel de Toledo", "Santa Olalla", "Escalona", "Maqueda"],
    problemsTitle: "Lo que me piden empresas y comercios de la zona",
    problems: [
      "Configurar el correo profesional con el dominio de la empresa.",
      "Poner en marcha ordenadores nuevos y pasar los datos del antiguo.",
      "Que la impresora, el TPV o el programa de facturación funcionen en red.",
      "Resolver problemas de wifi en naves, tiendas y oficinas.",
      "Hacer copias de seguridad de la facturación y los documentos.",
      "Revisar o arreglar la web y la ficha de Google del negocio.",
    ],
    servicesTitle: "Servicios en Fuensalida, Torrijos y comarca",
    services: [
      ["Soporte informático", "Incidencias de ordenadores, correo, impresoras y programas, en remoto o en tu negocio."],
      ["Mantenimiento", "Revisiones periódicas, actualizaciones y copias comprobadas para que no haya sustos."],
      ["Redes y wifi", "Cobertura en naves y locales, wifi separada para clientes y router bien configurado."],
      ["Correo y Google Workspace", "Correo con tu dominio, calendario y documentos compartidos para el equipo."],
      ["Web y presencia en Google", "Revisión de la web, velocidad y ficha de Google para que los clientes de la zona te encuentren."],
      ["Digitalización del negocio", "Ordenar herramientas y procesos: facturación, citas, presupuestos y atención al cliente."],
    ],
    zoneTitle: "Cerca de verdad",
    zoneText: [
      "Estar en Fuensalida significa que puedo llegar a Torrijos, Novés, Portillo, Camarena, Méntrida, Santa Olalla o Escalona en poco tiempo cuando la incidencia requiere ir en persona.",
      "Para todo lo demás, trabajo en remoto: te conectas, me dices qué pasa y lo vemos juntos en la pantalla.",
    ],
    approachTitle: "Cómo trabajo con negocios de la zona",
    approach: [
      ["Llamada o WhatsApp", "Me cuentas qué pasa. Si puedo resolverlo en remoto, lo hacemos en el momento."],
      ["Visita si hace falta", "Para hardware, red o instalaciones, quedamos en tu empresa o local."],
      ["Precio claro", "Te digo cuánto cuesta antes de empezar y te explico lo que he hecho."],
    ],
    faq: [
      ["¿Dónde estás exactamente?", "En Fuensalida (Toledo). Desde aquí atiendo de forma presencial Torrijos y toda la comarca, y en un radio de 50 km, incluidos Toledo, La Sagra y el sur de Madrid."],
      ["¿Atiendes urgencias?", "Si es algo que para tu negocio, dímelo al llamar. Las urgencias remotas suelen poder atenderse el mismo día."],
      ["¿Trabajas con comercios y hostelería?", "Sí. Además de oficinas, puedo ayudar a tiendas, talleres y negocios de hostelería con TPV, impresoras, wifi y programas de gestión."],
      ["¿Me puedes ayudar a salir en Google Maps?", "Sí. Reviso tu ficha de Google, la web y los datos del negocio para que aparezcas cuando alguien de la zona busca lo que haces."],
    ],
    related: [
      ["Informático para empresas en Toledo", "/informatico-empresas-toledo/"],
      ["Mantenimiento informático", "/mantenimiento-informatico-toledo/"],
      ["Consultor de digitalización", "/consultor-digitalizacion-toledo/"],
    ],
    finalCta: "¿Tienes un negocio en Fuensalida, Torrijos o alrededores? Estoy aquí al lado.",
  },
  {
    slug: "consultor-digitalizacion-toledo",
    title: "Consultor de digitalización para PyMEs en Toledo | Taller de Digitalización",
    description: "Consultor de digitalización para PyMEs en Toledo: ordenar procesos y herramientas, automatizar tareas y usar IA con criterio. Diagnóstico inicial y hoja de ruta.",
    eyebrow: "Consultoría de digitalización · Toledo",
    h1: "Consultor de digitalización para PyMEs en Toledo.",
    intro: "Digitalizar no es comprar más software. Es conseguir que la empresa funcione sin depender de la memoria del dueño, que la información esté donde tiene que estar y que las tareas repetidas dejen de hacerse a mano. Ayudo a PyMEs de Toledo a decidir qué cambiar, en qué orden y con qué herramientas.",
    schemaService: "Consultoría de digitalización para PyMEs",
    areas: ["Toledo", "Illescas", "Torrijos", "Fuensalida", "Seseña", "Yuncos"],
    problemsTitle: "Cuándo tiene sentido hablar con un consultor de digitalización",
    problems: [
      "Pagas herramientas (ERP, CRM, Google Workspace) que el equipo no usa o usa a medias.",
      "Todo pasa por el dueño: presupuestos, decisiones, dudas del equipo.",
      "Los datos están repartidos entre Excel, WhatsApp, correo y papel.",
      "Se pierden clientes potenciales porque nadie hace seguimiento a tiempo.",
      "Quieres usar IA o automatizaciones pero no sabes por dónde empezar.",
      "Estás a punto de cambiar de software y no quieres equivocarte otra vez.",
    ],
    servicesTitle: "Cómo ayudo",
    services: [
      ["Diagnóstico de caos operativo", "Un análisis estructurado de procesos, herramientas y dependencias para saber qué está frenando la empresa."],
      ["Hoja de ruta", "Qué cambiar primero según impacto, esfuerzo y riesgo. Sin proyectos gigantes."],
      ["Herramientas bien configuradas", "Google Workspace, CRM, ERP o gestores de tareas configurados para cómo trabaja tu empresa."],
      ["Automatizaciones", "Tareas repetidas conectadas entre herramientas: presupuestos, avisos, altas de clientes, informes."],
      ["IA con criterio", "Agentes de atención al cliente y asistentes internos acotados, con datos de tu empresa y sin promesas mágicas."],
      ["Acompañamiento", "Implementación por fases y seguimiento mensual para que los cambios se queden."],
    ],
    zoneTitle: "Consultoría en Toledo, La Sagra y el sur de Madrid",
    zoneText: [
      "Trabajo con PyMEs de Toledo, Illescas, Seseña, Yuncos, Torrijos y el sur de Madrid. Las reuniones de diagnóstico pueden ser presenciales en tu empresa (hasta 50 km de Fuensalida) o por videollamada.",
      "La implementación se hace sobre todo en remoto, con sesiones de seguimiento con el equipo.",
    ],
    approachTitle: "El proceso",
    approach: [
      ["Llamada gratuita", "30 minutos para entender la situación y ver si tiene sentido trabajar juntos."],
      ["Diagnóstico", "Entrevistas, revisión de herramientas y procesos. Resultado: mapa de problemas, prioridades y hoja de ruta."],
      ["Implementación", "Cambios por fases, empezando por los de más impacto y menos esfuerzo."],
    ],
    faq: [
      ["¿Qué hace un consultor de digitalización?", "Analiza cómo funciona la empresa, detecta dónde se pierde tiempo o información y propone qué cambiar: procesos, herramientas y automatizaciones, en un orden realista."],
      ["¿Necesito cambiar todo mi software?", "Casi nunca. Lo habitual es aprovechar mejor lo que ya pagas y cambiar solo lo que de verdad está frenando."],
      ["¿Cuánto dura un proyecto de digitalización?", "El diagnóstico lleva unas semanas. La implementación va por fases y depende de lo que se decida priorizar."],
      ["¿Es solo para empresas grandes?", "No. Tiene más sentido cuando ya hay varias personas, varias herramientas y tareas repetidas, algo muy habitual en PyMEs de 5 a 50 personas."],
      ["¿Usas inteligencia artificial?", "Cuando aporta. Por ejemplo, agentes de soporte que responden dudas frecuentes o asistentes que resumen información interna, siempre acotados y revisados."],
    ],
    related: [
      ["Diagnóstico de caos operativo", "/diagnostico-caos-operativo/"],
      ["Informático para empresas en Toledo", "/informatico-empresas-toledo/"],
      ["Optimización de velocidad web", "/optimizacion-velocidad-web/"],
    ],
    finalCta: "¿Tu empresa funciona, pero cada vez pesa más? Hablemos de cómo ordenarla.",
  },
];
