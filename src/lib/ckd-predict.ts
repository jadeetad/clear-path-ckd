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

// Base URL of the Flask API. Set VITE_API_URL in a .env file for production;
// falls back to a local Flask dev server for local testing.
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

/**
 * Calls the real trained Random Forest model, served by the Flask backend.
 * The payload shape (frontend field keys -> number/string) is already
 * correct — the backend maps these keys to the model's actual training
 * column names and encodings.
 */
export async function predict(values: FormValues): Promise<PredictionResult> {
  const payload = toModelPayload(values);

  const response = await fetch(`${API_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Prediction request failed with status ${response.status}`);
  }

  const data = await response.json();
  // Expected response shape: { prediction: "Moderate_Risk" }
  const raw = String(data.prediction ?? "");
  const prediction = raw.replace(/_/g, " ") as RiskClass;
  const index = RISK_CLASSES.indexOf(prediction);

  if (index === -1) {
    throw new Error(`Unrecognized prediction class from backend: "${raw}"`);
  }

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