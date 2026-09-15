import { toModelPayload, type FormValues } from "./ckd-fields";

export const RISK_CLASSES = [
  "No Disease",
  "Low Risk",
  "Moderate Risk",
  "High Risk",
  "Severe Disease",
] as const;

export type RiskClass = (typeof RISK_CLASSES)[number];

export type PredictionResult = {
  prediction: RiskClass;
  index: number;
  explanation: string;
  timestamp: string;
};

const EXPLANATIONS: Record<RiskClass, string> = {
  "No Disease":
    "The submitted values fall within expected ranges and show no indicators of chronic kidney impairment.",
  "Low Risk":
    "Most values are within range, with mild deviations that are worth monitoring at routine follow-up.",
  "Moderate Risk":
    "Several markers of filtration and kidney function are outside expected ranges. Review by a clinician is advised.",
  "High Risk":
    "Multiple markers indicate substantially reduced kidney function. Prompt specialist evaluation is advised.",
  "Severe Disease":
    "The profile is consistent with advanced kidney impairment. Urgent specialist evaluation is advised.",
};

/**
 * Placeholder classifier.
 *
 * This is a transparent rule-based stand-in so the interface can be used end to
 * end before the trained Random Forest is served. Swap the body of `predict`
 * for a POST to the Python API — the payload shape is already correct.
 */
export async function predict(values: FormValues): Promise<PredictionResult> {
  const p = toModelPayload(values) as Record<string, number | string>;
  await new Promise((r) => setTimeout(r, 900));

  let score = 0;
  const egfr = Number(p.egfr);
  if (egfr < 15) score += 5;
  else if (egfr < 30) score += 4;
  else if (egfr < 45) score += 3;
  else if (egfr < 60) score += 2;
  else if (egfr < 90) score += 1;

  const creat = Number(p.serum_creatinine);
  if (creat > 5) score += 3;
  else if (creat > 2) score += 2;
  else if (creat > 1.3) score += 1;

  if (Number(p.blood_urea) > 80) score += 2;
  else if (Number(p.blood_urea) > 45) score += 1;

  if (Number(p.urine_protein_creatinine_ratio) > 1) score += 2;
  else if (Number(p.urine_protein_creatinine_ratio) > 0.3) score += 1;

  if (Number(p.hemoglobin) < 10) score += 1;
  if (Number(p.albumin_in_urine) >= 3) score += 1;
  if (p.hypertension === "yes") score += 1;
  if (p.diabetes_mellitus === "yes") score += 1;
  if (p.pedal_edema === "yes") score += 1;
  if (p.anemia === "yes") score += 1;

  let index: number;
  if (score <= 1) index = 0;
  else if (score <= 4) index = 1;
  else if (score <= 7) index = 2;
  else if (score <= 11) index = 3;
  else index = 4;

  const prediction = RISK_CLASSES[index];
  return {
    prediction,
    index,
    explanation: EXPLANATIONS[prediction],
    timestamp: new Date().toLocaleString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}
