# RenalSense — CKD Risk Classifier

I built RenalSense as a machine-learning project to classify chronic kidney
disease (CKD) risk into five categories — No Disease, Low Risk, Moderate
Risk, High Risk, and Severe Disease — based on 42 patient health inputs
covering demographics, blood/kidney tests, urine tests, and medical history.

> **Disclaimer:** This is an academic machine-learning project. Predictions
> are not a medical diagnosis and are not a substitute for professional
> medical advice.

## How it works

```
React Frontend  →  Flask API  →  Random Forest model  →  Flask API  →  React Frontend
 (42 inputs)        (preprocess,        (predict)          (JSON result)
                      encode, scale)
```

The React frontend collects the 42 inputs and sends them to a Flask backend
I wrote, which encodes categorical fields with the same `LabelEncoder`s used
during training, scales the full feature vector with the same fitted
`StandardScaler`, runs the trained Random Forest, and returns the predicted
risk class.

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

## Running it yourself

If you want to run this locally, here's the setup I use:

**Backend:**
```bash
cd backend
pip install -r requirements.txt
python app.py
```
This starts the API at `http://localhost:5000`. You can check it's alive with:
```bash
curl http://localhost:5000/health
```

**Frontend:**
```bash
npm install
npm run dev
```
This starts the React app (the terminal will print the local address) and
points it at the Flask API on `http://localhost:5000` by default. If you
deploy the backend elsewhere, set `VITE_API_URL` in a `.env` file to point
to that instead.

## API

`POST /predict` — send a JSON object keyed by the frontend field names in
`ckd-fields.ts`. You'll get back:
```json
{ "prediction": "Moderate_Risk" }
```

## About the model

- **Algorithm:** Random Forest (300 trees, `class_weight="balanced"`)
- **Dataset:** 20,538 records, 42 features, 5 target classes
- **Preprocessing:** a per-column `LabelEncoder` for categorical fields,
  then a `StandardScaler` across the full encoded feature set

**A note on how reliable this actually is:** the dataset is heavily
imbalanced (~80% No Disease), so raw accuracy isn't a meaningful way to
judge this model — a classifier that always predicts "No Disease" scores
about the same. I tested class weighting, a hierarchical two-stage
approach, feature scaling, and SMOTE, and minority classes (especially
High Risk and Severe Disease) still came out with low recall. The full
evaluation is in my project report. Because of this, I'm presenting
RenalSense's output as an experimental research result, not something
that should be read as a diagnosis.

## What I'd still like to fix

- The model was trained on a single combined blood-pressure value, but the
  frontend currently collects systolic and diastolic separately — right
  now only systolic actually reaches the model. I want to reconcile this
  properly rather than leave it as a workaround.
