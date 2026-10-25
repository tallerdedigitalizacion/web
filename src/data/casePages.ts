// Casos prácticos: trabajos concretos de automatización e IA ya hechos en empresas reales (sobre todo operadores
// de telecomunicaciones pequeños), explicados con palabras simples y con precio "desde" para llevarlos a otra empresa.
// No se nombran ni la empresa ni los proveedores ni los programas de terceros.
// Las páginas /casos/ y /casos/<slug>/ se construyen con estos datos.

export type CaseOffer = {
  name: string;
  // Precio en € sin IVA. `fixed` = precio cerrado; si no, es un precio "desde".
  price: number;
  fixed?: boolean;
  text: string;
};

export type CasePage = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  intro: string;
  // Resumen corto para la tarjeta del hub.
  summary: string;
  // El caso explicado con palabras simples; va justo encima del vídeo (src/data/videos.ts).
  practical: string[];
  schemaService: string;
  painTitle: string;
  pains: string[];
  builtTitle: string;
  built: [string, string][];
  resultTitle: string;
  result: string[];
  offersTitle: string;
  offers: CaseOffer[];
  planText: string;
  planPrice: number;
  // Opcional: cuánto se tarda y qué pasa después (solo en los casos que lo necesitan).
  timelineTitle?: string;
  timeline?: [string, string][];
  needsTitle: string;
  needs: [string, string][];
  faq: [string, string][];
  related: [string, string][];
  finalCta: string;
  formService: string;
};

// Preguntas que se repiten en varios casos.
const privacyFaq: [string, string] = [
  "¿Mis datos salen de mi empresa?",
  "Los datos se guardan en un sitio que controlas tú, como una cuenta de tu empresa en la nube. Si no quieres que la información pase por un modelo de IA externo, se puede montar un modelo local en un servidor propio. Es otro presupuesto y depende del equipo que haga falta, pero se puede.",
];

const peopleFaq: [string, string] = [
  "¿Quién decide, la IA o una persona?",
  "Lo que cuesta dinero o no se puede deshacer lo confirma una persona. La IA prepara, cruza, avisa y propone; no da de baja nada ni paga nada por su cuenta.",
];

export const casePages: CasePage[] = [
  {
    slug: "conciliacion-proveedores",
    title: "Auditoría de gastos de proveedores: lo que pagas sin usar | Taller de Digitalización",
    description:
      "Cruzo lo que te facturan tus proveedores con lo que tienes dado de alta en tu sistema para encontrar lo que pagas sin tener. Auditoría cerrada por 490 € + IVA.",
    eyebrow: "Caso práctico",
    h1: "¿Estás pagando por servicios que ya no tienes?",
    intro:
      "Cuando un cliente se da de baja o se va a otra compañía, el proveedor no siempre avisa y tu sistema no siempre se entera. Resultado: sigues pagando por algo que ya no existe. Hay una forma de cruzarlo solo y que te avise cuando algo no cuadra.",
    summary: "Cruzar lo que te facturan los proveedores con lo que tienes en tu sistema, y que te avise cuando algo no cuadra.",
    practical: [
      "Un operador de telecomunicaciones paga a varios proveedores por cada línea o servicio de sus clientes. Cuando un cliente se da de baja o se porta a otra compañía, el proveedor no siempre avisa y el sistema de la empresa tampoco se entera, así que se sigue pagando por algo que ya no existe.",
      "Lo que hicimos fue un proceso que mira de forma automática lo que dice cada proveedor, lo compara con lo que hay en el sistema de gestión y, si algo no cuadra, manda un correo diciendo qué hay que revisar. La decisión de dar de baja o de reclamar la toma una persona.",
    ],
    schemaService: "Auditoría y revisión automática de gastos de proveedores",
    painTitle: "¿Te pasa algo de esto?",
    pains: [
      "Los proveedores te facturan servicios y nadie comprueba línea por línea si siguen vigentes.",
      "Un cliente se porta a otra compañía y nadie te lo avisa; tú sigues pagando.",
      "Hay contratos con un proveedor que no constan en tu sistema de gestión.",
      "La comparación se hace a mano, de vez en cuando, y siempre con prisa.",
      "El sistema de gestión tiene una API poco fiable o no tiene ninguna, así que cruzar datos parece imposible.",
    ],
    builtTitle: "Qué se monta",
    built: [
      ["Un proceso que entra donde entrarías tú", "Como el sistema de gestión no ofrece una API fiable, el proceso entra en los portales web igual que lo haría una persona, con un usuario propio para la IA, y recoge la información."],
      ["Una base de datos con todo cruzado", "Lo que dice cada proveedor y lo que dice tu sistema se guardan juntos para poder compararlos sin abrir ocho pantallas."],
      ["Reglas fijas, no improvisadas", "El cruce es un proceso determinista: hace siempre lo mismo y da el mismo resultado. La IA no se inventa nada; el proceso es el que compara."],
      ["Un aviso por correo", "Si hay un contrato con un proveedor que no tienes en tu sistema, o una baja o portabilidad que nadie avisó, llega un correo diciendo qué hay que revisar."],
    ],
    resultTitle: "Qué cambia",
    result: [
      "Dejas de depender de que el proveedor te avise o de que alguien se acuerde de comparar. El cruce se hace solo, siempre con las mismas reglas, y lo que no cuadra llega a tu bandeja de entrada.",
      "La decisión de dar de baja o de reclamar sigue siendo de una persona. El proceso solo te enseña lo que hay que mirar.",
    ],
    offersTitle: "Cómo se puede empezar",
    offers: [
      {
        name: "Auditoría puntual de proveedores",
        price: 490,
        fixed: true,
        text: "Cruzo una vez lo que te factura un proveedor con lo que tienes en tu sistema y te entrego un informe con las discrepancias: lo que pagas sin tener y lo que no cuadra. Precio cerrado. Si hay más de un proveedor, te doy el presupuesto cerrado antes de empezar.",
      },
      {
        name: "Revisión automática de proveedores",
        price: 1800,
        text: "Lo mismo, pero repetido solo y con aviso por correo cuando aparece una discrepancia. El precio final depende de cuántos proveedores y sistemas haya que cruzar.",
      },
    ],
    planText: "Si los portales o los sistemas cambian, el proceso hay que adaptarlo. El plan mensual de Operaciones e IA lo vigila y lo mantiene.",
    planPrice: 99,
    needsTitle: "Qué necesito de tu lado",
    needs: [
      ["Los listados del proveedor", "Las facturas o el acceso de consulta a su portal, con el permiso que corresponda."],
      ["Una vista de tu sistema", "Un listado de lo que tienes dado de alta, o un acceso de solo lectura para sacarlo."],
      ["Alguien que decida", "Una persona que revise las discrepancias y diga qué se da de baja y qué se reclama."],
    ],
    faq: [
      ["¿Cuánto cuesta?", "La auditoría puntual cuesta 490 € + IVA, precio cerrado. La revisión automática parte de 1.800 € + IVA y te doy el precio cerrado antes de empezar, según cuántos proveedores y sistemas haya."],
      ["¿Sirve si no soy un operador de telecomunicaciones?", "Sí. Sirve en cualquier empresa con proveedores que facturan por servicio o por unidad: licencias de software, líneas, suscripciones, alquileres. El caso práctico es de telecomunicaciones, pero la idea es la misma."],
      ["¿Y si mi sistema no tiene API?", "Es justo el caso práctico. Se puede automatizar el acceso a su pantalla con un usuario específico, y si el sistema permite exportar listados, aún más fácil."],
      peopleFaq,
      privacyFaq,
    ],
    related: [
      ["Conectar tus programas (n8n, Make, Zapier, Holded, A3)", "/integracion-sistemas/"],
      ["Plan mensual de operaciones e IA", "/plan-operaciones-ia/"],
      ["Diagnóstico de caos operativo", "/diagnostico-caos-operativo/"],
    ],
    finalCta: "¿Quieres saber cuánto estás pagando por lo que no tienes? Lo cruzamos.",
    formService: "Auditoría de gastos de proveedores",
  },
  {
    slug: "dar-de-baja-software-historico",
    title: "Migrar datos de un programa antiguo y cancelar la licencia, con consulta por IA | Taller de Digitalización",
    description:
      "Rescato los datos de un programa que solo mantienes por el histórico y los dejo consultables con IA, sin interfaz ni licencia. Desde 900 € + IVA.",
    eyebrow: "Caso práctico",
    h1: "¿Pagas una licencia solo para consultar datos antiguos?",
    intro:
      "Mucha gente mantiene un programa que ya no usa por si hay que consultar algo. Pagas todos los meses por un histórico que miras dos veces al año. Se pueden rescatar esos datos y consultarlos con IA, sin licencia ni interfaz.",
    summary: "Sacar los datos de un programa que solo mantienes por el histórico y consultarlos con IA, sin licencia ni interfaz.",
    practical: [
      "Una empresa pagaba un programa solo para poder consultar datos antiguos. Sacamos toda su información con scripts, la guardamos en una base de datos propia, descargamos también todas las facturas y lo conectamos todo a la IA.",
      "Ahora se le pregunta en lenguaje normal, por ejemplo «¿qué le facturamos a este cliente en tal fecha?», y el programa se puede dar de baja.",
    ],
    schemaService: "Rescate de datos de un programa heredado y consulta con IA",
    painTitle: "Cuándo tiene sentido",
    pains: [
      "Pagas un programa o una plataforma solo por poder consultar el histórico.",
      "Los datos están atrapados en una interfaz lenta o incómoda y nadie quiere abrirla.",
      "Te da miedo dar de baja el servicio y perder facturas o datos de clientes antiguos.",
      "Hay incoherencias en los datos y nadie sabe qué es fiable.",
      "Quieres consultar las cosas preguntando, no navegando por menús.",
    ],
    builtTitle: "Qué se hace",
    built: [
      ["Extraer todo con scripts", "En lugar de pedirle a la IA que lo lea pantalla a pantalla, que gasta mucho, se escriben scripts que sacan toda la información de una vez."],
      ["Una base de datos propia", "Todo queda en un único archivo de base de datos, sencillo y portátil, que no depende de la licencia."],
      ["Anotar lo que no cuadra", "Los datos se cruzan con anotaciones de las incoherencias que ya estaban en el sistema, para que se sepa qué es fiable y qué no."],
      ["Descargar también las facturas", "Se bajan todas las facturas y se dejan en el almacenamiento de la empresa, con otro conector que permite encontrarlas."],
      ["Un conector para la IA", "Se monta un servidor MCP en la nube y se conecta a Claude. Desde ahí se pregunta en lenguaje normal."],
    ],
    resultTitle: "Qué cambia",
    result: [
      "Se consulta el histórico sin abrir el programa, sin interfaz y sin licencia. La información está en tu base de datos y la tienes disponible también desde el móvil.",
      "Antes de dar de baja nada se comprueba qué datos y qué facturas hay que conservar. Las facturas se guardan el tiempo que marque la ley.",
    ],
    offersTitle: "Cómo se puede empezar",
    offers: [
      {
        name: "Rescate del histórico + consulta con IA",
        price: 900,
        text: "Extraigo los datos, los dejo en una base de datos propia, los reviso y monto la consulta con IA. El precio final depende de cuánta información haya y de cómo se pueda sacar; te lo doy cerrado tras una primera revisión.",
      },
    ],
    planText: "Si quieres que lo mantenga, lo amplíe o le conecte nuevas fuentes, está el plan mensual de Operaciones e IA.",
    planPrice: 39,
    needsTitle: "Qué necesito de tu lado",
    needs: [
      ["Acceso de consulta al programa", "Un usuario con permiso para ver el histórico, y el permiso de su proveedor si hace falta."],
      ["Saber qué hay que conservar", "Qué datos y qué facturas necesitas guardar y durante cuánto tiempo."],
      ["Una cuenta donde guardarlo", "Un espacio de tu empresa donde alojar la base de datos y los documentos."],
    ],
    faq: [
      ["¿Cuánto cuesta?", "Desde 900 € + IVA. Depende de cuánta información haya y de cómo se pueda extraer. Tras una primera revisión te doy el precio cerrado."],
      ["¿Y si el programa no deja exportar los datos?", "Depende de cada programa. A veces se pueden sacar con scripts desde la propia interfaz y otras hay que pedir una copia de la base de datos al proveedor, que suele darla al tramitar la baja. Lo reviso antes de comprometerme."],
      ["¿Pierdo facturas o datos al dar de baja?", "No si se hace en orden: primero se extrae y se comprueba, y solo después se da de baja. Las facturas se guardan el tiempo que marque la ley."],
      peopleFaq,
      privacyFaq,
    ],
    related: [
      ["Software a medida para empresas", "/herramientas-internas-medida/"],
      ["Asistente de IA con los documentos de tu empresa", "/asistente-ia-empresa/"],
      ["Plan mensual de operaciones e IA", "/plan-operaciones-ia/"],
    ],
    finalCta: "¿Hay un programa que solo pagas por el histórico? Veamos si se puede dar de baja.",
    formService: "Migrar datos de un programa antiguo y cancelar la licencia",
  },
  {
    slug: "consulta-cobertura-ia",
    title: "Consulta de cobertura con IA: pregunta por una dirección y te dice si llega | Taller de Digitalización",
    description:
      "Un conector que permite preguntar a la IA si hay cobertura en una dirección y a qué distancia está la más cercana. Desde 1.200 € + IVA.",
    eyebrow: "Caso práctico",
    h1: "Pregunta a la IA si hay cobertura en una dirección.",
    intro:
      "Saber si una dirección tiene cobertura obliga a abrir un mapa, comparar varias fuentes y repetirlo cada vez. Con un conector, se le pregunta a la IA en una frase y responde si llega y a qué distancia está la siguiente zona cubierta.",
    summary: "Preguntar a la IA si una dirección tiene cobertura y a qué distancia está la más cercana, sin abrir ninguna interfaz.",
    practical: [
      "Una empresa de internet necesitaba saber, para cada cliente, si llegaba la cobertura a su dirección y qué podía ofrecerle. Antes se consultaba a mano en varias fuentes.",
      "Lo que hicimos fue conectar los datos de cobertura a la IA. Ahora se le da una dirección, ella localiza el punto en el mapa, lo cruza con los datos de cobertura y responde si hay cobertura y a qué distancia está la siguiente. No hay pantalla nueva: se pregunta y ya.",
    ],
    schemaService: "Conector de IA para consulta de datos geográficos y de cobertura",
    painTitle: "Cuándo tiene sentido",
    pains: [
      "Cada consulta de cobertura es manual y depende de quién la haga.",
      "Tus datos de cobertura están en varios archivos o plataformas y hay que cruzarlos a mano.",
      "Quieres que el equipo de ventas conteste al momento, sin esperar a la persona técnica.",
      "Tienes datos con coordenadas (cobertura, zonas de servicio, reparto) y no los aprovechas.",
      "Una interfaz nueva para esto no compensa, pero preguntar a la IA sí.",
    ],
    builtTitle: "Qué se monta",
    built: [
      ["Un servicio que convierte una dirección en coordenadas", "Es el primer paso: pasar de «calle y número» a un punto en el mapa."],
      ["Un segundo servicio que busca en tus datos", "Con esas coordenadas, busca en las bases de datos de cobertura y responde si hay cobertura y a qué distancia está la siguiente."],
      ["Un conector para la IA", "Los dos servicios se envuelven con un servidor MCP y se conectan a Claude. No hay pantalla nueva: se le pregunta a la IA."],
      ["Una respuesta útil para vender", "La respuesta sirve para decidir qué se le puede ofrecer a cada cliente según dónde vive."],
    ],
    resultTitle: "Qué cambia",
    result: [
      "Una consulta que antes era una tarea manual pasa a ser una pregunta de una frase, que cualquiera del equipo puede hacer también desde el móvil.",
      "Lo mismo vale para cualquier empresa que decida según el lugar: zonas de reparto, zonas de servicio, disponibilidad por municipio.",
    ],
    offersTitle: "Cómo se puede empezar",
    offers: [
      {
        name: "Consulta por IA sobre tus datos de ubicación",
        price: 1200,
        text: "Monto el conector sobre tus datos (cobertura, zonas, reparto…) para que se consulte por dirección. El precio final depende de cuántas fuentes de datos haya y de su calidad; te lo doy cerrado tras ver los datos.",
      },
    ],
    planText: "Los datos de cobertura cambian. El plan mensual de Operaciones e IA mantiene el conector y lo actualiza cuando se renuevan las fuentes.",
    planPrice: 99,
    needsTitle: "Qué necesito de tu lado",
    needs: [
      ["Tus datos de ubicación", "Los archivos o bases de datos con coordenadas: cobertura, zonas, puntos de servicio."],
      ["Una idea de qué decisión quieres tomar", "Por ejemplo, qué se ofrece según la zona. Así la respuesta de la IA sirve de verdad."],
      ["Una cuenta donde alojarlo", "Un servidor o espacio en la nube de tu empresa para el conector."],
    ],
    faq: [
      ["¿Cuánto cuesta?", "Desde 1.200 € + IVA. Depende de cuántas fuentes de datos haya y de su estado. Tras ver los datos te doy el precio cerrado."],
      ["¿Sirve para algo que no sea cobertura?", "Sí. Cualquier dato con coordenadas sirve: zonas de reparto, zonas de servicio, delegaciones, puntos de recogida."],
      ["¿Qué tan fiable es la respuesta?", "La respuesta sale de tus datos, no de la imaginación de la IA: la IA localiza la dirección y consulta tu base de datos. Es tan buena como lo sean tus datos, y por eso reviso su calidad antes."],
      peopleFaq,
      privacyFaq,
    ],
    related: [
      ["Conectar tus programas (n8n, Make, Zapier, Holded, A3)", "/integracion-sistemas/"],
      ["Asistente de IA con los documentos de tu empresa", "/asistente-ia-empresa/"],
      ["Caos operativo en telecomunicaciones", "/caos-operativo-telecomunicaciones/"],
    ],
    finalCta: "¿Tienes datos con coordenadas que nadie aprovecha? Pregúntaselos a la IA.",
    formService: "Consulta de cobertura con IA",
  },
  {
    slug: "entrada-facturas-automatica",
    title: "Automatizar facturas de proveedores: que entren solas en Holded, A3 o tu programa | Taller de Digitalización",
    description:
      "Las facturas entran solas en tu programa de gestión y una persona las valida. De una semana de revisión cada trimestre a una mañana. Desde 2.500 € + IVA.",
    eyebrow: "Caso práctico",
    h1: "Automatizar facturas de proveedores: que entren solas en tu programa.",
    intro:
      "Las facturas entran solas en el programa donde las gestionas y una persona las valida. Se acabó teclearlas y se acabó rastrear quién metió cada una. Es un trabajo hecho a medida de cómo entran las facturas en tu empresa.",
    summary: "Las facturas entran solas en tu programa de gestión y una persona las valida. De una semana de revisión a una mañana.",
    practical: [
      "Una empresa recibe facturas de sus proveedores y tiene que introducirlas en su programa de gestión. Cada trimestre, alguien tenía que averiguar quién había introducido cada una, cuándo, si estaba finalizada, si estaba validada y si cuadraba. Era una semana de trabajo de buscar facturas y cruzar datos.",
      "Lo que hicimos fue automatizar la entrada: la factura llega por su cauce, un proceso la lee, la introduce en el programa y la deja lista para que una persona la valide. Cuando la persona la finaliza, la IA compara lo que había introducido con lo que se corrigió y aprende de la diferencia.",
      "El resultado: lo que era una semana de trabajo cada trimestre pasó a ser una mañana.",
    ],
    schemaService: "Automatización de la entrada de facturas",
    painTitle: "Cuándo tiene sentido",
    pains: [
      "Alguien dedica horas cada semana a copiar los datos de las facturas a mano.",
      "Cada trimestre toca averiguar quién introdujo qué, cuándo y en qué estado está cada factura.",
      "Las facturas llegan por distintos cauces y nadie sabe cuáles están ya introducidas.",
      "Se cometen errores al teclear importes, fechas o proveedores.",
      "La gestoría recibe los datos tarde o con errores.",
    ],
    builtTitle: "Cómo funciona",
    built: [
      ["La factura entra por tu cauce", "El que ya uses: una carpeta, un correo, un portal. Depende de cómo entren hoy tus facturas."],
      ["Se lee y se guarda", "Un proceso extrae los datos de la factura y guarda el documento."],
      ["Se introduce en tu programa", "El proceso introduce la factura en el programa de gestión, con un usuario propio para la automatización, y la deja pendiente."],
      ["Una persona la valida", "Nada se cierra solo: la factura espera a que alguien la revise y la finalice."],
      ["La IA aprende de las correcciones", "Compara lo que introdujo con lo que la persona finalizó y aprende de la diferencia."],
      ["Pasa donde toque", "Si tu flujo termina en la contabilidad o en la gestoría, la factura finalizada se envía también allí."],
    ],
    resultTitle: "Qué cambia",
    result: [
      "Lo que era una semana de trabajo cada trimestre, buscando facturas y averiguando quién metió qué, pasó a ser una mañana. Todas las facturas entran por el mismo camino y una persona valida cada una.",
      "El flujo es específico de cada empresa: cómo entran las facturas, quién las introduce y en qué programa. Por eso es un trabajo a medida y no un programa que se instala.",
    ],
    offersTitle: "Cuánto cuesta",
    offers: [
      {
        name: "Automatizar facturas de proveedores",
        price: 2500,
        text: "Un trabajo a medida de tu flujo de facturas: cómo entran, quién las introduce y en qué programa o programas hay que introducirlas. El precio final depende de ese flujo; te lo doy cerrado tras la primera llamada. Incluye un mes de desarrollo y tres meses de observación.",
      },
    ],
    planText: "Después de los tres meses de observación empieza el mantenimiento mensual: las facturas cambian y la IA no es determinista, así que hay que seguir controlando los errores.",
    planPrice: 99,
    timelineTitle: "Cuánto se tarda y cómo sigue",
    timeline: [
      ["Llamada gratuita", "Entiendo el flujo de tus facturas y te digo si se puede hacer en tu caso."],
      ["Un mes de desarrollo", "Construyo la entrada automática a medida de tu flujo y de tu programa."],
      ["Tres meses de observación", "Reviso cómo se comporta con tus facturas reales y corrijo los errores que aparezcan."],
      ["Mantenimiento mensual", "Desde ahí, plan mensual para controlar errores y adaptar lo que cambie."],
    ],
    needsTitle: "Qué necesito de tu lado",
    needs: [
      ["El flujo de tus facturas hoy", "Cómo entran, quién las introduce y por dónde pasan hasta quedar finalizadas."],
      ["Dónde se introducen", "En qué programa, o en cuántos, hay que introducirlas, y cómo funciona su acceso y su seguridad."],
      ["Quién las valida", "La persona que revisa cada factura antes de cerrarla."],
    ],
    faq: [
      ["¿Cuánto cuesta?", "Desde 2.500 € + IVA. Es un trabajo específico para el flujo de facturas de tu empresa, así que el precio final depende de ese flujo. Te lo doy cerrado tras la primera llamada."],
      ["¿Se puede hacer en mi caso?", "Hay que estudiarlo. Depende del flujo de tus facturas y, sobre todo, de la seguridad del programa donde hay que introducirlas, que a veces es un impedimento. Por eso la primera llamada es gratuita: lo miramos y te digo si se puede."],
      ["¿Cuánto se tarda?", "Un mes de desarrollo y tres meses de observación, en los que reviso cómo se comporta con tus facturas reales. Después empieza el mantenimiento mensual."],
      ["¿Puede equivocarse con un importe?", "Sí. La IA no es determinista: no siempre llegan las mismas facturas, no todas se leen bien y no siempre entran por el mismo cauce. Por eso hay tres meses de observación, una persona que valida cada factura y un mantenimiento mensual para controlar los errores."],
      ["¿Mis datos salen de mi empresa?", "No. Lo único que está en tránsito son las facturas. No sale ningún otro dato de tu empresa."],
    ],
    related: [
      ["Conectar tus programas (n8n, Make, Zapier, Holded, A3)", "/integracion-sistemas/"],
      ["Software a medida para empresas", "/herramientas-internas-medida/"],
      ["Plan mensual de operaciones e IA", "/plan-operaciones-ia/"],
    ],
    finalCta: "¿Alguien en tu empresa introduce facturas a mano? Veamos cómo automatizarlo.",
    formService: "Automatizar facturas de proveedores",
  },
];

// 1800 -> "1.800" (el formato es-ES de Intl no separa los miles de cuatro cifras).
export const formatEuro = (amount: number) => `${String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} €`;

// Precio de entrada de un caso: la oferta más barata.
export const entryOffer = (page: CasePage) => page.offers.reduce((lowest, offer) => (offer.price < lowest.price ? offer : lowest));

// Qué caso real se enseña en cada página de servicio (ruta -> slug del caso). El caso no tiene por qué ser el mismo tema
// que la página: sirve para que una persona no técnica vea cómo se trabaja. Las páginas en inglés no lo llevan.
const caseByPath: Record<string, string> = {
  "/": "dar-de-baja-software-historico",
  // Páginas locales
  "/informatico-empresas-toledo/": "dar-de-baja-software-historico",
  "/mantenimiento-informatico-toledo/": "dar-de-baja-software-historico",
  "/informatico-fuensalida-torrijos/": "dar-de-baja-software-historico",
  "/informatico-illescas-la-sagra/": "dar-de-baja-software-historico",
  "/informatico-navalcarnero-mostoles/": "dar-de-baja-software-historico",
  "/consultor-digitalizacion-toledo/": "entrada-facturas-automatica",
  "/diagnostico-en-tu-empresa/": "entrada-facturas-automatica",
  "/ciberseguridad-empresas-toledo/": "conciliacion-proveedores",
  "/google-workspace-empresas-toledo/": "conciliacion-proveedores",
  "/diseno-web-toledo/": "consulta-cobertura-ia",
  // Páginas de producto
  "/caos-operativo-telecomunicaciones/": "conciliacion-proveedores",
  "/gestor-contrasenas-empresas/": "conciliacion-proveedores",
  "/mantenimiento-wordpress/": "dar-de-baja-software-historico",
  "/landing-page-campanas/": "consulta-cobertura-ia",
  "/consultoria-erp-pymes/": "entrada-facturas-automatica",
  "/gestion-leads-crm/": "consulta-cobertura-ia",
  "/agente-ia-atencion-cliente/": "consulta-cobertura-ia",
  "/asistente-ia-empresa/": "dar-de-baja-software-historico",
  "/plan-operaciones-ia/": "conciliacion-proveedores",
  // Servicios
  "/integracion-sistemas/": "conciliacion-proveedores",
  "/herramientas-internas-medida/": "entrada-facturas-automatica",
  "/oraculo-interno/": "dar-de-baja-software-historico",
  "/oraculo-externo/": "consulta-cobertura-ia",
  "/centralizacion-leads/": "consulta-cobertura-ia",
  "/gestion-centralizada-accesos/": "conciliacion-proveedores",
  "/reestructuracion-google-drive/": "dar-de-baja-software-historico",
  "/reorganizacion-google-workspace/": "conciliacion-proveedores",
  "/landing-pages-conversion/": "consulta-cobertura-ia",
  // Diagnósticos, web y soporte
  "/diagnostico-caos-operativo/": "conciliacion-proveedores",
  "/diagnostico-digitalizacion/": "entrada-facturas-automatica",
  "/informe-gratuito-web/": "consulta-cobertura-ia",
  "/optimizacion-velocidad-web/": "consulta-cobertura-ia",
  "/soporte-remoto/": "dar-de-baja-software-historico",
};

export const caseForPath = (path: string) => {
  const normalized = path === "/" ? "/" : `/${path.replace(/^\/+|\/+$/g, "")}/`;
  const slug = caseByPath[normalized];
  return casePages.find((page) => page.slug === slug);
};
