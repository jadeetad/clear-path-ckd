from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)  # allows the React frontend (different origin) to call this API

model = joblib.load("model/ckd_model.pkl")
encoders = joblib.load("preprocessing/encoders.pkl")   # dict: {model_column_name: fitted LabelEncoder}
scaler = joblib.load("preprocessing/scaler.pkl")

# ---------------------------------------------------------------------------
# Exact column order used during training (df.columns, minus "Target").
# This MUST match the order the model was fit on, or predictions will be
# silently wrong even though nothing throws an error.
# ---------------------------------------------------------------------------
FEATURE_ORDER = [
    "Age of the patient",
    "Blood pressure (mm/Hg)",
    "Specific gravity of urine",
    "Albumin in urine",
    "Sugar in urine",
    "Red blood cells in urine",
    "Pus cells in urine",
    "Pus cell clumps in urine",
    "Bacteria in urine",
    "Random blood glucose level (mg/dl)",
    "Blood urea (mg/dl)",
    "Serum creatinine (mg/dl)",
    "Sodium level (mEq/L)",
    "Potassium level (mEq/L)",
    "Hemoglobin level (gms)",
    "Packed cell volume (%)",
    "White blood cell count (cells/cumm)",
    "Red blood cell count (millions/cumm)",
    "Hypertension (yes/no)",
    "Diabetes mellitus (yes/no)",
    "Coronary artery disease (yes/no)",
    "Appetite (good/poor)",
    "Pedal edema (yes/no)",
    "Anemia (yes/no)",
    "Estimated Glomerular Filtration Rate (eGFR)",
    "Urine protein-to-creatinine ratio",
    "Urine output (ml/day)",
    "Serum albumin level",
    "Cholesterol level",
    "Parathyroid hormone (PTH) level",
    "Serum calcium level",
    "Serum phosphate level",
    "Family history of chronic kidney disease",
    "Smoking status",
    "Body Mass Index (BMI)",
    "Physical activity level",
    "Duration of diabetes mellitus (years)",
    "Duration of hypertension (years)",
    "Cystatin C level",
    "Urinary sediment microscopy results",
    "C-reactive protein (CRP) level",
    "Interleukin-6 (IL-6) level",
]

# Maps each model training column to the key the React frontend sends
# (see src/lib/ckd-fields.ts `key` fields).
FRONTEND_KEY_FOR = {
    "Age of the patient": "age",
    # TEMP: the model was only ever trained on ONE combined BP value. The
    # frontend currently collects systolic AND diastolic separately — until
    # that's reconciled, systolic is used as the proxy and diastolic is
    # collected but unused. Revisit this before treating results as final.
    "Blood pressure (mm/Hg)": "blood_pressure_systolic",
    "Specific gravity of urine": "specific_gravity",
    "Albumin in urine": "albumin_in_urine",
    "Sugar in urine": "sugar_in_urine",
    "Red blood cells in urine": "red_blood_cells_in_urine",
    "Pus cells in urine": "pus_cells",
    "Pus cell clumps in urine": "pus_cell_clumps",
    "Bacteria in urine": "bacteria",
    "Random blood glucose level (mg/dl)": "blood_glucose_random",
    "Blood urea (mg/dl)": "blood_urea",
    "Serum creatinine (mg/dl)": "serum_creatinine",
    "Sodium level (mEq/L)": "sodium",
    "Potassium level (mEq/L)": "potassium",
    "Hemoglobin level (gms)": "hemoglobin",
    "Packed cell volume (%)": "packed_cell_volume",
    "White blood cell count (cells/cumm)": "white_blood_cell_count",
    "Red blood cell count (millions/cumm)": "red_blood_cell_count",
    "Hypertension (yes/no)": "hypertension",
    "Diabetes mellitus (yes/no)": "diabetes_mellitus",
    "Coronary artery disease (yes/no)": "coronary_artery_disease",
    "Appetite (good/poor)": "appetite",
    "Pedal edema (yes/no)": "pedal_edema",
    "Anemia (yes/no)": "anemia",
    "Estimated Glomerular Filtration Rate (eGFR)": "egfr",
    "Urine protein-to-creatinine ratio": "urine_protein_creatinine_ratio",
    "Urine output (ml/day)": "urine_output",
    "Serum albumin level": "serum_albumin",
    "Cholesterol level": "cholesterol",
    "Parathyroid hormone (PTH) level": "pth",
    "Serum calcium level": "serum_calcium",
    "Serum phosphate level": "serum_phosphate",
    "Family history of chronic kidney disease": "family_history_ckd",
    "Smoking status": "smoking_status",
    "Body Mass Index (BMI)": "bmi",
    "Physical activity level": "physical_activity",
    "Duration of diabetes mellitus (years)": "duration_of_diabetes",
    "Duration of hypertension (years)": "duration_of_hypertension",
    "Cystatin C level": "cystatin_c",
    "Urinary sediment microscopy results": "urinary_sediment_microscopy",
    "C-reactive protein (CRP) level": "crp",
    "Interleukin-6 (IL-6) level": "il6",
}

# From the notebook's `target_encoder.classes_` printout. This is alphabetical
# order (how LabelEncoder sorts), NOT severity order — do not assume index 0
# is "best" and index 4 is "worst" anywhere else in the codebase.
TARGET_CLASSES = {
    0: "High_Risk",
    1: "Low_Risk",
    2: "Moderate_Risk",
    3: "No_Disease",
    4: "Severe_Disease",
}


@app.route("/predict", methods=["POST"])
def predict():
    payload = request.get_json(force=True)

    row = []
    for model_col in FEATURE_ORDER:
        frontend_key = FRONTEND_KEY_FOR[model_col]
        value = payload.get(frontend_key)

        if value is None or value == "":
            return jsonify({
                "error": f"Missing value for '{frontend_key}' ({model_col})"
            }), 400

        if model_col in encoders:
            # Categorical column — must be transformed by the SAME LabelEncoder
            # instance fitted during training, not a hardcoded 0/1 mapping.
            le = encoders[model_col]
            try:
                value = le.transform([str(value)])[0]
            except ValueError:
                return jsonify({
                    "error": (
                        f"Unrecognized category '{value}' for '{frontend_key}'. "
                        f"Expected one of: {list(le.classes_)}"
                    )
                }), 400
        else:
            value = float(value)

        row.append(value)

    row_array = np.array(row, dtype=float).reshape(1, -1)
    row_scaled = scaler.transform(row_array)

    pred_index = int(model.predict(row_scaled)[0])
    prediction = TARGET_CLASSES.get(pred_index, "Unknown")

    return jsonify({"prediction": prediction})


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(debug=True, port=5000)