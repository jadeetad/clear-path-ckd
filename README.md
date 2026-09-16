# CKD Risk Predictor

1. Main frontend screens

You don't need a huge application. A clean ML prediction app can have 3–4 main areas:

A. Landing / Home page

Purpose: briefly explain the application.

Include:

 Project name

 Short description

 "Predict CKD Risk" button

 Brief explanation that this is an ML-based prediction system

 Disclaimer that it is not a medical diagnosis

Example:

Chronic Kidney Disease Risk Predictor
Enter patient health information to receive a machine-learning-based risk classification.

B. Prediction form — the most important part

This is where the user enters the patient information.

Your dataset has 42 input features, so the frontend needs to accommodate all 42.

However, do not make it one giant wall of 42 fields.

I'd divide them into logical sections.

🧑 Patient Information

 Age of the patient

 Blood pressure

🧪 Blood / Kidney Tests

 Random blood glucose level

 Blood urea

 Serum creatinine

 Sodium level

 Potassium level

 Hemoglobin level

 Packed cell volume

 White blood cell count

 Red blood cell count

 eGFR

 Cystatin C

 C-reactive protein (CRP)

 Interleukin-6 (IL-6)

 Parathyroid hormone (PTH)

 Serum calcium

 Serum phosphate

 Serum albumin

 Cholesterol

🧪 Urine Tests

 Specific gravity of urine

 Albumin in urine

 Sugar in urine

 Urine protein-to-creatinine ratio

 Urine output

 Red blood cells in urine

 Pus cells in urine

 Pus cell clumps in urine

 Bacteria in urine

 Urinary sediment microscopy results

🩺 Medical History

 Hypertension

 Diabetes mellitus

 Coronary artery disease

 Duration of diabetes mellitus

 Duration of hypertension

 Family history of chronic kidney disease

 Smoking status

 Physical activity level

🩸 Other

 Appetite

 Pedal edema

 Anemia

That gives you your 42 model inputs without making the interface feel chaotic.

2. Use the correct input controls

This is important.

Don't make every field a plain text box.

Numeric values → number inputs

For example:

Age                    [ 45       ]
Blood pressure         [ 130      ]
Serum creatinine       [ 1.2      ]
eGFR                   [ 85       ]

Yes/no values → dropdown or radio buttons

For:

 Hypertension

 Diabetes mellitus

 Coronary artery disease

 Pedal edema

 Anemia

 Family history of CKD

Use:

Hypertension

○ Yes
○ No

or a dropdown.

Binary urine findings

For:

 Red blood cells

 Pus cells

 Pus cell clumps

 Bacteria

Use:

Red blood cells
[ Normal ▼ ]

with:

 Normal

 Abnormal

Physical activity

Use:

Physical activity
[ Moderate ▼ ]

with whatever exact categories exist in your dataset.

Smoking

Use the exact categories in your dataset rather than inventing new ones.

3. Form validation

Before sending anything to the model, the frontend should check that:

 Required fields aren't empty

 Numeric fields actually contain numbers

 Values aren't obviously invalid

 Dropdown fields have a selected value

For example:

Age
[              ]

⚠ Please enter the patient's age.

You don't want the user submitting an empty form and getting a cryptic backend error.

4. Prediction button

At the bottom:

Predict CKD Risk

When clicked:

[ Predict CKD Risk ]
        ↓
   Processing...
        ↓
    Prediction

You should have a loading state so the user knows something is happening.

5. Results page/card

This is the second most important part.

After prediction, show something like:

Prediction Result

Predicted Risk Category

Moderate Risk

You could also display:

 Predicted class

 Model confidence/probability, if we decide to expose it

 A short explanation

 Date/time of prediction

 "New Prediction" button

For example:

┌─────────────────────────────┐
│       Prediction Result     │
│                             │
│       MODERATE RISK         │
│                             │
│  Based on the information   │
│  provided, the model has    │
│  classified this case as    │
│  Moderate Risk.             │
│                             │
│  [ New Prediction ]         │
└─────────────────────────────┘

Because our current model has poor minority-class performance, I would not emphasize a confidence percentage yet. We can decide that after we finish the model evaluation.

6. Medical disclaimer

This should be visible on the results screen and probably the home page.

Something along the lines of:

Disclaimer: This application is an educational machine-learning project. Its predictions are not a medical diagnosis and should not be used as a substitute for professional medical advice.

That's especially important because this is dealing with health-related predictions.

7. Navigation

Keep it simple.

Something like:

CKD Predictor

Home
Predict
About

You don't need authentication, dashboards, profiles, or accounts unless your project requirements specifically call for them.

8. About / Project information

Since this is an academic project, an About section would be useful.

Include:

About the project

 Problem being addressed

 Dataset

 Machine-learning algorithm

 Input features

 Target classes

 Brief explanation of the model

Your five target classes:

No Disease
Low Risk
Moderate Risk
High Risk
Severe Disease

You can also have a small "How it works" section:

Patient Information
        ↓
Data Preprocessing
        ↓
Random Forest Model
        ↓
Risk Classification

9. Responsive design

Make sure it works on:

 💻 Desktop

 📱 Mobile

 📱 Tablet

Your form especially needs to work well on a phone.

On desktop, you could have two columns:

Age                    Blood Pressure
[       ]              [       ]

Serum Creatinine       Blood Urea
[       ]              [       ]

On mobile, it becomes:

Age
[       ]

Blood Pressure
[       ]

Serum Creatinine
[       ]

10. Frontend ↔ ML integration

This part won't be visible to the user, but it's one of your actual requirements.

Eventually you'll have:

React Frontend
      ↓
POST patient data
      ↓
Python Backend/API
      ↓
Preprocessing
      ↓
Random Forest
      ↓
Prediction
      ↓
JSON response
      ↓
React Result Card

For example, the frontend might send:

{
    age: 45,
    blood_pressure: 130,
    serum_creatinine: 1.2,
    blood_urea: 40,
    ...
}

The backend feeds those values into the model and returns something like:

{
    "prediction": "Moderate_Risk"
}

Your frontend checklist

So, if we turn everything into an actual project checklist:

Essential

 Home page

 Prediction form

 All 42 model inputs

 Logical grouping of fields

 Appropriate input controls

 Form validation

 Loading state

 Prediction result screen/card

 New Prediction button

 Medical disclaimer

 Responsive design

 Backend/API connection

Good additions

 About project page

 "How it works" section

 Model information

 Target-class explanation

 Clean error messages

 Reset form button

Don't need yet

 ❌ Login/signup

 ❌ User accounts

 ❌ Admin dashboard

 ❌ Payment

 ❌ Chatbot

 ❌ Complex database

 ❌ Patient history system

 ❌ Fancy analytics dashboard

Those would add complexity without helping you demonstrate the actual ML project.

The most important thing before we start coding the UI is that the frontend's 42 fields must correspond exactly to the features and encoding the trained model expects. So our next step should be to create a definitive 42-field frontend specification—field name, input type, allowed values, and the value that needs to be sent to the Python model.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://clear-path-ckd.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1497f84b-f1e3-4b34-9b2c-89a79e484984).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
