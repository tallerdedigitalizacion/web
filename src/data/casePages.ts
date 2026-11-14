// Casos prácticos: trabajos concretos de automatización e IA ya hechos en empresas reales (sobre todo operadores
// de telecomunicaciones pequeños), explicados con palabras simples y con precio "desde" para llevarlos a otra empresa.
// Nunca se nombran los proveedores ni los programas de terceros. La empresa solo se nombra si el caso tiene `clientName`.
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
  // Empresa del caso, solo si se puede nombrar. Sin él, la página dice que no se nombra.
  clientName?: string;
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
      ["Software a medida para empresas", "/desarrollo-software-a-medida/"],
      ["Asistente de IA con los documentos de tu empresa", "/asistente-ia-empresa/"],
      ["Plan mensual de operaciones e IA", "/plan-operaciones-ia/"],
    ],
    finalCta: "¿Hay un programa que solo pagas por el histórico? Veamos si se puede dar de baja.",
    formService: "Migrar datos de un programa antiguo y cancelar la licencia",
  },
  {
    slug: "consulta-cobertura-ia",
    clientName: "Nimbus Telecom",
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
      ["Software a medida para empresas", "/desarrollo-software-a-medida/"],
      ["Plan mensual de operaciones e IA", "/plan-operaciones-ia/"],
    ],
    finalCta: "¿Alguien en tu empresa introduce facturas a mano? Veamos cómo automatizarlo.",
    formService: "Automatizar facturas de proveedores",
  },
  {
    slug: "presupuestos-desde-el-sitio",
    title: "Presupuestos desde el propio sitio con IA conectada a tu ERP | Taller de Digitalización",
    description:
      "Tus técnicos describen el trabajo y la IA monta el presupuesto con existencias, costes de proveedor y margen, y lo envía al cliente desde el propio sitio. Desde 3.000 € + IVA.",
    eyebrow: "Caso práctico",
    h1: "Presupuestos desde el propio sitio, sin volver a la oficina.",
    intro:
      "Un técnico ve el trabajo, pero el presupuesto se hace después, en la oficina, peleando con el ERP: buscar cada artículo, mirar si hay existencias, pedir precio al proveedor, calcular el margen. Con la IA conectada a tu ERP, el técnico describe el trabajo en el sitio y el presupuesto sale en el momento.",
    summary: "El técnico describe el trabajo y la IA monta el presupuesto con existencias, costes y margen, y lo envía al cliente desde el propio sitio.",
    practical: [
      "Los técnicos de una empresa de instalaciones hacían los presupuestos en el ERP, que era torpe para buscar los artículos, comprobar existencias, estimar costes según el proveedor, aplicar márgenes o sumar desplazamientos. El técnico veía el trabajo, volvía a la oficina y allí hacía todas las averiguaciones. Salía a un presupuesto cada dos días por técnico.",
      "Lo que hicimos fue darle a la IA una habilidad para presupuestar y conectarla al ERP. Como el ERP no ofrece una API completa, montamos un servidor con Playwright que entra en el ERP igual que lo haría una persona, y le dimos también acceso a la web para consultar precios. Ahora el técnico escribe qué trabajo es y qué cree que debe llevar el presupuesto, y la IA lo construye al momento con los artículos y un precio estimado. Le dice si hay existencias o si hay que pedir, a qué precio y con qué margen. Cuando el técnico está conforme, el presupuesto se crea en el ERP y se envía por correo al cliente. Todo en tiempo real, desde el propio sitio.",
    ],
    schemaService: "Presupuestos con IA conectada al ERP, desde el lugar del trabajo",
    painTitle: "¿Te pasa algo de esto?",
    pains: [
      "Tus técnicos ven el trabajo pero el presupuesto se hace después, en la oficina.",
      "Buscar artículos en el ERP, comprobar existencias y calcular costes y márgenes es lento y se hace a mano.",
      "El cliente espera días por un presupuesto que podría tener antes de que el técnico se vaya.",
      "Cada presupuesto exige volver, con los kilómetros y las horas de desplazamiento que eso cuesta.",
      "Tu ERP no tiene una API completa, así que conectarlo con nada parece imposible.",
    ],
    builtTitle: "Qué se monta",
    built: [
      ["Una habilidad de presupuestos para la IA", "Reúne cómo presupuestáis vosotros: qué lleva cada tipo de trabajo, cómo se calculan los márgenes, cuándo se suma el desplazamiento."],
      ["Un conector con tu ERP", "Un servidor MCP conecta la IA con el ERP. Como el ERP no ofrece una API completa, el servidor usa Playwright y trabaja en el ERP igual que lo haría una persona."],
      ["Acceso a la web", "Para consultar precios y disponibilidad de proveedores que no están en el ERP."],
      ["Un presupuesto que el técnico revisa", "La IA propone los artículos, las existencias, el coste y el margen. El técnico lo ajusta hasta que está conforme."],
      ["El envío al cliente", "Con el visto bueno del técnico, el presupuesto se crea en el ERP y se envía por correo al cliente, sin pasar por la oficina."],
    ],
    resultTitle: "Qué cambia",
    result: [
      "De un presupuesto cada dos días por técnico se pasó a uno al día, y el cliente lo recibe en el momento. Además, los técnicos hacen menos kilómetros y pierden menos horas de desplazamiento.",
      "La IA no decide el precio: lo propone, y es el técnico quien lo confirma. Se sabe en el momento si hay existencias o hay que hacer un pedido, y a qué precio y con qué margen.",
    ],
    offersTitle: "Cómo se puede empezar",
    offers: [
      {
        name: "Presupuestos con IA conectada a tu ERP",
        price: 3000,
        text: "Monto la habilidad de presupuestos, el conector con tu ERP (con Playwright si no tiene una API completa) y el envío al cliente. El precio final depende de tu ERP, de cuántos tipos de trabajo haya que cubrir y de si hace falta consultar webs de proveedores; te lo doy cerrado tras ver cómo presupuestáis hoy.",
      },
    ],
    planText: "Si el ERP cambia sus pantallas, el conector hay que adaptarlo, y los precios y los márgenes también cambian. El plan mensual de Operaciones e IA lo mantiene y lo vigila.",
    planPrice: 99,
    needsTitle: "Qué necesito de tu lado",
    needs: [
      ["Cómo presupuestáis hoy", "Un par de presupuestos reales y quién los hace, para recoger los artículos, los márgenes y los desplazamientos."],
      ["Un acceso a tu ERP", "Un usuario específico para la IA, con los permisos justos para consultar y crear presupuestos."],
      ["Los proveedores que consultáis", "A cuáles se les pide precio y dónde se mira, para que la IA haga el mismo recorrido."],
      ["Un técnico para probarlo", "Una persona que lo use con trabajos reales las primeras semanas y diga qué falla."],
    ],
    faq: [
      ["¿Cuánto cuesta?", "Desde 3.000 € + IVA. Depende de tu ERP, de cuántos tipos de trabajo haya que presupuestar y de si hay que consultar webs de proveedores. Tras ver cómo presupuestáis hoy te doy el precio cerrado."],
      ["¿Funciona si mi ERP no tiene API?", "Sí, es el caso práctico. Si el ERP no ofrece una API completa, el conector trabaja en sus pantallas igual que una persona, con un usuario propio para la IA."],
      ["¿Puede equivocarse con un precio?", "Puede. Por eso el técnico revisa el presupuesto antes de enviarlo y no se envía nada sin su visto bueno. Además, las existencias y los costes salen de tu ERP y de las webs de tus proveedores, no de la imaginación de la IA."],
      ["¿Qué pasa si el ERP cambia?", "Si cambia sus pantallas, el conector se tiene que adaptar. El plan mensual de Operaciones e IA lo vigila y lo mantiene para que no se rompa sin que nadie se entere."],
      ["¿Sirve para otro tipo de empresa?", "Sí, para cualquiera que presupueste fuera de la oficina: instalaciones, reparaciones, mantenimiento, reformas. La idea es que quien ve el trabajo pueda dar el presupuesto allí mismo."],
      peopleFaq,
      privacyFaq,
    ],
    related: [
      ["Consultor ERP independiente", "/consultoria-erp-pymes/"],
      ["Conectar tus programas (n8n, Make, Zapier, Holded, A3)", "/integracion-sistemas/"],
      ["Plan mensual de operaciones e IA", "/plan-operaciones-ia/"],
    ],
    finalCta: "¿Tus técnicos vuelven a la oficina solo para hacer el presupuesto? Lo hacemos desde el sitio.",
    formService: "Presupuestos con IA conectada al ERP",
  },
  {
    slug: "web-empresa-sin-coste",
    title: "Web de empresa en formato funnel, hecha con IA y sin cuota mensual | Taller de Digitalización",
    description:
      "Sustituyo la web que pagas a una agencia cada mes por una web propia, estática y en formato funnel, hecha con IA, con SEO y sin hosting de pago. Desde 1.500 € + IVA.",
    eyebrow: "Caso práctico",
    h1: "¿Pagas cada mes por una web que nadie sabe si te trae clientes?",
    intro:
      "Muchas empresas pagan una cuota mensual a una agencia por «llevar» la web y el SEO, sin ninguna medición de lo que eso les devuelve. Se convierte en un gasto fijo que nadie cuestiona. Hay otra forma: una web propia, enfocada a captar contactos, que se mantiene con IA y no tiene cuota.",
    summary: "Cambiar la cuota mensual de la agencia por una web propia en formato funnel, hecha con IA, con SEO y sin hosting de pago.",
    practical: [
      "Una empresa pagaba 240 € al mes a una agencia externa que decía llevar el SEO y el mantenimiento de la web, y además pagaba el servidor. Sumaba más de 2.800 € al año, y nadie podía decir qué recibía a cambio: no había ninguna medición de retorno. Era, en la práctica, un impuesto.",
      "Lo que hicimos fue identificar ese gasto sin retorno y proponer otra web, pensada como un funnel: una serie de páginas de aterrizaje con lead magnets para captar contactos, con el contenido actualizado y con SEO y optimización para buscadores de IA. La hicimos con IA, para ir rápido, y es estática, así que no necesita un hosting de pago: se aloja en la infraestructura que ya gestiona la propia empresa. El gasto pasó de más de 2.800 € al año a 0 €; solo queda el dominio.",
      "Además, dejamos a la empresa skills, plantillas y formatos para que cualquiera pueda ampliar la web con ayuda de la IA, con un despliegue automático. Todo es de la empresa: no depende de nadie.",
    ],
    schemaService: "Web de empresa estática en formato funnel, creada con IA, con SEO y sin cuota mensual",
    painTitle: "¿Te pasa algo de esto?",
    pains: [
      "Pagas una cuota mensual por el «mantenimiento y SEO» de la web y no sabes qué recibes a cambio.",
      "Nadie mide cuántos contactos o clientes trae la web.",
      "Para cambiar un texto o añadir una página dependes de que la agencia tenga un hueco.",
      "Pagas un hosting y un panel de administración que casi nadie usa y que hay que mantener seguros.",
      "La web no es tuya del todo: no sabrías moverla a otro sitio si quisieras.",
    ],
    builtTitle: "Qué se monta",
    built: [
      ["Una web en formato funnel", "Una serie de páginas de aterrizaje, cada una con un objetivo claro y un formulario o un lead magnet para captar contactos."],
      ["Contenido actualizado y con SEO", "Textos pensados para lo que busca tu cliente, con SEO para Google y para los buscadores de IA (GEO)."],
      ["Hecha con IA, estática y sin cuota", "La IA acelera mucho el trabajo. Al ser estática no necesita base de datos ni panel de administración, y se aloja en tu infraestructura sin pagar hosting."],
      ["Despliegue automático y seguro", "Cada cambio se publica solo. Sin base de datos ni panel de administración, casi no hay nada que atacar."],
      ["Skills, plantillas y formatos", "Para que cualquiera de tu equipo pueda ampliar la web con ayuda de la IA, sin depender de mí ni de una agencia."],
    ],
    resultTitle: "Qué cambia",
    result: [
      "Se pasa de pagar más de 2.800 € al año por una web sin retorno medible a 0 €. El único gasto anual que queda es el dominio.",
      "La web es tuya de principio a fin: el código, el contenido y el despliegue. Puedes ampliarla con ayuda de la IA y no hay una cuota mensual esperándote.",
    ],
    offersTitle: "Cómo se puede empezar",
    offers: [
      {
        name: "Web de empresa en formato funnel, con IA",
        price: 1500,
        text: "Monto la web como una serie de páginas de aterrizaje con lead magnets, SEO y GEO, el despliegue automático y las skills y plantillas para ampliarla. El precio final depende de cuántas páginas y lead magnets haya; te lo doy cerrado tras ver tu web actual y lo que pagas hoy.",
      },
    ],
    planText: "Si quieres que alguien siga cuidando la web, mejorando el contenido y midiendo qué trae, el plan mensual de Operaciones e IA lo hace; es opcional.",
    planPrice: 99,
    needsTitle: "Qué necesito de tu lado",
    needs: [
      ["Lo que pagas hoy", "Qué cuesta la web, el hosting y el SEO, y qué te dice la agencia que hace por ese precio."],
      ["El acceso a tu dominio", "Para apuntarlo a la web nueva cuando esté lista."],
      ["Qué quieres que haga la web", "Qué contactos quieres captar y con qué oferta o recurso (la guía, el presupuesto, la llamada…)."],
      ["Un sitio donde alojarla", "Una cuenta o una infraestructura de tu empresa. Al ser estática, no hace falta un servidor de pago."],
    ],
    faq: [
      ["¿Cuánto cuesta?", "Desde 1.500 € + IVA, una sola vez. Depende de cuántas páginas y lead magnets haya. Tras ver tu web actual y lo que pagas, te doy el precio cerrado."],
      ["¿Y si necesito una tienda online o muchas funciones?", "Una web estática es ideal para captar contactos, pero no para todo. Una tienda online o un portal con usuarios son otro proyecto y se presupuestan aparte; lo vemos en la primera llamada."],
      ["¿Es segura?", "Al ser estática no tiene base de datos ni panel de administración que atacar, que es por donde entran la mayoría de los ataques a una web. Ningún sitio es invulnerable, pero la superficie de ataque es mínima."],
      ["¿Qué pasa con el posicionamiento que ya tengo?", "Se cuida: se conservan las direcciones que ya funcionan o se redirigen, y se mide antes y después. Nadie puede prometer una posición en Google, pero sí no perder lo que ya tienes."],
      ["¿Quién la mantiene después?", "Tú. Te dejo skills, plantillas y formatos para ampliar la web con ayuda de la IA y un despliegue automático. Si prefieres que lo haga otra persona, existe el plan mensual."],
      peopleFaq,
    ],
    related: [
      ["Creación de páginas web", "/diseno-web-toledo/"],
      ["Landing page para campañas", "/landing-page-campanas/"],
      ["Optimización de velocidad web", "/optimizacion-velocidad-web/"],
    ],
    finalCta: "¿Pagas una cuota por una web sin retorno? Hagamos las cuentas.",
    formService: "Web de empresa en formato funnel, con IA",
  },
  {
    slug: "cerebro-ia-empresa",
    title: "Un cerebro con IA para tu empresa: procesos documentados y respuestas para el equipo | Taller de Digitalización",
    description:
      "Documento los procesos de tu empresa y los conecto a una IA a la que todo el equipo puede preguntar, para que dejes de ser el cuello de botella. Desde 2.000 € + IVA.",
    eyebrow: "Caso práctico",
    h1: "¿Todo en tu empresa depende de que tú estés?",
    intro:
      "Si cada duda sobre un proceso, un cliente o el estado de un caso acaba en tu mesa, el equipo se frena cuando no estás y tú vives sobrepasado. La solución no es contratar a alguien que te conteste: es sacar lo que sabes de tu cabeza, ordenarlo y ponerlo a disposición de todos con una IA.",
    summary: "Documentar los procesos de la empresa y ponerlos en una IA a la que todo el equipo pueda preguntar, para que el dueño deje de ser el cuello de botella.",
    practical: [
      "El director de una empresa tenía un problema serio: todo pasaba por él y todo dependía de él. Las preguntas sobre cómo se hacía un proceso, sobre la información de la empresa o sobre el estado de un caso acababan en su mesa. Estaba estresado y sobrepasado, y mientras tanto la capacidad del resto del equipo no se estaba aprovechando.",
      "Lo que hicimos fue integrar la IA en la empresa: documentamos los procesos, conectamos las herramientas externas y montamos con ellas una base de conocimiento. Dimos acceso a todos los empleados, y las preguntas que antes iban al director empezaron a resolverse ahí: procesos, información de la empresa, estado de los casos.",
      "Lo más valioso para el director no fue la IA en sí. Fue que documentar obligó a poner por escrito cómo se hacía cada cosa, y eso dejó a la vista que muchos procesos no estaban formalizados. Al cerrar esos huecos no solo salió la documentación y el «cerebro»: la propia operativa se volvió más eficiente.",
    ],
    schemaService: "Documentación de procesos y base de conocimiento con IA para la empresa",
    painTitle: "¿Te pasa algo de esto?",
    pains: [
      "Todo el mundo te pregunta a ti cómo se hace algo, y si no estás, el trabajo se para.",
      "Los procesos están en tu cabeza o en la de una o dos personas, no por escrito.",
      "Para saber el estado de un caso hay que preguntar a alguien.",
      "Vives sobrepasado mientras el resto del equipo tiene capacidad sin usar.",
      "Sabes que deberías documentar los procesos, pero nunca hay tiempo y, si lo haces, queda en un documento que nadie abre.",
    ],
    builtTitle: "Qué se monta",
    built: [
      ["Los procesos, documentados", "Se sacan de tu cabeza y de la del equipo y se ponen por escrito, con un formato común."],
      ["Una base de conocimiento", "Un solo sitio estructurado con los procesos, la información de la empresa y el estado de los casos."],
      ["Las herramientas externas conectadas", "Las herramientas que ya usáis se conectan a la IA para que pueda responder con datos reales, como el estado de un caso."],
      ["Una IA a la que todos pueden preguntar", "Cada empleado tiene acceso y le pregunta en lenguaje normal, sin esperar a que tú contestes."],
      ["Los huecos, a la vista", "Al documentar salen los procesos que nadie había formalizado. Se cierran, y el proceso se vuelve más claro y eficiente."],
    ],
    resultTitle: "Qué cambia",
    result: [
      "Las preguntas sobre procesos, sobre la empresa o sobre el estado de los casos dejan de pasar por el director: se contestan solas. Se acaba el estrés de ser la única persona que lo sabe todo y el equipo trabaja sin esperar.",
      "En administración había tres personas y ahora hace falta una: las otras dos pasaron a ventas y atención al cliente.",
      "Además de la documentación y del «cerebro», se ganó algo que no se buscaba: al forzar a escribir los procesos, aparecieron los huecos y la empresa los cerró.",
    ],
    offersTitle: "Cómo se puede empezar",
    offers: [
      {
        name: "Cerebro con IA para tu empresa",
        price: 2000,
        text: "Documento tus procesos, monto la base de conocimiento, conecto las herramientas que ya usáis y dejo a la IA al servicio del equipo, con formación. El precio final depende de cuántos procesos y herramientas haya; te lo doy cerrado tras una primera llamada.",
      },
    ],
    planText: "Los procesos cambian y la documentación queda vieja si nadie la cuida. El plan mensual de Operaciones e IA la mantiene al día y corrige a la IA cuando se equivoca.",
    planPrice: 99,
    needsTitle: "Qué necesito de tu lado",
    needs: [
      ["Tiempo tuyo al principio", "Unas sesiones para contarme cómo funciona la empresa. Es lo que más cuesta, y lo que más valor tiene."],
      ["Las personas que hacen los procesos", "Quien ejecuta cada tarea sabe cosas que tú no. Hay que escucharles."],
      ["Las herramientas que usáis", "Qué programas hay y quién tiene acceso, para decidir qué se conecta."],
      ["Alguien que mantenga el cerebro", "Una persona que diga «esto ya no se hace así» cuando algo cambie."],
    ],
    faq: [
      ["¿Cuánto cuesta?", "Desde 2.000 € + IVA. Depende de cuántos procesos haya que documentar y de cuántas herramientas haya que conectar. Tras una primera llamada te doy el precio cerrado."],
      ["¿Y si la documentación sale incompleta?", "Es lo normal, y es parte del trabajo: al documentar aparecen procesos que nadie había formalizado. Se deciden con una persona de tu empresa, no los decide la IA."],
      ["¿Puede equivocarse la IA?", "Puede. Responde con lo que está documentado, así que depende de lo bien hecha que esté la documentación. Cuando no sabe, debe decirlo en lugar de inventar, y por eso hay una persona que mantiene la base."],
      ["¿Hace falta que todo el equipo lo use?", "No, pero funciona mejor si sí. Cuando todos le preguntan a la IA y no a ti, la dependencia del dueño se reduce de verdad."],
      ["¿Esto sustituye a personas?", "En el caso real, en administración había tres personas y ahora hace falta una; las otras dos pasaron a ventas y atención al cliente. Qué se hace con el tiempo que se libera es una decisión de cada empresa."],
      peopleFaq,
      privacyFaq,
    ],
    related: [
      ["Asistente de IA con los documentos de tu empresa", "/asistente-ia-empresa/"],
      ["Diagnóstico de caos operativo", "/diagnostico-caos-operativo/"],
      ["Plan mensual de operaciones e IA", "/plan-operaciones-ia/"],
    ],
    finalCta: "¿Todo pasa por ti? Saquémoslo de tu cabeza y pongámoslo al alcance del equipo.",
    formService: "Cerebro con IA para tu empresa",
  },
  {
    slug: "contabilidad-cuadrada-con-ia",
    title: "Cuadrar tu contabilidad con IA: facturas, banco y asesor, con trazabilidad | Taller de Digitalización",
    description:
      "Rehago tu contabilidad desde las fuentes y la cuadro con el banco mediante procesos de IA versionados y auditables, para que sepas cuánta precisión tiene la que te presentan. Desde 4.000 € + IVA.",
    eyebrow: "Caso práctico",
    h1: "¿Sabes si la contabilidad que te presentan es exacta?",
    intro:
      "Muchos directores reciben cada trimestre unos números que no pueden comprobar. No saben si están bien, y esa falta de control genera frustración. Hay una forma de comprobarlo: rehacer la contabilidad desde cero con IA, a partir de las fuentes y cuadrada con el banco, y compararla con la que te presentan.",
    summary: "Rehacer la contabilidad desde las fuentes, cuadrarla con el banco y compararla con la del asesor, con trazabilidad completa de cada paso.",
    practical: [
      "El director de una empresa quería saber qué precisión tenía la contabilidad que le presentaba su asesor. Se partió de la sospecha de que el asesor no trabajaba bien o no lo comunicaba bien, y esa falta de control le generaba frustración.",
      "Para saberlo había que rehacer la contabilidad desde cero, entendiendo el proceso contable y las particularidades de la empresa. Lo hicimos en tres pasos. Primero, la recolección de fuentes: un proceso asistido con IA para listar qué había que recoger (los distintos sistemas de facturación, los bancos, el sistema del asesor…), qué se había recogido y contrastarlo con lo que no miente, el banco. Segundo, el maestro contable: una serie de scripts creados por la IA, uno por cada tipo de documento, que ponen todo en el mismo formato y las mismas columnas, lo recortan al trimestre y cuadran el resultado. Y tercero, el cierre contable: con los asientos resueltos, un algoritmo determinista, también creado por IA, produce los documentos contables de la empresa.",
      "Todo queda registrado: qué script hizo qué, sobre qué fichero y cuándo. Hay trazabilidad y se puede auditar cada paso.",
    ],
    schemaService: "Reconstrucción y cuadre de la contabilidad con IA, con trazabilidad y auditoría",
    painTitle: "¿Te pasa algo de esto?",
    pains: [
      "Recibes la contabilidad cada trimestre y no tienes forma de comprobar si es exacta.",
      "Tus datos están repartidos en varios sistemas de facturación, bancos y el programa del asesor, y nadie los cruza.",
      "Sientes que no controlas tus propios números.",
      "Cuadrar el programa de gestión, la gestoría y el banco te lleva una semana de trabajo manual y nunca queda del todo seguro.",
      "Decides con números que llegan tarde y de los que no estás seguro.",
    ],
    builtTitle: "Qué se monta",
    built: [
      ["Recolección de fuentes", "Un listado de todo lo que hay que recoger (sistemas de facturación, bancos, el sistema del asesor…), lo ya recogido y lo que falta, contrastado con el banco."],
      ["Un maestro contable", "Un script por tipo de documento que normaliza los datos: mismo formato, mismas columnas, recortados a las fechas del trimestre, y que cuadra el resultado."],
      ["Algoritmos escritos por IA y versionados", "El cuadre no lo improvisa la IA cada vez: es un algoritmo que se escribe una vez, se versiona y siempre hace lo mismo."],
      ["Un registro de todo lo que ocurre", "Qué script se ejecutó, sobre qué fichero y cuándo. Trazabilidad y auditoría de todo el proceso."],
      ["El cierre contable", "Con los asientos resueltos, otro algoritmo determinista produce los documentos contables de la empresa."],
    ],
    resultTitle: "Qué cambia",
    result: [
      "Se pasa de una semana de cruzar datos a mano, de forma imprecisa y entre al menos tres sistemas y el banco, a una contabilidad completa y precisa en una hora, a partir de las fuentes.",
      "En el caso real, al cerrar los trimestres salieron: un error de 2 céntimos en una declaración, una factura de más de 650 € sin contabilizar, una deuda que se reclamaba pero estaba cobrada en parte y problemas en cómo entraban las facturas en los sistemas de la propia empresa.",
      "La sospecha inicial, que el asesor trabajaba mal, no se confirmó: los errores eran pequeños y varios estaban dentro de la propia empresa. Pero el director pasó a tener control total de sus números, una forma de auditar a su asesor cuando quiera y todos los datos para decidir mejor.",
    ],
    offersTitle: "Cómo se puede empezar",
    offers: [
      {
        name: "Contabilidad cuadrada con IA",
        price: 4000,
        text: "Recojo las fuentes, monto el maestro contable, cuadro un trimestre contra el banco y lo comparo con la contabilidad que te presentan, con el registro de todo el proceso. El precio final depende de cuántos sistemas, bancos y tipos de documento haya; te lo doy cerrado tras ver tus fuentes.",
      },
    ],
    planText: "Cada trimestre trae documentos nuevos y los sistemas cambian. El plan mensual de Operaciones e IA mantiene los scripts, repite el cierre y te avisa de lo que no cuadra.",
    planPrice: 99,
    needsTitle: "Qué necesito de tu lado",
    needs: [
      ["Acceso a tus fuentes", "Los sistemas de facturación, los extractos de los bancos y lo que te entrega el asesor, con los permisos que corresponda."],
      ["Un trimestre para empezar", "Se prueba con un trimestre ya cerrado, para poder comparar con lo que presentó el asesor."],
      ["Alguien que conozca la empresa", "Una persona que explique las particularidades de la contabilidad de tu empresa, que son las que más cuestan."],
      ["Un interlocutor para las diferencias", "Alguien que decida qué se corrige y dónde: en tu empresa, con el asesor o en ambos sitios."],
    ],
    faq: [
      ["¿Cuánto cuesta?", "Desde 4.000 € + IVA. Es un proyecto complejo y el precio depende de cuántos sistemas, bancos y tipos de documento haya. Tras ver tus fuentes te doy el precio cerrado."],
      ["¿Esto sustituye a mi asesor contable?", "Esa decisión es tuya. Lo que da el proceso es control sobre tus números y una forma de auditar la contabilidad que te presentan. La presentación de impuestos y las responsabilidades legales hay que revisarlas con tu asesor antes de cambiar nada; este proyecto no lo decide por ti."],
      ["¿Y si el asesor lo hace bien?", "Es posible y, en el caso real, así fue. Saberlo con datos también vale: dejas de dudar y de sospechar, y si hay diferencias, las ves y las hablas con números delante."],
      ["¿Puede equivocarse la IA con una cifra?", "El cuadre no lo decide la IA cada vez: lo hace un algoritmo determinista que da el mismo resultado con los mismos datos. Cada paso queda registrado y se contrasta con el banco, y las diferencias las revisa una persona."],
      ["¿Hace falta ser una empresa grande?", "No, pero sí tener varias fuentes de datos (facturación, bancos, el asesor) que hoy se cruzan a mano. Cuantas más fuentes, más valor."],
      peopleFaq,
      privacyFaq,
    ],
    related: [
      ["Auditoría de gastos de proveedores", "/casos/conciliacion-proveedores/"],
      ["Automatizar facturas de proveedores", "/casos/entrada-facturas-automatica/"],
      ["Plan mensual de operaciones e IA", "/plan-operaciones-ia/"],
    ],
    finalCta: "¿No sabes si tus números son exactos? Rehagámoslos y comprobémoslo.",
    formService: "Contabilidad cuadrada con IA",
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
  "/consultor-digitalizacion-toledo/": "contabilidad-cuadrada-con-ia",
  "/diagnostico-en-tu-empresa/": "entrada-facturas-automatica",
  "/ciberseguridad-empresas-toledo/": "conciliacion-proveedores",
  "/google-workspace-empresas-toledo/": "conciliacion-proveedores",
  "/diseno-web-toledo/": "web-empresa-sin-coste",
  // Páginas de producto
  "/caos-operativo-telecomunicaciones/": "cerebro-ia-empresa",
  "/gestor-contrasenas-empresas/": "conciliacion-proveedores",
  "/mantenimiento-wordpress/": "web-empresa-sin-coste",
  "/landing-page-campanas/": "web-empresa-sin-coste",
  "/consultoria-erp-pymes/": "presupuestos-desde-el-sitio",
  "/gestion-leads-crm/": "consulta-cobertura-ia",
  "/agente-ia-atencion-cliente/": "consulta-cobertura-ia",
  "/asistente-ia-empresa/": "cerebro-ia-empresa",
  "/plan-operaciones-ia/": "conciliacion-proveedores",
  // Servicios
  "/integracion-sistemas/": "presupuestos-desde-el-sitio",
  "/oraculo-interno/": "cerebro-ia-empresa",
  "/oraculo-externo/": "consulta-cobertura-ia",
  "/centralizacion-leads/": "consulta-cobertura-ia",
  "/gestion-centralizada-accesos/": "conciliacion-proveedores",
  "/reestructuracion-google-drive/": "dar-de-baja-software-historico",
  "/reorganizacion-google-workspace/": "conciliacion-proveedores",
  "/landing-pages-conversion/": "web-empresa-sin-coste",
  // Diagnósticos, web y soporte
  "/diagnostico-caos-operativo/": "cerebro-ia-empresa",
  "/diagnostico-digitalizacion/": "contabilidad-cuadrada-con-ia",
  "/informe-gratuito-web/": "consulta-cobertura-ia",
  "/optimizacion-velocidad-web/": "web-empresa-sin-coste",
  "/soporte-remoto/": "dar-de-baja-software-historico",
};

export const caseForPath = (path: string) => {
  const normalized = path === "/" ? "/" : `/${path.replace(/^\/+|\/+$/g, "")}/`;
  const slug = caseByPath[normalized];
  return casePages.find((page) => page.slug === slug);
};
