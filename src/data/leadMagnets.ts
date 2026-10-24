// Autoevaluaciones (lead magnets) de las páginas de servicio. Cada una tiene 5 preguntas, un puntaje de 0 a 100
// (100 = sin riesgo) y un informe con los riesgos detectados. Todo texto lleva su versión ES y EN en el mismo sitio.
// Qué página muestra qué autoevaluación: `quizByPath` al final del archivo.

export type Bi = { es: string; en: string };
const b = (es: string, en: string): Bi => ({ es, en });

export type QuizOption = { label: Bi; risk: 0 | 1 | 2 };

export type QuizQuestion = {
  q: Bi;
  // Qué riesgo implica contestar mal; se muestra en el informe.
  finding: Bi;
  // Pregunta formulada al revés: "Sí" es lo que supone riesgo.
  inverse?: boolean;
  // Opciones propias; por defecto Sí / A medias / No.
  options?: QuizOption[];
};

export type Quiz = {
  id: string;
  service: Bi;
  title: Bi;
  intro: Bi;
  questions: QuizQuestion[];
  // Texto del informe según el puntaje: alto = mucho riesgo.
  bands: { high: Bi; medium: Bi; low: Bi };
  actions: [Bi, Bi, Bi];
  // "risk" (por defecto) o "gap" cambian las etiquetas del nivel.
  labels?: "risk" | "gap";
};

export const levelLabels = {
  risk: {
    high: b("Riesgo alto", "High risk"),
    medium: b("Riesgo medio", "Medium risk"),
    low: b("Riesgo bajo", "Low risk"),
  },
  gap: {
    high: b("Mucho margen de mejora", "Big room for improvement"),
    medium: b("Margen de mejora", "Room for improvement"),
    low: b("Bien encaminado", "On the right track"),
  },
};

export const quizzes: Quiz[] = [
  {
    id: "passwords",
    service: b("Gestión de contraseñas", "Password management"),
    title: b("¿Qué tan expuestas están las contraseñas de tu empresa?", "How exposed are your company's passwords?"),
    intro: b(
      "Cinco preguntas, un minuto. Te decimos cuánto riesgo corres con la forma en que hoy se gestionan las contraseñas.",
      "Five questions, one minute. We tell you how much risk you run with the way passwords are handled today.",
    ),
    questions: [
      {
        q: b("¿Dónde viven hoy las contraseñas de la empresa?", "Where do your company's passwords live today?"),
        options: [
          { label: b("En un gestor de contraseñas", "In a password manager"), risk: 0 },
          { label: b("En el navegador de cada persona", "In each person's browser"), risk: 1 },
          { label: b("En un Word, un Excel, una nota o por WhatsApp", "In a Word file, a spreadsheet, a note or on WhatsApp"), risk: 2 },
        ],
        finding: b(
          "Si las contraseñas viven en un documento o en un chat, quien acceda a ese archivo o a ese móvil las tiene todas.",
          "If passwords live in a document or a chat, whoever gets that file or that phone has all of them.",
        ),
      },
      {
        q: b("¿Cada servicio tiene una contraseña distinta, larga y con mayúsculas, minúsculas y símbolos?", "Does every service have its own long password, with upper and lower case letters and symbols?"),
        finding: b(
          "Repetir contraseñas hace que una sola filtración abra el correo, el banco y los programas de la empresa.",
          "Reusing passwords means a single leak opens the email, the bank and the company's software.",
        ),
      },
      {
        q: b("¿Se cambian las contraseñas importantes al menos una vez al año, y cuando alguien se va?", "Are the important passwords changed at least once a year, and whenever someone leaves?"),
        finding: b(
          "Las contraseñas que nunca se cambian siguen valiendo para ex-empleados y para cualquiera que las haya visto alguna vez.",
          "Passwords that are never changed still work for former employees and for anyone who has ever seen them.",
        ),
      },
      {
        q: b("¿Tenéis la verificación en dos pasos activada en el correo y en las cuentas clave?", "Is two-step verification turned on for email and the key accounts?"),
        finding: b(
          "Sin verificación en dos pasos, una contraseña robada basta para entrar en el correo y, desde ahí, restablecer todo lo demás.",
          "Without two-step verification, a stolen password is enough to get into the email and, from there, reset everything else.",
        ),
      },
      {
        q: b("Cuando alguien se va, ¿sabéis a qué cuentas tenía acceso y se las quitáis ese mismo día?", "When someone leaves, do you know which accounts they had access to and remove them the same day?"),
        finding: b(
          "Sin un procedimiento de bajas, los ex-empleados pueden conservar acceso al correo, a carpetas o a programas durante meses.",
          "Without an offboarding procedure, former employees can keep access to email, folders or software for months.",
        ),
      },
    ],
    bands: {
      high: b(
        "Hoy un solo fallo puede dejar a la empresa sin correo, sin datos o sin dinero. Conviene ordenar esto cuanto antes.",
        "Today a single slip can leave the company without email, data or money. This is worth sorting out soon.",
      ),
      medium: b(
        "Tienes parte hecha, pero quedan huecos que un atacante, o un simple descuido, pueden aprovechar.",
        "Part of it is done, but gaps remain that an attacker, or a simple mistake, can exploit.",
      ),
      low: b(
        "Vas bien: lo básico está cubierto. Merece la pena revisarlo de vez en cuando para que siga así.",
        "You are doing well: the basics are covered. It is worth reviewing now and then to keep it that way.",
      ),
    },
    actions: [
      b("Centralizar todas las contraseñas en un gestor de contraseñas para empresas", "Move all passwords into a business password manager"),
      b("Activar la verificación en dos pasos en el correo y en las cuentas clave", "Turn on two-step verification for email and the key accounts"),
      b("Dejar por escrito el procedimiento de altas y bajas de personal", "Write down the joiners-and-leavers procedure"),
    ],
  },
  {
    id: "cyber",
    service: b("Ciberseguridad", "Cybersecurity"),
    title: b("¿Qué nivel de ciberseguridad tiene tu empresa?", "How secure is your business?"),
    intro: b(
      "Cinco preguntas para saber si un ataque o un descuido te pararía el negocio, y por dónde empezar a protegerte.",
      "Five questions to find out whether an attack or a mistake could stop your business, and where to start protecting it.",
    ),
    questions: [
      {
        q: b("¿Tenéis copias de seguridad automáticas y habéis comprobado alguna vez que se pueden restaurar?", "Do you have automatic backups, and have you ever checked that they can be restored?"),
        finding: b(
          "Una copia que nadie ha probado puede no servir el día que hace falta. Con un ransomware, es lo único que separa un mal día de perderlo todo.",
          "A backup nobody has tested may not work the day you need it. With ransomware, it is all that separates a bad day from losing everything.",
        ),
      },
      {
        q: b("¿Todos los ordenadores tienen antivirus y las actualizaciones al día?", "Do all computers have antivirus and up-to-date software?"),
        finding: b(
          "Los equipos sin actualizar tienen fallos conocidos que los atacantes explotan de forma automática.",
          "Computers that are not updated have known flaws that attackers exploit automatically.",
        ),
      },
      {
        q: b("¿Sabe tu equipo reconocer un correo de phishing y qué hacer si pulsa en uno?", "Does your team know how to spot a phishing email and what to do if they click one?"),
        finding: b(
          "La mayoría de ataques empiezan con un correo falso que alguien abre. Sin formación, depende del azar.",
          "Most attacks start with a fake email that someone opens. Without training, it comes down to chance.",
        ),
      },
      {
        q: b("¿Está activada la verificación en dos pasos en el correo y en las cuentas importantes?", "Is two-step verification turned on for email and the important accounts?"),
        finding: b(
          "Sin ella, una contraseña filtrada basta para entrar en el correo de la empresa.",
          "Without it, a leaked password is enough to get into the company's email.",
        ),
      },
      {
        q: b("Si mañana sufrierais un ataque, ¿sabéis a quién llamar y qué hacer en las primeras horas?", "If you were attacked tomorrow, would you know who to call and what to do in the first hours?"),
        finding: b(
          "Sin un plan, las primeras horas se pierden improvisando, justo cuando más daño se puede evitar.",
          "Without a plan, the first hours are lost improvising, right when the most damage can be avoided.",
        ),
      },
    ],
    bands: {
      high: b(
        "Un ataque o un fallo grave te pararía el negocio y no tendrías cómo recuperarte con rapidez. Hay medidas baratas que reducen mucho ese riesgo.",
        "An attack or a serious failure would stop your business and you would not recover quickly. There are cheap measures that cut that risk a lot.",
      ),
      medium: b(
        "Tienes defensas básicas, pero con huecos importantes. Cerrarlos es más barato que recuperarse de un incidente.",
        "You have basic defences, but with important gaps. Closing them costs less than recovering from an incident.",
      ),
      low: b(
        "Tu seguridad está bien encaminada. Lo siguiente es documentarla y revisarla con regularidad.",
        "Your security is in good shape. The next step is to document it and review it regularly.",
      ),
    },
    actions: [
      b("Revisar las copias de seguridad y probar una restauración real", "Review the backups and test a real restore"),
      b("Activar la verificación en dos pasos y actualizar todos los equipos", "Turn on two-step verification and update every device"),
      b("Preparar un plan de respuesta y formar al equipo contra el phishing", "Prepare a response plan and train the team against phishing"),
    ],
  },
  {
    id: "itdown",
    service: b("Mantenimiento informático", "Managed IT"),
    title: b("¿Qué pasaría si mañana se cae tu informática?", "What happens if your IT goes down tomorrow?"),
    intro: b(
      "Cinco preguntas para ver cuánto aguantaría tu empresa un fallo de equipos, de red o de datos.",
      "Five questions to see how well your company would hold up to a failure of equipment, network or data.",
    ),
    questions: [
      {
        q: b("¿Hay copias de seguridad automáticas y se ha comprobado que se pueden restaurar?", "Are there automatic backups, and has restoring from them been tested?"),
        finding: b(
          "Si el disco o el servidor fallan y la copia no funciona, se pierde el trabajo de meses o años.",
          "If the disk or the server fails and the backup does not work, months or years of work are lost.",
        ),
      },
      {
        q: b("¿Alguien se ocupa de revisar y actualizar los equipos, el antivirus y la red con regularidad?", "Does someone regularly review and update the computers, the antivirus and the network?"),
        finding: b(
          "Sin revisiones periódicas los problemas se acumulan y estallan en el peor momento.",
          "Without regular check-ups, problems pile up and blow up at the worst moment.",
        ),
      },
      {
        q: b("¿Sabéis qué equipos, licencias y accesos tiene la empresa y quién usa cada uno?", "Do you know which devices, licenses and accounts the company has and who uses each one?"),
        finding: b(
          "Sin inventario, se pagan licencias que nadie usa y se pasan por alto equipos viejos o accesos de personas que ya no están.",
          "Without an inventory, you pay for licenses nobody uses and miss old devices or access of people who have left.",
        ),
      },
      {
        q: b("Cuando algo falla, ¿hay alguien que responde el mismo día?", "When something fails, is there someone who responds the same day?"),
        finding: b(
          "Cada hora de espera es una hora de equipo parado y de clientes sin respuesta.",
          "Every hour of waiting is an hour of idle staff and unanswered customers.",
        ),
      },
      {
        q: b("Si el equipo principal se estropeara hoy, ¿podríais volver a trabajar en menos de un día?", "If your main computer broke today, could you be working again in under a day?"),
        finding: b(
          "Sin un plan de recuperación, un equipo averiado puede significar días sin facturar.",
          "Without a recovery plan, a broken computer can mean days without invoicing.",
        ),
      },
    ],
    bands: {
      high: b(
        "Un fallo serio te dejaría parado varios días y con riesgo de perder datos. Lo bueno es que se previene con revisiones sencillas y regulares.",
        "A serious failure would leave you stopped for days with a risk of losing data. The good news is that simple, regular checks prevent it.",
      ),
      medium: b(
        "Aguantarías un fallo pequeño, pero uno grave te costaría caro. Hay huecos fáciles de cerrar.",
        "You would survive a small failure, but a serious one would cost you dearly. The gaps are easy to close.",
      ),
      low: b(
        "Tu informática está bastante controlada. Mantenerla así es cuestión de revisiones periódicas.",
        "Your IT is fairly well under control. Keeping it that way is a matter of regular check-ups.",
      ),
    },
    actions: [
      b("Comprobar las copias de seguridad con una restauración de prueba", "Verify the backups with a test restore"),
      b("Hacer un inventario de equipos, licencias y accesos", "Take an inventory of devices, licenses and access"),
      b("Contratar un mantenimiento regular con soporte incluido", "Set up regular maintenance with support included"),
    ],
  },
  {
    id: "workspace",
    service: b("Google Workspace", "Google Workspace"),
    title: b("¿Estás aprovechando (o regalando) tu Google Workspace?", "Are you using (or wasting) your Google Workspace?"),
    intro: b(
      "Cinco preguntas para ver si tu correo, tus carpetas y tus licencias están bajo control o se te escapan.",
      "Five questions to see whether your email, folders and licenses are under control or slipping away.",
    ),
    questions: [
      {
        q: b("¿Todo el equipo trabaja con cuentas de la empresa, no con correos personales?", "Does the whole team work with company accounts rather than personal emails?"),
        finding: b(
          "Con cuentas personales, los datos de la empresa quedan fuera de tu control y se van con quien se va.",
          "With personal accounts, company data is outside your control and leaves with whoever leaves.",
        ),
      },
      {
        q: b("Cuando alguien se va, ¿se cierra su cuenta y se traspasa su información el mismo día?", "When someone leaves, is their account closed and their data handed over the same day?"),
        finding: b(
          "Las cuentas de ex-empleados abiertas son una puerta abierta al correo y a los documentos de la empresa.",
          "Open accounts of former employees are an open door to the company's email and documents.",
        ),
      },
      {
        q: b("¿Las carpetas compartidas están organizadas por equipos, con permisos claros?", "Are shared folders organized by team, with clear permissions?"),
        finding: b(
          "Sin estructura ni permisos, cada cual guarda donde quiere y cualquiera puede ver o borrar lo que no debe.",
          "Without structure or permissions, everyone saves wherever they like and anyone can see or delete what they should not.",
        ),
      },
      {
        q: b("¿Está activada la verificación en dos pasos para todos los usuarios?", "Is two-step verification turned on for all users?"),
        finding: b(
          "Sin ella, una contraseña robada basta para entrar en el correo y en todos los archivos.",
          "Without it, a stolen password is enough to get into the email and all the files.",
        ),
      },
      {
        q: b("¿Sabes cuántas licencias pagas y cuántas se usan de verdad?", "Do you know how many licenses you pay for and how many are actually used?"),
        finding: b(
          "Es habitual pagar licencias que nadie usa, o no aprovechar funciones que ya están incluidas.",
          "It is common to pay for licenses nobody uses, or to miss features that are already included.",
        ),
      },
    ],
    bands: {
      high: b(
        "Tus datos y tu dinero se escapan por varios sitios: cuentas sin control, permisos sin orden y licencias sin revisar.",
        "Your data and your money are slipping away in several places: uncontrolled accounts, messy permissions and unreviewed licenses.",
      ),
      medium: b(
        "Lo básico funciona, pero hay cuentas, permisos o licencias que merece la pena ordenar.",
        "The basics work, but there are accounts, permissions or licenses worth tidying up.",
      ),
      low: b(
        "Tu Workspace está bastante ordenado. Una revisión al año te ayuda a mantenerlo así.",
        "Your Workspace is fairly well organized. A yearly review helps you keep it that way.",
      ),
    },
    actions: [
      b("Pasar todo el equipo a cuentas de empresa y cerrar las de ex-empleados", "Move the whole team to company accounts and close former employees' accounts"),
      b("Reorganizar carpetas y permisos por equipos", "Reorganize folders and permissions by team"),
      b("Revisar licencias y activar la verificación en dos pasos", "Review licenses and turn on two-step verification"),
    ],
  },
  {
    id: "wordpress",
    service: b("Mantenimiento web", "Website maintenance"),
    title: b("¿Tu web es una puerta abierta?", "Is your website an open door?"),
    intro: b(
      "Cinco preguntas para saber si tu web aguantaría un ataque, un fallo o una actualización mal hecha.",
      "Five questions to find out whether your website could survive an attack, a failure or a bad update.",
    ),
    questions: [
      {
        q: b("¿Se actualizan WordPress, el tema y los plugins con regularidad?", "Are WordPress, the theme and the plugins updated regularly?"),
        finding: b(
          "Los plugins sin actualizar son la vía de entrada más habitual de los hackeos a webs WordPress.",
          "Outdated plugins are the most common way into hacked WordPress sites.",
        ),
      },
      {
        q: b("¿Hay copias de seguridad automáticas de la web y se han probado?", "Are there automatic backups of the site, and have they been tested?"),
        finding: b(
          "Sin una copia que funcione, una web hackeada o rota puede tardar días en volver, o no volver.",
          "Without a working backup, a hacked or broken site can take days to come back, or never return.",
        ),
      },
      {
        q: b("¿Alguien vigila que la web esté funcionando y te avisa si se cae?", "Does someone watch that the site is up and warn you if it goes down?"),
        finding: b(
          "Una web caída sin que nadie lo sepa son clientes que se van a otro sitio durante horas o días.",
          "A site that is down without anyone knowing sends customers elsewhere for hours or days.",
        ),
      },
      {
        q: b("¿La web carga rápido en el móvil?", "Does the site load fast on mobile?"),
        finding: b(
          "Una web lenta pierde visitas y Google la coloca peor.",
          "A slow site loses visitors and ranks worse on Google.",
        ),
      },
      {
        q: b("¿Sabes quién tiene acceso de administrador y has quitado a antiguos proveedores?", "Do you know who has admin access, and have you removed former providers?"),
        finding: b(
          "Cuentas de administrador olvidadas de antiguos proveedores son un riesgo de seguridad.",
          "Forgotten admin accounts of former providers are a security risk.",
        ),
      },
    ],
    bands: {
      high: b(
        "Tu web está expuesta: un hackeo o un fallo puede tumbarla y no tendrías cómo recuperarla rápido.",
        "Your site is exposed: a hack or a failure could take it down and you would not be able to restore it quickly.",
      ),
      medium: b(
        "La web aguanta el día a día, pero tiene huecos de seguridad o de copias que conviene cerrar.",
        "The site holds up day to day, but it has security or backup gaps worth closing.",
      ),
      low: b(
        "Tu web está bien cuidada. Mantén las revisiones al día para que siga así.",
        "Your site is well looked after. Keep the checks up to date so it stays that way.",
      ),
    },
    actions: [
      b("Actualizar WordPress y plugins con copia previa y comprobación", "Update WordPress and plugins with a prior backup and checks"),
      b("Poner copias automáticas y vigilancia de caídas", "Set up automatic backups and uptime monitoring"),
      b("Revisar accesos de administrador y la velocidad en móvil", "Review admin access and mobile speed"),
    ],
  },
  {
    id: "remote",
    service: b("Soporte informático remoto", "Remote IT support"),
    title: b("¿Cuánto tiempo y dinero pierdes con los problemas informáticos?", "How much time and money do computer problems cost you?"),
    intro: b(
      "Cinco preguntas para ver cuánto le cuesta a tu empresa la informática que falla y quién la atiende.",
      "Five questions to see what failing IT costs your company and who looks after it.",
    ),
    labels: "gap",
    questions: [
      {
        q: b("¿Alguien del equipo pierde más de una hora a la semana con problemas de ordenador, correo o impresora?", "Does anyone on the team lose more than an hour a week to computer, email or printer problems?"),
        inverse: true,
        finding: b(
          "Una hora a la semana por persona son más de 50 horas al año de trabajo parado.",
          "One hour a week per person is over 50 hours a year of lost work.",
        ),
      },
      {
        q: b("¿Dependéis de un conocido o familiar que ayuda cuando puede?", "Do you depend on an acquaintance or relative who helps when they can?"),
        inverse: true,
        finding: b(
          "Depender de un favor significa que, el día que falla algo grave, nadie tiene la obligación de responder.",
          "Relying on a favour means that, the day something serious fails, nobody is obliged to respond.",
        ),
      },
      {
        q: b("Cuando algo falla, ¿tardáis más de un día en resolverlo?", "When something fails, does it take more than a day to fix?"),
        inverse: true,
        finding: b(
          "Cada día de espera es producción y atención al cliente perdidas.",
          "Every day of waiting is lost work and lost customer service.",
        ),
      },
      {
        q: b("¿Pueden ayudaros a distancia, sin ir a la oficina, de forma segura?", "Can someone help you remotely, without coming to the office, securely?"),
        finding: b(
          "Si hace falta que alguien vaya en persona, un problema sencillo se convierte en horas o días de espera.",
          "If someone has to come in person, a simple problem turns into hours or days of waiting.",
        ),
      },
      {
        q: b("¿Sabes qué equipos y programas usa cada persona?", "Do you know which computers and programs each person uses?"),
        finding: b(
          "Sin ese mapa, cada incidencia empieza de cero y cuesta más resolverla.",
          "Without that map, every incident starts from scratch and takes longer to solve.",
        ),
      },
    ],
    bands: {
      high: b(
        "La informática te está costando mucho tiempo y dinero sin que lo veas en ninguna factura. Un soporte con respuesta rápida lo recupera.",
        "IT is costing you a lot of time and money that you never see on an invoice. Support with a fast response gets it back.",
      ),
      medium: b(
        "Vas apañando, pero hay horas perdidas que se pueden recuperar con soporte fiable.",
        "You are getting by, but there are lost hours you can win back with reliable support.",
      ),
      low: b(
        "Tu informática está bien atendida. Asegúrate de que sigue así cuando crezcas.",
        "Your IT is well looked after. Make sure it stays that way as you grow.",
      ),
    },
    actions: [
      b("Contar con soporte remoto con respuesta el mismo día", "Have remote support with same-day response"),
      b("Hacer un inventario de equipos y programas", "Take an inventory of computers and programs"),
      b("Dejar documentadas las incidencias que se repiten", "Document the incidents that keep coming back"),
    ],
  },
  {
    id: "integration",
    service: b("Integración de sistemas", "Systems integration"),
    title: b("¿Cuánto te cuesta copiar datos a mano entre programas?", "How much does copying data by hand between tools cost you?"),
    intro: b(
      "Cinco preguntas para medir cuánto trabajo y cuántos errores se esconden en el paso de datos de un programa a otro.",
      "Five questions to measure how much work and how many errors hide in moving data from one program to another.",
    ),
    labels: "gap",
    questions: [
      {
        q: b("¿Alguien copia datos a mano entre programas (CRM, facturación, hojas de cálculo) cada semana?", "Does someone copy data by hand between programs (CRM, invoicing, spreadsheets) every week?"),
        inverse: true,
        finding: b(
          "Copiar a mano consume horas y es la mayor fuente de errores en los datos.",
          "Copying by hand eats hours and is the biggest source of data errors.",
        ),
      },
      {
        q: b("¿Los datos de un mismo cliente están en varios sitios y no siempre coinciden?", "Is the same customer's data in several places, and do they not always match?"),
        inverse: true,
        finding: b(
          "Con datos duplicados nadie sabe cuál es el bueno y se acaba decidiendo con cifras equivocadas.",
          "With duplicated data nobody knows which version is right, and decisions end up based on wrong figures.",
        ),
      },
      {
        q: b("¿Los informes se preparan a mano juntando datos de varios programas?", "Are reports put together by hand from several programs?"),
        inverse: true,
        finding: b(
          "Los informes manuales llegan tarde y no se repiten igual dos veces.",
          "Manual reports arrive late and never come out the same way twice.",
        ),
      },
      {
        q: b("Cuando entra un cliente o un pedido, ¿llega solo al CRM, al ERP o a facturación?", "When a customer or an order comes in, does it reach the CRM, ERP or invoicing on its own?"),
        finding: b(
          "Sin conexión automática, cada alta depende de que alguien se acuerde de introducirla.",
          "Without an automatic link, every new record depends on someone remembering to enter it.",
        ),
      },
      {
        q: b("¿Se han producido errores o retrasos por haber retocado un dato en un sitio y no en otro?", "Have errors or delays happened because a figure was changed in one place and not another?"),
        inverse: true,
        finding: b(
          "Cada error de este tipo se paga en tiempo, en dinero o en confianza del cliente.",
          "Every error of this kind is paid for in time, money or customer trust.",
        ),
      },
    ],
    bands: {
      high: b(
        "Mucho de tu trabajo administrativo es mover datos a mano. Conectar los programas te devolvería horas cada semana y quitaría errores.",
        "A lot of your administrative work is moving data by hand. Connecting your programs would give you back hours every week and remove errors.",
      ),
      medium: b(
        "Parte del flujo ya funciona, pero quedan pasos manuales que se pueden conectar.",
        "Part of the flow already works, but manual steps remain that can be connected.",
      ),
      low: b(
        "Tus programas se hablan bien entre sí. Revisa de vez en cuando que nada vuelva a hacerse a mano.",
        "Your programs talk to each other well. Check now and then that nothing goes back to being done by hand.",
      ),
    },
    actions: [
      b("Conectar el CRM, el ERP y la facturación para que los datos pasen solos", "Connect the CRM, ERP and invoicing so data moves on its own"),
      b("Elegir una única fuente de verdad para los datos de clientes", "Choose a single source of truth for customer data"),
      b("Automatizar los informes que hoy se hacen a mano", "Automate the reports that are built by hand today"),
    ],
  },
  {
    id: "tools",
    service: b("Herramientas internas a medida", "Custom internal tools"),
    title: b("¿Tu operación depende de un Excel y de una sola persona?", "Does your operation depend on one spreadsheet and one person?"),
    intro: b(
      "Cinco preguntas para ver qué pasaría si ese archivo o esa persona faltaran una semana.",
      "Five questions to see what would happen if that file or that person were gone for a week.",
    ),
    questions: [
      {
        q: b("¿Hay algún proceso clave de la empresa que vive en una hoja de cálculo?", "Is there a key company process that lives in a spreadsheet?"),
        inverse: true,
        finding: b(
          "Una hoja de cálculo como sistema central se rompe, se duplica y se queda desfasada sin que nadie se dé cuenta.",
          "A spreadsheet used as the core system breaks, gets duplicated and goes stale without anyone noticing.",
        ),
      },
      {
        q: b("¿Solo una persona sabe cómo funciona o cómo se actualiza?", "Does only one person know how it works or how it is updated?"),
        inverse: true,
        finding: b(
          "Si esa persona falta, se va o se equivoca, el proceso se detiene.",
          "If that person is out, leaves or makes a mistake, the process stops.",
        ),
      },
      {
        q: b("¿Se ha perdido o estropeado alguna vez un archivo importante?", "Has an important file ever been lost or corrupted?"),
        inverse: true,
        finding: b(
          "Lo que ya ha pasado una vez volverá a pasar, y con más datos cada vez.",
          "What has happened once will happen again, with more data each time.",
        ),
      },
      {
        q: b("¿Hay copia automática y control de quién puede editarlo?", "Is there an automatic backup and control over who can edit it?"),
        finding: b(
          "Sin copias ni permisos, cualquier error puede ser irreversible.",
          "Without backups or permissions, any mistake can be irreversible.",
        ),
      },
      {
        q: b("¿Los mismos datos se introducen más de una vez en sitios distintos?", "Is the same data entered more than once in different places?"),
        inverse: true,
        finding: b(
          "Introducir datos varias veces multiplica el tiempo y los errores.",
          "Entering data several times multiplies both time and errors.",
        ),
      },
    ],
    bands: {
      high: b(
        "Tu operación cuelga de un hilo: un archivo y una persona. Una herramienta hecha a la medida de tu forma de trabajar quita ese riesgo.",
        "Your operation hangs by a thread: one file and one person. A tool built around the way you work removes that risk.",
      ),
      medium: b(
        "Hay dependencias que conviene eliminar antes de que fallen.",
        "There are dependencies worth removing before they fail.",
      ),
      low: b(
        "Tu operación no depende de un punto único. Mantén la documentación al día.",
        "Your operation does not depend on a single point. Keep the documentation up to date.",
      ),
    },
    actions: [
      b("Sustituir la hoja de cálculo por un panel o portal a medida", "Replace the spreadsheet with a custom dashboard or portal"),
      b("Documentar el proceso para que no dependa de una persona", "Document the process so it does not depend on one person"),
      b("Poner copias automáticas y permisos por rol", "Set up automatic backups and role-based permissions"),
    ],
  },
  {
    id: "knowledge",
    service: b("Asistente de IA con el conocimiento de la empresa", "AI assistant with company knowledge"),
    title: b("¿Cuánto conocimiento se va de tu empresa si se va una persona?", "How much company knowledge leaves if one person leaves?"),
    intro: b(
      "Cinco preguntas para ver si lo que sabe tu equipo está escrito, o solo vive en la cabeza de unos pocos.",
      "Five questions to see whether what your team knows is written down, or only lives in a few heads.",
    ),
    questions: [
      {
        q: b("¿Los procedimientos están por escrito y se encuentran en menos de un minuto?", "Are procedures written down and findable in under a minute?"),
        finding: b(
          "Si encontrar un procedimiento lleva tiempo, la gente prefiere preguntar y se interrumpe a quien sabe.",
          "If finding a procedure takes time, people ask instead and interrupt whoever knows.",
        ),
      },
      {
        q: b("Si la persona clave faltara una semana, ¿el equipo seguiría funcionando?", "If the key person were out for a week, would the team keep working?"),
        finding: b(
          "Cuando todo depende de una persona, una baja o unas vacaciones se convierten en crisis.",
          "When everything depends on one person, sick leave or a holiday becomes a crisis.",
        ),
      },
      {
        q: b("¿El dueño o la dirección responden cada semana las mismas dudas del equipo?", "Do the owner or management answer the same team questions every week?"),
        inverse: true,
        finding: b(
          "Responder lo mismo una y otra vez quita tiempo a lo que solo la dirección puede hacer.",
          "Answering the same thing over and over takes time away from what only management can do.",
        ),
      },
      {
        q: b("¿Una persona nueva puede aprender el trabajo sin depender de que alguien se lo explique todo?", "Can a new person learn the job without depending on someone explaining everything?"),
        finding: b(
          "Sin material accesible, incorporar a alguien cuesta semanas de tiempo de otros.",
          "Without accessible material, onboarding someone costs weeks of other people's time.",
        ),
      },
      {
        q: b("¿La información está repartida entre correos, chats y archivos sueltos?", "Is information scattered across emails, chats and loose files?"),
        inverse: true,
        finding: b(
          "La información dispersa se pierde, se desactualiza y nadie se fía de ella.",
          "Scattered information gets lost, goes stale and nobody trusts it.",
        ),
      },
    ],
    bands: {
      high: b(
        "Tu empresa sabe mucho, pero ese saber está en pocas personas. Un asistente que conozca tu documentación lo pone al alcance de todos.",
        "Your company knows a lot, but that knowledge sits with a few people. An assistant that knows your documentation puts it within everyone's reach.",
      ),
      medium: b(
        "Parte del conocimiento está escrito, pero aún depende demasiado de preguntar a las mismas personas.",
        "Part of the knowledge is written down, but it still depends too much on asking the same people.",
      ),
      low: b(
        "Tu conocimiento está bastante bien repartido. Un asistente puede hacerlo todavía más fácil de consultar.",
        "Your knowledge is fairly well shared. An assistant can make it even easier to consult.",
      ),
    },
    actions: [
      b("Reunir los procedimientos en un único sitio", "Gather the procedures in a single place"),
      b("Conectar un asistente de IA a esa documentación para que el equipo le pregunte", "Connect an AI assistant to that documentation so the team can ask it"),
      b("Documentar lo que solo sabe una persona", "Document what only one person knows"),
    ],
  },
  {
    id: "response",
    service: b("Agente de IA de atención al cliente", "AI agent for customer support"),
    title: b("¿Cuántos clientes pierdes por responder tarde?", "How many customers do you lose by answering late?"),
    intro: b(
      "Cinco preguntas para saber si tus clientes y tus contactos reciben respuesta cuando la necesitan.",
      "Five questions to find out whether your customers and leads get an answer when they need it.",
    ),
    labels: "gap",
    questions: [
      {
        q: b("¿Respondéis a clientes y contactos en menos de una hora en horario laboral?", "Do you reply to customers and leads in under an hour during working hours?"),
        finding: b(
          "Quien no recibe respuesta rápida suele escribir a la competencia.",
          "Whoever does not get a quick reply usually writes to a competitor.",
        ),
      },
      {
        q: b("¿Y fuera de horario, por la noche y los fines de semana?", "And outside working hours, at night and on weekends?"),
        finding: b(
          "Una parte de las consultas llega cuando no hay nadie, y se enfría hasta la mañana siguiente.",
          "Part of the enquiries arrive when nobody is there, and go cold until the next morning.",
        ),
      },
      {
        q: b("¿Las mismas preguntas se repiten a diario?", "Do the same questions come up every day?"),
        inverse: true,
        finding: b(
          "Responder lo mismo a mano consume horas que un asistente podría ahorrar.",
          "Answering the same thing by hand eats hours an assistant could save.",
        ),
      },
      {
        q: b("¿Alguna vez una consulta se ha quedado sin responder por falta de tiempo?", "Has an enquiry ever gone unanswered for lack of time?"),
        inverse: true,
        finding: b(
          "Cada consulta sin respuesta es un cliente posible que no vuelve.",
          "Every unanswered enquiry is a potential customer who does not come back.",
        ),
      },
      {
        q: b("¿Sabes cuántos contactos se pierden o tardan en recibir respuesta?", "Do you know how many contacts are lost or wait for a reply?"),
        finding: b(
          "Lo que no se mide no se puede mejorar: sin ese dato no sabes cuánto te cuesta.",
          "What is not measured cannot be improved: without that figure you do not know what it costs you.",
        ),
      },
    ],
    bands: {
      high: b(
        "Estás dejando escapar clientes por no responder a tiempo. Un agente que atienda a la primera, con paso a una persona cuando haga falta, lo cambia.",
        "You are letting customers slip away by not replying in time. An agent that answers first, handing over to a person when needed, changes that.",
      ),
      medium: b(
        "Respondes bien en horario, pero hay huecos y repeticiones que un agente puede cubrir.",
        "You reply well during working hours, but there are gaps and repetition an agent can cover.",
      ),
      low: b(
        "Tu atención está bien cubierta. Un agente puede aliviar la carga cuando crezca el volumen.",
        "Your customer service is well covered. An agent can ease the load as volume grows.",
      ),
    },
    actions: [
      b("Poner un agente que responda las preguntas frecuentes al instante", "Set up an agent that answers frequent questions instantly"),
      b("Pasar a una persona los casos que lo necesiten", "Hand over to a person the cases that need it"),
      b("Medir cuántos contactos entran y cuánto tardan en recibir respuesta", "Measure how many contacts come in and how long they wait for a reply"),
    ],
  },
  {
    id: "funnel",
    service: b("Landing pages para campañas", "Landing pages for campaigns"),
    title: b("¿Tu web vende, o solo está ahí?", "Does your website sell, or does it just sit there?"),
    intro: b(
      "Cinco preguntas para saber si tu web convierte visitas en contactos y si sabes de dónde vienen.",
      "Five questions to find out whether your website turns visits into leads and whether you know where they come from.",
    ),
    labels: "gap",
    questions: [
      {
        q: b("¿Tu página tiene un único objetivo claro y una llamada a la acción visible?", "Does your page have one clear goal and a visible call to action?"),
        finding: b(
          "Una página con muchos mensajes confunde, y quien duda no contacta.",
          "A page with many messages confuses people, and whoever hesitates does not get in touch.",
        ),
      },
      {
        q: b("¿Sabes cuántas visitas se convierten en contacto?", "Do you know how many visits turn into a lead?"),
        finding: b(
          "Sin ese número no sabes si la web funciona ni qué cambiar.",
          "Without that number you do not know whether the site works or what to change.",
        ),
      },
      {
        q: b("¿Cada campaña de publicidad lleva a una página propia, en lugar de a la portada?", "Does every ad campaign lead to its own page rather than the homepage?"),
        finding: b(
          "Enviar tráfico de pago a la portada suele bajar las conversiones y encarecer cada contacto.",
          "Sending paid traffic to the homepage usually lowers conversions and makes each lead more expensive.",
        ),
      },
      {
        q: b("¿Quien deja sus datos recibe un seguimiento automático?", "Does anyone who leaves their details get an automatic follow-up?"),
        finding: b(
          "Un contacto que no recibe seguimiento rápido se enfría y acaba comprando a otro.",
          "A lead that does not get a quick follow-up goes cold and ends up buying from someone else.",
        ),
      },
      {
        q: b("¿Sabes de qué anuncio, enlace o canal viene cada contacto?", "Do you know which ad, link or channel each lead came from?"),
        finding: b(
          "Sin medir el origen, gastas en publicidad sin saber cuál funciona.",
          "Without tracking the source, you spend on ads without knowing which one works.",
        ),
      },
    ],
    bands: {
      high: b(
        "Tu web probablemente pierde la mayoría de las visitas por el camino y no tienes datos para saber dónde. Una página pensada para convertir y medir cambia eso.",
        "Your site is probably losing most visits along the way and you have no data on where. A page built to convert and measure changes that.",
      ),
      medium: b(
        "Tienes parte del recorrido, pero faltan medición o seguimiento para mejorar con datos.",
        "You have part of the journey, but measurement or follow-up is missing to improve with data.",
      ),
      low: b(
        "Tu web ya funciona como embudo. Lo siguiente es iterar con los datos para convertir aún más.",
        "Your site already works as a sales page. The next step is to iterate with the data to convert even more.",
      ),
    },
    actions: [
      b("Crear una landing con un único objetivo y medir cada paso", "Build a landing page with one goal and measure every step"),
      b("Conectar los eventos con Google Analytics, Google Ads y Meta", "Connect the events to Google Analytics, Google Ads and Meta"),
      b("Automatizar el seguimiento de cada contacto hasta tu CRM", "Automate follow-up of every lead through to your CRM"),
    ],
  },
  {
    id: "digital",
    service: b("Diagnóstico de digitalización", "Digitalization assessment"),
    title: b("¿Qué tan digitalizada está tu empresa?", "How digitalized is your company?"),
    intro: b(
      "Cinco preguntas rápidas para ver dónde se te va el tiempo y por dónde empezar a digitalizar.",
      "Five quick questions to see where your time goes and where to start digitalizing.",
    ),
    labels: "gap",
    questions: [
      {
        q: b("¿Los procesos clave están documentados y los conoce todo el equipo?", "Are the key processes documented and known to the whole team?"),
        finding: b(
          "Lo que no está documentado depende de la memoria de alguien y se hace distinto cada vez.",
          "What is not documented depends on somebody's memory and gets done differently every time.",
        ),
      },
      {
        q: b("¿Los datos importantes viven en un sistema, y no en hojas de cálculo sueltas?", "Does your important data live in a system, rather than in loose spreadsheets?"),
        finding: b(
          "Los datos repartidos en archivos sueltos se duplican y nadie sabe cuál es el correcto.",
          "Data spread across loose files gets duplicated and nobody knows which is correct.",
        ),
      },
      {
        q: b("¿Las herramientas que usáis están conectadas entre sí?", "Are the tools you use connected to each other?"),
        finding: b(
          "Herramientas sueltas obligan a copiar datos a mano y a repetir trabajo.",
          "Disconnected tools force people to copy data by hand and repeat work.",
        ),
      },
      {
        q: b("Si el dueño faltara una semana, ¿la empresa seguiría funcionando con normalidad?", "If the owner were away for a week, would the company keep running normally?"),
        finding: b(
          "Una empresa que depende de su dueño no puede crecer ni descansar.",
          "A company that depends on its owner cannot grow or rest.",
        ),
      },
      {
        q: b("¿Tenéis copias de seguridad y control de accesos a vuestros sistemas?", "Do you have backups and access control for your systems?"),
        finding: b(
          "Sin copias ni control de accesos, un fallo o una baja puede suponer pérdida de datos.",
          "Without backups or access control, a failure or a departure can mean data loss.",
        ),
      },
    ],
    bands: {
      high: b(
        "Se te va mucho tiempo en tareas manuales y dependes demasiado de personas concretas. Un diagnóstico te dice por dónde empezar.",
        "You lose a lot of time on manual tasks and depend too much on specific people. An assessment tells you where to start.",
      ),
      medium: b(
        "Tienes una base, pero hay procesos y herramientas que ordenar para ganar tiempo.",
        "You have a base, but there are processes and tools to organize to gain time.",
      ),
      low: b(
        "Estás bastante digitalizado. Lo siguiente es automatizar lo que aún se hace a mano.",
        "You are fairly digitalized. The next step is to automate what is still done by hand.",
      ),
    },
    actions: [
      b("Documentar los procesos clave y mapear la cadena de principio a fin", "Document the key processes and map the chain end to end"),
      b("Ordenar herramientas y datos, y conectarlos", "Tidy up tools and data, and connect them"),
      b("Priorizar qué digitalizar primero con un informe y un plan de acción", "Prioritize what to digitalize first with a report and an action plan"),
    ],
  },
  {
    id: "speed",
    service: b("Optimización de velocidad web", "Website speed optimization"),
    title: b("¿Tu web lenta te está costando clientes?", "Is a slow website costing you customers?"),
    intro: b(
      "Cinco preguntas para saber si la velocidad de tu web es un problema, sobre todo en el móvil.",
      "Five questions to find out whether your site's speed is a problem, especially on mobile.",
    ),
    labels: "gap",
    questions: [
      {
        q: b("¿Has medido la velocidad de tu web en el móvil en los últimos meses?", "Have you measured your site's speed on mobile in recent months?"),
        finding: b(
          "Sin medir no se sabe si hay un problema; la mayoría de webs lentas se descubren por las ventas que no llegan.",
          "Without measuring you do not know whether there is a problem; most slow sites are discovered through sales that do not arrive.",
        ),
      },
      {
        q: b("¿Tu web carga en menos de tres segundos en el móvil?", "Does your site load in under three seconds on mobile?"),
        finding: b(
          "Pasados tres segundos, una parte importante de las visitas abandona.",
          "After three seconds, a significant share of visitors leave.",
        ),
      },
      {
        q: b("¿Las imágenes están optimizadas y tienen el tamaño adecuado?", "Are the images optimized and the right size?"),
        finding: b(
          "Las imágenes pesadas son la causa más habitual de webs lentas.",
          "Heavy images are the most common cause of slow sites.",
        ),
      },
      {
        q: b("¿El alojamiento es rápido y no se satura cuando hay más visitas?", "Is the hosting fast and does it not choke when there are more visits?"),
        finding: b(
          "Un alojamiento barato y saturado frena la web aunque todo lo demás esté bien.",
          "Cheap, overloaded hosting slows the site even if everything else is fine.",
        ),
      },
      {
        q: b("¿Sabes cuántos plugins y scripts de terceros cargan en cada página?", "Do you know how many plugins and third-party scripts load on each page?"),
        finding: b(
          "Cada plugin o script de más añade peso y tiempo de carga.",
          "Every extra plugin or script adds weight and loading time.",
        ),
      },
    ],
    bands: {
      high: b(
        "Es muy probable que la velocidad te esté costando visitas y contactos. Se puede mejorar sin rehacer la web.",
        "It is very likely that speed is costing you visits and leads. It can be improved without rebuilding the site.",
      ),
      medium: b(
        "La web va aceptable, pero hay mejoras de velocidad que pueden sumar contactos.",
        "The site runs acceptably, but there are speed gains that can add leads.",
      ),
      low: b(
        "Tu web está bien de velocidad. Mantén un control periódico para que no se degrade.",
        "Your site speed is good. Keep checking regularly so it does not degrade.",
      ),
    },
    actions: [
      b("Medir la web real en móvil con los Core Web Vitals", "Measure the real site on mobile with Core Web Vitals"),
      b("Optimizar imágenes, plugins y alojamiento", "Optimize images, plugins and hosting"),
      b("Pedir el informe gratuito de tu web para ver el detalle", "Request the free website report to see the detail"),
    ],
  },
  {
    id: "automation",
    service: b("Automatización de procesos con IA", "AI process automation"),
    title: b("¿Qué procesos de tu empresa podrían funcionar solos?", "Which of your processes could run on their own?"),
    intro: b(
      "Cinco preguntas para detectar el trabajo repetitivo que una automatización o la IA podría quitarle a tu equipo.",
      "Five questions to spot the repetitive work an automation or AI could take off your team.",
    ),
    labels: "gap",
    questions: [
      {
        q: b("¿Alguien introduce a mano facturas, pedidos o datos en un programa cada semana?", "Does someone enter invoices, orders or data into a program by hand every week?"),
        inverse: true,
        finding: b(
          "Introducir datos a mano es lento y es donde más errores se cuelan; es lo primero que se automatiza.",
          "Entering data by hand is slow and is where most errors creep in; it is the first thing to automate.",
        ),
      },
      {
        q: b("¿Se copian datos a mano de un programa a otro?", "Is data copied by hand from one program to another?"),
        inverse: true,
        finding: b(
          "Cada copia manual es tiempo perdido y una oportunidad de equivocarse.",
          "Every manual copy is lost time and a chance to make a mistake.",
        ),
      },
      {
        q: b("¿Cruzas a mano lo que te facturan los proveedores con lo que tienes en tu sistema?", "Do you cross-check by hand what suppliers bill you against what is in your system?"),
        inverse: true,
        finding: b(
          "Sin ese cruce automático se puede estar pagando por servicios que ya no existen.",
          "Without an automatic cross-check you may be paying for services that no longer exist.",
        ),
      },
      {
        q: b("¿Hay tareas que siempre siguen los mismos pasos, una y otra vez?", "Are there tasks that always follow the same steps, again and again?"),
        inverse: true,
        finding: b(
          "Si una tarea siempre sigue los mismos pasos, una máquina puede hacerla y una persona solo revisarla.",
          "If a task always follows the same steps, a machine can do it and a person only needs to review it.",
        ),
      },
      {
        q: b("¿Alguien dedica más de cinco horas a la semana a tareas mecánicas?", "Does someone spend more than five hours a week on mechanical tasks?"),
        inverse: true,
        finding: b(
          "Cinco horas a la semana son más de 250 al año que podrían dedicarse a lo que aporta valor.",
          "Five hours a week is over 250 a year that could go to work that adds value.",
        ),
      },
    ],
    bands: {
      high: b(
        "Hay mucho trabajo repetitivo que una automatización con IA puede quitar de encima, dejando a una persona solo para confirmar lo importante.",
        "There is a lot of repetitive work that AI automation can take off your hands, leaving a person only to confirm what matters.",
      ),
      medium: b(
        "Tienes varias tareas candidatas a automatizar. Merece la pena empezar por la que más horas consume.",
        "You have several tasks that are candidates for automation. It is worth starting with the one that uses the most hours.",
      ),
      low: b(
        "Tu empresa ya tiene poco trabajo mecánico. Revisa de vez en cuando si aparecen nuevas tareas repetitivas.",
        "Your company already has little mechanical work. Check now and then whether new repetitive tasks appear.",
      ),
    },
    actions: [
      b("Elegir el proceso que más horas consume y automatizarlo", "Pick the process that uses the most hours and automate it"),
      b("Dejar a una persona solo para validar lo irreversible o lo que mueve dinero", "Leave a person only to validate what is irreversible or involves money"),
      b("Mantener las automatizaciones con un plan mensual", "Keep the automations running with a monthly plan"),
    ],
  },
  {
    id: "webdesign",
    service: b("Diseño web", "Web design"),
    title: b("¿Tu web actual te trae clientes?", "Is your current website bringing you customers?"),
    intro: b(
      "Cinco preguntas para saber si tu web trabaja para ti o solo existe.",
      "Five questions to find out whether your website works for you or just exists.",
    ),
    labels: "gap",
    questions: [
      {
        q: b("¿Tu web aparece en Google cuando se busca tu servicio en tu zona?", "Does your site show up on Google when people search for your service in your area?"),
        finding: b(
          "Si no apareces, quien te busca encuentra a la competencia.",
          "If you do not show up, people searching for you find your competitors.",
        ),
      },
      {
        q: b("¿Se ve bien y carga rápido en el móvil?", "Does it look good and load fast on mobile?"),
        finding: b(
          "La mayoría de visitas llegan desde el móvil; una web incómoda las pierde.",
          "Most visits come from mobile; an awkward site loses them.",
        ),
      },
      {
        q: b("¿Queda claro en cinco segundos qué haces y cómo contactarte?", "Is it clear within five seconds what you do and how to contact you?"),
        finding: b(
          "Si el visitante no lo entiende enseguida, se va.",
          "If the visitor does not get it right away, they leave.",
        ),
      },
      {
        q: b("¿Tu web te trae contactos o clientes cada mes?", "Does your site bring you leads or customers every month?"),
        finding: b(
          "Una web que no trae contactos es un gasto, no una inversión.",
          "A website that brings no leads is a cost, not an investment.",
        ),
      },
      {
        q: b("¿Puedes actualizarla tú sin depender de nadie?", "Can you update it yourself without depending on anyone?"),
        finding: b(
          "Si cambiar un texto es un problema, la web se queda desactualizada.",
          "If changing a line of text is a problem, the site goes stale.",
        ),
      },
    ],
    bands: {
      high: b(
        "Tu web hoy te cuesta más de lo que te aporta. Una web rápida y pensada para captar contactos cambia el resultado.",
        "Today your site costs you more than it brings. A fast website built to capture leads changes the outcome.",
      ),
      medium: b(
        "La web cumple en parte, pero hay mejoras de visibilidad y de conversión que pueden sumar clientes.",
        "The site partly delivers, but there are visibility and conversion improvements that can add customers.",
      ),
      low: b(
        "Tu web funciona bien. Seguir midiendo y mejorando te ayuda a sacar más partido.",
        "Your site works well. Keep measuring and improving to get more out of it.",
      ),
    },
    actions: [
      b("Rehacer o mejorar la web para que cargue rápido y se vea bien en móvil", "Rebuild or improve the site so it loads fast and looks good on mobile"),
      b("Trabajar el posicionamiento local para aparecer en tu zona", "Work on local search visibility to appear in your area"),
      b("Medir los contactos que llegan y mejorar la conversión", "Measure the leads that arrive and improve conversion"),
    ],
  },
  {
    id: "erp",
    service: b("Consultoría ERP", "ERP consulting"),
    title: b("¿Tu ERP te ayuda o te frena?", "Is your ERP helping you or holding you back?"),
    intro: b(
      "Cinco preguntas para ver si tu ERP está bien aprovechado o si te estás peleando con él.",
      "Five questions to see whether your ERP is well used or whether you are fighting it.",
    ),
    labels: "gap",
    questions: [
      {
        q: b("¿Todo el equipo introduce la información en el ERP del mismo modo?", "Does the whole team enter information into the ERP the same way?"),
        finding: b(
          "Si cada persona lo usa a su manera, los datos no son comparables y los informes no cuadran.",
          "If everyone uses it their own way, the data is not comparable and the reports do not add up.",
        ),
      },
      {
        q: b("¿Los mismos datos se duplican en hojas de cálculo fuera del ERP?", "Is the same data duplicated in spreadsheets outside the ERP?"),
        inverse: true,
        finding: b(
          "Los Excel paralelos indican que el ERP no cubre una necesidad y generan datos que nadie controla.",
          "Parallel spreadsheets show the ERP does not cover a need and create data nobody controls.",
        ),
      },
      {
        q: b("¿Los informes cuadran y te fías de ellos?", "Do the reports add up, and do you trust them?"),
        finding: b(
          "Sin informes fiables se decide a ciegas.",
          "Without reliable reports, decisions are made blind.",
        ),
      },
      {
        q: b("¿Usas la mayoría de las funciones que pagas?", "Do you use most of the features you pay for?"),
        finding: b(
          "Pagar funciones que nadie usa es dinero tirado, y suele indicar falta de formación o de configuración.",
          "Paying for features nobody uses is wasted money, and usually points to missing training or configuration.",
        ),
      },
      {
        q: b("¿Tu proveedor del ERP entiende cómo trabaja tu empresa?", "Does your ERP provider understand how your company works?"),
        finding: b(
          "Un proveedor que no entiende tu operación entrega configuraciones que no encajan.",
          "A provider that does not understand your operation delivers setups that do not fit.",
        ),
      },
    ],
    bands: {
      high: b(
        "Tu ERP te está frenando: datos duplicados, informes en duda y funciones sin usar. Antes de cambiar de programa, conviene entender qué falla.",
        "Your ERP is holding you back: duplicated data, doubtful reports and unused features. Before switching software, it is worth understanding what is wrong.",
      ),
      medium: b(
        "El ERP funciona, pero hay procesos y configuración por ordenar para sacarle más partido.",
        "The ERP works, but there are processes and configuration to tidy up to get more out of it.",
      ),
      low: b(
        "Tu ERP está bien aprovechado. Revísalo cuando cambien los procesos de la empresa.",
        "Your ERP is well used. Review it when the company's processes change.",
      ),
    },
    actions: [
      b("Hacer un diagnóstico de cómo se usa el ERP de verdad", "Run an assessment of how the ERP is really used"),
      b("Definir quién introduce qué y cuándo, y configurarlo así", "Define who enters what and when, and configure it that way"),
      b("Decidir con datos si seguir con este ERP o cambiar", "Decide with data whether to keep this ERP or switch"),
    ],
  },
  {
    id: "telecom",
    service: b("Caos operativo en telecomunicaciones", "Operational chaos in telecoms"),
    title: b("¿Cuánto caos operativo hay en tu operador?", "How much operational chaos is there in your operator?"),
    intro: b(
      "Cinco preguntas pensadas para operadores e ISPs pequeños: altas, incidencias, proveedores y dependencia de unas pocas personas.",
      "Five questions designed for small operators and ISPs: activations, incidents, suppliers and dependence on a few people.",
    ),
    labels: "gap",
    questions: [
      {
        q: b("¿Las altas, bajas y portabilidades se gestionan en un único sistema?", "Are activations, cancellations and number ports managed in a single system?"),
        finding: b(
          "Con varios sitios para lo mismo, nadie tiene la foto completa y se pierden pasos.",
          "With several places for the same thing, nobody has the full picture and steps get lost.",
        ),
      },
      {
        q: b("¿Cada incidencia queda registrada con un responsable y un estado?", "Is every incident logged with an owner and a status?"),
        finding: b(
          "Sin responsable y estado, las incidencias se pierden o se atienden tarde.",
          "Without an owner and a status, incidents get lost or are handled late.",
        ),
      },
      {
        q: b("Cuando hay una avería, ¿sabes qué clientes afecta?", "When there is an outage, do you know which customers it affects?"),
        finding: b(
          "Sin ese cruce, se avisa tarde o no se avisa, y cada llamada de cliente es trabajo extra.",
          "Without that cross-reference, customers are warned late or not at all, and every customer call is extra work.",
        ),
      },
      {
        q: b("¿Cruzáis lo que os facturan los proveedores con lo que tenéis de clientes?", "Do you cross-check what suppliers bill you against your customer base?"),
        finding: b(
          "Sin ese cruce se puede estar pagando por líneas o servicios que ya no existen.",
          "Without that check you may be paying for lines or services that no longer exist.",
        ),
      },
      {
        q: b("¿La operación depende de una o dos personas que lo saben todo?", "Does the operation depend on one or two people who know everything?"),
        inverse: true,
        finding: b(
          "Si esas personas faltan o se van, el operador se queda sin conocimiento clave.",
          "If those people are out or leave, the operator loses key knowledge.",
        ),
      },
    ],
    bands: {
      high: b(
        "Tu operación tiene mucho caos y depende de pocas personas. Es lo que se ordena con un diagnóstico y un plan por fases.",
        "Your operation has a lot of chaos and depends on a few people. It is exactly what an assessment and a phased plan put in order.",
      ),
      medium: b(
        "Parte de la operación está ordenada, pero hay cadenas que se rompen entre sistemas y personas.",
        "Part of the operation is in order, but there are chains that break between systems and people.",
      ),
      low: b(
        "Tu operación está bastante ordenada. Documentarla y automatizar los cruces te ahorra tiempo.",
        "Your operation is fairly well organized. Documenting it and automating the cross-checks saves you time.",
      ),
    },
    actions: [
      b("Mapear la cadena completa, de la venta a la factura", "Map the full chain, from sale to invoice"),
      b("Automatizar el cruce de proveedores y el registro de incidencias", "Automate supplier cross-checks and incident logging"),
      b("Repartir el conocimiento y documentar los procesos clave", "Share the knowledge and document the key processes"),
    ],
  },
];

// Qué autoevaluación muestra cada página (ruta sin barra final). Las páginas que ya tienen su propio lead magnet
// (informe web, plantilla de Drive, calculadora de leads, autoevaluación de caos operativo) no aparecen aquí.
export const quizByPath: Record<string, string> = {
  // Español
  "/gestor-contrasenas-empresas": "passwords",
  "/ciberseguridad-empresas-toledo": "cyber",
  "/informatico-empresas-toledo": "cyber",
  "/informatico-fuensalida-torrijos": "cyber",
  "/informatico-illescas-la-sagra": "cyber",
  "/informatico-navalcarnero-mostoles": "cyber",
  "/mantenimiento-informatico-toledo": "itdown",
  "/google-workspace-empresas-toledo": "workspace",
  "/mantenimiento-wordpress": "wordpress",
  "/soporte-remoto": "remote",
  "/integracion-sistemas": "integration",
  "/herramientas-internas-medida": "tools",
  "/asistente-ia-empresa": "knowledge",
  "/agente-ia-atencion-cliente": "response",
  "/landing-page-campanas": "funnel",
  "/diagnostico-digitalizacion": "digital",
  "/consultor-digitalizacion-toledo": "digital",
  "/optimizacion-velocidad-web": "speed",
  "/plan-operaciones-ia": "automation",
  "/diseno-web-toledo": "webdesign",
  "/consultoria-erp-pymes": "erp",
  "/caos-operativo-telecomunicaciones": "telecom",
  // Inglés
  "/business-password-manager-setup": "passwords",
  "/managed-it-support": "itdown",
  "/google-workspace-reorganization": "workspace",
  "/managed-website": "wordpress",
  "/systems-integration": "integration",
  "/custom-internal-tools": "tools",
  "/ai-knowledge-base": "knowledge",
  "/ai-chatbot-small-business": "response",
  "/conversion-landing-pages": "funnel",
  "/digitalization-assessment": "digital",
  "/website-speed-optimization": "speed",
  "/operations-ai-plan": "automation",
  "/ai-process-automation": "automation",
};

export const quizIdForPath = (path: string) => quizByPath[path.length > 1 ? path.replace(/\/$/, "") : path];
export const quizById = (id: string) => quizzes.find((quiz) => quiz.id === id);
