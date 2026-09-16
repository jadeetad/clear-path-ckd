/**
 * Definitive 42-feature specification for the CKD risk model.
 *
 * Each entry defines: the key sent to the Python model, the label shown to the
 * user, the input control, allowed values / encoding, and validation bounds.
 * Keep this file as the single source of truth — the form, validation and the
 * request payload are all generated from it.
 */

export type FieldSection =
  | "patient"
  | "blood"
  | "urine"
  | "history"
  | "other";

export type NumberField = {
  key: string;
  label: string;
  section: FieldSection;
  type: "number";
  unit?: string;
  min: number;
  max: number;
  step: number;
  placeholder?: string;
};

export type SelectField = {
  key: string;
  label: string;
  section: FieldSection;
  type: "select" | "radio";
  /** label shown, value sent to the model */
  options: { label: string; value: string }[];
};

export type CkdField = NumberField | SelectField;

export const SECTIONS: { id: FieldSection; title: string; caption: string }[] = [
  { id: "patient", title: "Patient Information", caption: "Demographics and vitals" },
  { id: "blood", title: "Blood / Kidney Tests", caption: "Serum chemistry and haematology" },
  { id: "urine", title: "Urine Tests", caption: "Urinalysis and microscopy" },
  { id: "history", title: "Medical History", caption: "Comorbidities and lifestyle" },
  { id: "other", title: "Other Findings", caption: "Clinical observations" },
];

const yesNo = [
  { label: "No", value: "no" },
  { label: "Yes", value: "yes" },
];

const normalAbnormal = [
  { label: "Normal", value: "normal" },
  { label: "Abnormal", value: "abnormal" },
];

const presentNotPresent = [
  { label: "Not present", value: "notpresent" },
  { label: "Present", value: "present" },
];

export const FIELDS: CkdField[] = [
  // ── Patient information (4)
  { key: "age", label: "Age of the patient", section: "patient", type: "number", unit: "years", min: 0, max: 120, step: 1, placeholder: "45" },
  { key: "blood_pressure_systolic", label: "Blood pressure (systolic)", section: "patient", type: "number", unit: "mmHg", min: 50, max: 260, step: 1, placeholder: "130" },
  { key: "blood_pressure_diastolic", label: "Blood pressure (diastolic)", section: "patient", type: "number", unit: "mmHg", min: 30, max: 160, step: 1, placeholder: "80" },
  { key: "bmi", label: "Body Mass Index (BMI)", section: "patient", type: "number", unit: "kg/m²", min: 10, max: 60, step: 0.1, placeholder: "24.7" },

  // ── Blood / kidney tests (18)
  { key: "blood_glucose_random", label: "Random blood glucose level", section: "blood", type: "number", unit: "mg/dL", min: 20, max: 600, step: 1, placeholder: "120" },
  { key: "blood_urea", label: "Blood urea", section: "blood", type: "number", unit: "mg/dL", min: 1, max: 400, step: 0.1, placeholder: "40" },
  { key: "serum_creatinine", label: "Serum creatinine", section: "blood", type: "number", unit: "mg/dL", min: 0.1, max: 30, step: 0.01, placeholder: "1.2" },
  { key: "sodium", label: "Sodium level", section: "blood", type: "number", unit: "mEq/L", min: 90, max: 180, step: 0.1, placeholder: "138" },
  { key: "potassium", label: "Potassium level", section: "blood", type: "number", unit: "mEq/L", min: 1, max: 12, step: 0.1, placeholder: "4.5" },
  { key: "hemoglobin", label: "Hemoglobin level", section: "blood", type: "number", unit: "g/dL", min: 3, max: 22, step: 0.1, placeholder: "13.5" },
  { key: "packed_cell_volume", label: "Packed cell volume", section: "blood", type: "number", unit: "%", min: 10, max: 60, step: 0.1, placeholder: "42" },
  { key: "white_blood_cell_count", label: "White blood cell count", section: "blood", type: "number", unit: "cells/µL", min: 1000, max: 30000, step: 100, placeholder: "7800" },
  { key: "red_blood_cell_count", label: "Red blood cell count", section: "blood", type: "number", unit: "millions/µL", min: 1, max: 9, step: 0.1, placeholder: "4.8" },
  { key: "egfr", label: "eGFR", section: "blood", type: "number", unit: "mL/min/1.73m²", min: 1, max: 160, step: 1, placeholder: "85" },
  { key: "cystatin_c", label: "Cystatin C", section: "blood", type: "number", unit: "mg/L", min: 0.1, max: 10, step: 0.01, placeholder: "0.9" },
  { key: "crp", label: "C-reactive protein (CRP)", section: "blood", type: "number", unit: "mg/L", min: 0, max: 300, step: 0.1, placeholder: "3.0" },
  { key: "il6", label: "Interleukin-6 (IL-6)", section: "blood", type: "number", unit: "pg/mL", min: 0, max: 500, step: 0.1, placeholder: "4.0" },
  { key: "pth", label: "Parathyroid hormone (PTH)", section: "blood", type: "number", unit: "pg/mL", min: 1, max: 1500, step: 1, placeholder: "45" },
  { key: "serum_calcium", label: "Serum calcium", section: "blood", type: "number", unit: "mg/dL", min: 3, max: 16, step: 0.1, placeholder: "9.4" },
  { key: "serum_phosphate", label: "Serum phosphate", section: "blood", type: "number", unit: "mg/dL", min: 0.5, max: 15, step: 0.1, placeholder: "3.5" },
  { key: "serum_albumin", label: "Serum albumin", section: "blood", type: "number", unit: "g/dL", min: 0.5, max: 6, step: 0.1, placeholder: "4.2" },
  { key: "cholesterol", label: "Cholesterol", section: "blood", type: "number", unit: "mg/dL", min: 50, max: 500, step: 1, placeholder: "190" },

  // ── Urine tests (10)
  { key: "specific_gravity", label: "Specific gravity of urine", section: "urine", type: "number", min: 1.000, max: 1.035, step: 0.001, placeholder: "1.020" },
  { key: "albumin_in_urine", label: "Albumin in urine", section: "urine", type: "select", options: [
    { label: "0", value: "0" }, { label: "1", value: "1" }, { label: "2", value: "2" },
    { label: "3", value: "3" }, { label: "4", value: "4" }, { label: "5", value: "5" },
  ] },
  { key: "sugar_in_urine", label: "Sugar in urine", section: "urine", type: "select", options: [
    { label: "0", value: "0" }, { label: "1", value: "1" }, { label: "2", value: "2" },
    { label: "3", value: "3" }, { label: "4", value: "4" }, { label: "5", value: "5" },
  ] },
  { key: "urine_protein_creatinine_ratio", label: "Urine protein-to-creatinine ratio", section: "urine", type: "number", unit: "mg/mg", min: 0, max: 20, step: 0.01, placeholder: "0.35" },
  { key: "urine_output", label: "Urine output", section: "urine", type: "number", unit: "mL/day", min: 0, max: 6000, step: 10, placeholder: "1400" },
  { key: "red_blood_cells_in_urine", label: "Red blood cells in urine", section: "urine", type: "select", options: normalAbnormal },
  { key: "pus_cells", label: "Pus cells in urine", section: "urine", type: "select", options: normalAbnormal },
  { key: "pus_cell_clumps", label: "Pus cell clumps in urine", section: "urine", type: "select", options: presentNotPresent },
  { key: "bacteria", label: "Bacteria in urine", section: "urine", type: "select", options: presentNotPresent },
  { key: "urinary_sediment_microscopy", label: "Urinary sediment microscopy", section: "urine", type: "select", options: normalAbnormal },

  // ── Medical history (8)
  { key: "hypertension", label: "Hypertension", section: "history", type: "radio", options: yesNo },
  { key: "diabetes_mellitus", label: "Diabetes mellitus", section: "history", type: "radio", options: yesNo },
  { key: "coronary_artery_disease", label: "Coronary artery disease", section: "history", type: "radio", options: yesNo },
  { key: "duration_of_diabetes", label: "Duration of diabetes mellitus", section: "history", type: "number", unit: "years", min: 0, max: 70, step: 1, placeholder: "0" },
  { key: "duration_of_hypertension", label: "Duration of hypertension", section: "history", type: "number", unit: "years", min: 0, max: 70, step: 1, placeholder: "0" },
  { key: "family_history_ckd", label: "Family history of chronic kidney disease", section: "history", type: "radio", options: yesNo },
  { key: "smoking_status", label: "Smoking status", section: "history", type: "radio", options: yesNo },
  { key: "physical_activity", label: "Physical activity level", section: "history", type: "select", options: [
    { label: "Low", value: "low" },
    { label: "Moderate", value: "moderate" },
    { label: "High", value: "high" },
  ] },

  // ── Other (3)
  { key: "appetite", label: "Appetite", section: "other", type: "select", options: [
    { label: "Good", value: "good" },
    { label: "Poor", value: "poor" },
  ] },
  { key: "pedal_edema", label: "Pedal edema", section: "other", type: "radio", options: yesNo },
  { key: "anemia", label: "Anemia", section: "other", type: "radio", options: yesNo },
];

export const FIELD_COUNT = FIELDS.length; // 43 (BMI added — was missing from the trained model's feature set)

export type FormValues = Record<string, string>;

export function emptyValues(): FormValues {
  return Object.fromEntries(FIELDS.map((f) => [f.key, ""]));
}

export function validate(values: FormValues): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const field of FIELDS) {
    const raw = (values[field.key] ?? "").trim();
    if (!raw) {
      errors[field.key] =
        field.type === "number"
          ? `Please enter the ${field.label.toLowerCase()}.`
          : `Please select a value for ${field.label.toLowerCase()}.`;
      continue;
    }
    if (field.type === "number") {
      const n = Number(raw);
      if (!Number.isFinite(n)) {
        errors[field.key] = "Please enter a valid number.";
      } else if (n < field.min || n > field.max) {
        errors[field.key] = `Expected a value between ${field.min} and ${field.max}${field.unit ? ` ${field.unit}` : ""}.`;
      }
    } else if (!field.options.some((o) => o.value === raw)) {
      errors[field.key] = "Please choose one of the listed options.";
    }
  }
  return errors;
}

/** Shape sent to the Python model: numbers as numbers, categories as encoded strings. */
export function toModelPayload(values: FormValues): Record<string, number | string> {
  const payload: Record<string, number | string> = {};
  for (const field of FIELDS) {
    const raw = (values[field.key] ?? "").trim();
    payload[field.key] = field.type === "number" ? Number(raw) : raw;
  }
  return payload;
}
