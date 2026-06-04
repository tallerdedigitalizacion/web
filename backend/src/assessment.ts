export const assessmentAreas = [
  "Dirección y alineamiento",
  "Procesos y flujos de trabajo",
  "Soporte y atención al cliente",
  "Operación técnica",
  "Identidad digital",
  "Gobernanza de datos",
  "Trazabilidad y accountability",
  "Seguridad",
  "Automatización y personalización",
];

export type Answer = {
  areaIndex: number;
  questionIndex: number;
  value: number;
};

export function scoreAssessment(answers: Answer[]) {
  const areaScores = assessmentAreas.map((_, areaIndex) =>
    answers
      .filter((answer) => answer.areaIndex === areaIndex)
      .reduce((sum, answer) => sum + answer.value, 0),
  );
  const total = areaScores.reduce((sum, score) => sum + score, 0);
  const percent = Math.round((total / 81) * 100);
  const weakAreas = areaScores
    .map((score, index) => ({ name: assessmentAreas[index], score }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  return {
    areaScores,
    total,
    percent,
    weakAreas,
    interpretation: getInterpretation(total),
  };
}

export function getInterpretation(total: number) {
  if (total <= 27) {
    return {
      level: "Operación reactiva y frágil",
      title: "Tu operación depende demasiado de esfuerzo humano clave.",
      text:
        "La lectura de ROI es clara: ahora mismo el coste probablemente no está solo en herramientas o sueldos, sino en tiempo directivo perdido, decisiones reactivas y capacidad de crecimiento bloqueada. Si eres CEO, es probable que estés sosteniendo demasiadas cosas con memoria, criterio personal y urgencias diarias.",
    };
  }

  if (total <= 54) {
    return {
      level: "Operación funcional, pero dependiente y con fricción",
      title: "Tu empresa funciona, pero todavía paga fricción con tiempo del CEO.",
      text:
        "La empresa probablemente ya tiene cierta estructura, pero hay áreas que consumen más energía de la que deberían. El ROI está en atacar los puntos donde una mejora pequeña puede devolver foco, reducir interrupciones y hacer que el crecimiento pese menos.",
    };
  }

  return {
    level: "Operación más gobernada, con áreas débiles a vigilar",
    title: "Hay base operativa, pero el ROI puede estar en afinar los cuellos débiles.",
    text:
      "Tu empresa muestra señales de gobernanza. Eso no significa que no haya caos operativo: significa que conviene mirar con precisión qué áreas están limitando delegación, escalabilidad o velocidad de decisión.",
  };
}
