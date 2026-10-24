import type { LocalPage } from "@/data/localPages";

// Páginas de servicio en inglés que no son planes mensuales. Contenido y precios salen de los casos prácticos
// publicados en español (casePages.ts); allí no se nombra a la empresa y aquí tampoco.
export const servicePagesEn: LocalPage[] = [
  {
    slug: "ai-process-automation",
    lang: "en",
    title: "AI process automation for small businesses | Taller de Digitalización",
    description: "We automate repetitive business processes with AI: invoice entry, supplier reconciliation, data lookups. People only review what needs a decision. Examples from €490.",
    eyebrow: "AI process automation · Remote",
    h1: "We automate your repetitive processes with AI, so your team stops doing them by hand.",
    intro: "Invoices typed in one by one, data copied between programs, the same questions answered again and again. We build automations and AI agents that run those steps on their own, and a person only confirms what needs a decision. It is the approach we use every day with a small telecom operator, where administration that used to take a full day or more is now handled in half a day.",
    schemaService: "AI process automation for businesses",
    areas: ["Remote"],
    problemsTitle: "Signs you have processes worth automating",
    problems: [
      "Someone types supplier invoices into the management software by hand.",
      "The same data is copied from one program to another every week.",
      "You may be paying for services you no longer have, because nobody cross-checks what suppliers bill.",
      "A program is kept alive, and paid for, only to look up old data.",
      "The team answers the same questions over and over by checking several sources.",
      "When the person who knows the process is away, everything slows down.",
    ],
    servicesTitle: "What we automate",
    services: [
      ["Supplier reconciliation", "A process compares what each supplier bills you with what is in your system and emails you when something does not add up. One-off audit from €490, automatic version from €1,800.", "swap"],
      ["Automatic invoice entry", "Invoices arrive, a process reads them, enters them into your software and leaves them ready for a person to validate. A week of quarterly review becomes one morning. From €2,500.", "filecheck"],
      ["Ask AI about your data", "Your data (coverage, zones, deliveries, history) connected to AI, so the team asks in plain language instead of searching several sources. From €1,200.", "search"],
      ["Retire the old program", "We extract the data from software you only keep for the history, store it in your own database and make it searchable with AI, so you can cancel the license. From €900.", "server"],
      ["AI agents for people", "Assistants that answer your customers, or your own team, using your documentation, with a handoff to a person when needed.", "bot"],
      ["Kept running", "Portals, formats and systems change. The monthly Operations & AI plan watches and maintains the automations, from €39/month.", "monitor"],
    ],
    zoneTitle: "Delivered entirely remotely",
    zoneText: [
      "Everything is delivered remotely, so I work with businesses wherever they are. Calls, support and documentation are in English.",
      "Prices are in euros, without VAT. After a first review you get a closed price before anything starts.",
    ],
    approachTitle: "How it works",
    approach: [
      ["Pick the process", "We look at the task that costs your team the most hours and decide whether it is worth automating."],
      ["Build it", "We build the automation or the AI agent on top of the tools you already use, for a closed price agreed beforehand."],
      ["A person confirms", "In the first weeks a person reviews the results. Anything irreversible, or that involves money, is always confirmed by a person."],
      ["Keep it running", "Once it is stable, the monthly plan keeps it working as your suppliers, formats and systems change."],
    ],
    faq: [
      ["Does AI replace my staff?", "It takes over the repetitive steps: typing, copying, cross-checking. A person still confirms what is irreversible or involves money, such as cancelling a service or paying a claim. The aim is for your team to stop doing mechanical work and spend time on what needs judgement."],
      ["What kind of processes can be automated?", "Anything repetitive that follows rules: entering invoices, comparing supplier bills with your records, looking up data scattered across sources, answering frequent questions. If you are not sure, describe the task and we will tell you whether it is worth it."],
      ["Do I have to change my software?", "Usually not. The automations connect to the programs you already use, so you keep your tools and remove the manual work between them."],
      ["How much does it cost?", "Typical examples start at €490 for a one-off supplier reconciliation audit and go up to €2,500 or more for custom work such as automatic invoice entry. The final price depends on your flow and is closed after a first review, without VAT."],
      ["Who is this for?", "Small businesses of up to about 50 people with suppliers, invoices or data spread across programs. The examples come from small telecom operators, but the same ideas apply to any company with repetitive administration."],
    ],
    related: [
      ["Operations & AI plan", "/operations-ai-plan/"],
      ["Systems integration", "/systems-integration/"],
      ["AI assistant with company knowledge", "/internal-oracle/"],
    ],
    finalCta: "Got a process eating your team's hours? Let's see whether it can run on its own.",
    formService: "Automate repetitive tasks with AI",
    showReviews: true,
  },
];
