# RenalSense — CKD Risk Classifier

A machine-learning project that classifies chronic kidney disease (CKD) risk
into five categories — No Disease, Low Risk, Moderate Risk, High Risk, and
Severe Disease — from 42 patient health inputs (demographics, blood/kidney
tests, urine tests, and medical history).

> **Disclaimer:** This is an academic machine-learning project. Predictions
> are not a medical diagnosis and are not a substitute for professional
> medical advice.

## How it works

```
React Frontend  →  Flask API  →  Random Forest model  →  Flask API  →  React Frontend
 (42 inputs)        (preprocess,        (predict)          (JSON result)
                      encode, scale)
```

The frontend collects the 42 inputs and sends them to a Flask backend, which
encodes categorical fields with the same `LabelEncoder`s used in training,
scales the full feature vector with the same fitted `StandardScaler`, runs
the trained Random Forest, and returns the predicted risk class.

## Project structure

```
clear-path-ckd/
│
├── src/                        # React frontend (Vite + TanStack Router + shadcn/ui)
│   └── lib/
│       ├── ckd-fields.ts       # All 42 input field definitions
│       └── ckd-predict.ts      # Calls the Flask API
│
└── backend/
    ├── app.py                  # Flask API
    ├── requirements.txt
    ├── model/
    │   └── ckd_model.pkl       # Trained RandomForestClassifier
    └── preprocessing/
        ├── encoders.pkl        # Per-column LabelEncoders (dict)
        ├── scaler.pkl          # Fitted StandardScaler
        └── target_encoder.pkl  # Encoder for the target class labels
```

## Running it locally

**Backend:**
```bash
cd backend
pip install -r requirements.txt
python app.py
```
Starts the API at `http://localhost:5000`. Check it's alive with:
```bash
curl http://localhost:5000/health
```

**Frontend:**
```bash
npm install
npm run dev
```
Starts the React app (address printed in the terminal) and calls the Flask
API at `http://localhost:5000` by default. Set `VITE_API_URL` in a `.env`
file to point elsewhere (e.g. a deployed backend).

## API

`POST /predict` — body is a JSON object keyed by the frontend field names in
`ckd-fields.ts`. Returns:
```json
{ "prediction": "Moderate_Risk" }
```

## Model

- **Algorithm:** Random Forest (300 trees, `class_weight="balanced"`)
- **Dataset:** 20,538 records, 42 features, 5 target classes
- **Preprocessing:** per-column `LabelEncoder` for categorical fields, then
  `StandardScaler` on the full encoded feature set

**Note on reliability:** class imbalance in the dataset (~80% No Disease)
means the model's raw accuracy is not a meaningful measure of performance —
a classifier that always predicts "No Disease" scores similarly. Minority
classes (High Risk, Severe Disease in particular) have low recall even after
testing class weighting, a hierarchical two-stage approach, feature scaling,
and SMOTE. See the accompanying project report for the full evaluation.
For this reason, predictions are presented as an experimental research
output, not a diagnostic result.

## Known limitations / TODO

- The trained model uses a single combined blood-pressure feature; the
  frontend currently collects systolic and diastolic separately, and only
  systolic is forwarded to the model. This should be reconciled.
