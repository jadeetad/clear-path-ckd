import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell, Disclaimer } from "@/components/site-shell";
import {
  FIELDS,
  SECTIONS,
  FIELD_COUNT,
  emptyValues,
  validate,
  type CkdField,
  type FormValues,
} from "@/lib/ckd-fields";
import { predict, RISK_CLASSES, type PredictionResult } from "@/lib/ckd-predict";

export const Route = createFileRoute("/predict")({
  head: () => ({
    meta: [
      { title: "Predict CKD Risk — RenalSense" },
      {
        name: "description",
        content:
          "Enter the 42 patient values — blood, urine, history and clinical findings — to receive a machine-learning CKD risk classification.",
      },
      { property: "og:title", content: "Predict CKD Risk — RenalSense" },
      {
        property: "og:description",
        content:
          "Enter the 42 patient values — blood, urine, history and clinical findings — to receive a machine-learning CKD risk classification.",
      },
    ],
  }),
  component: Predict,
});

const RISK_BAR = ["bg-risk-0", "bg-risk-1", "bg-risk-2", "bg-risk-3", "bg-risk-4"];
const RISK_TEXT = [
  "text-risk-0",
  "text-risk-1",
  "text-risk-2",
  "text-risk-3",
  "text-risk-4",
];

const inputClass =
  "mt-1.5 w-full rounded-xl border-0 bg-surface/80 px-4 py-2.5 text-sm text-ink shadow-inner ring-1 ring-line placeholder:text-ink/30 focus:ring-2 focus:ring-brand focus:outline-none";

function Field({
  field,
  value,
  error,
  onChange,
}: {
  field: CkdField;
  value: string;
  error?: string;
  onChange: (v: string) => void;
}) {
  const describedBy = error ? `${field.key}-error` : undefined;
  return (
    <div>
      <label htmlFor={field.key} className="block text-sm font-medium text-ink/70">
        {field.label}
        {field.type === "number" && field.unit ? (
          <span className="ml-1 text-ink/40">({field.unit})</span>
        ) : null}
      </label>

      {field.type === "number" ? (
        <input
          id={field.key}
          type="number"
          inputMode="decimal"
          step={field.step}
          min={field.min}
          max={field.max}
          placeholder={field.placeholder}
          value={value}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} ${error ? "ring-2 ring-destructive" : ""}`}
        />
      ) : field.type === "radio" ? (
        <div className="mt-2 flex flex-wrap gap-4" role="radiogroup" aria-label={field.label}>
          {field.options.map((o) => (
            <label key={o.value} className="flex items-center gap-2 text-sm text-ink/70">
              <input
                type="radio"
                name={field.key}
                value={o.value}
                checked={value === o.value}
                onChange={() => onChange(o.value)}
                className="size-4 accent-[var(--brand)]"
              />
              {o.label}
            </label>
          ))}
        </div>
      ) : (
        <select
          id={field.key}
          value={value}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} ${error ? "ring-2 ring-destructive" : ""}`}
        >
          <option value="">Select…</option>
          {field.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}

      {error ? (
        <p id={describedBy} className="mt-1.5 text-xs font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function ResultCard({
  result,
  onReset,
}: {
  result: PredictionResult;
  onReset: () => void;
}) {
  return (
    <div className="rounded-3xl bg-card/55 p-6 shadow-[0_30px_80px_-20px_oklch(0.376_0.058_204.6/0.45)] ring-1 ring-card/60 backdrop-blur-2xl">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-ink/45">
          Prediction Result
        </span>
        <span className="rounded-full bg-card/70 px-3 py-1 text-[11px] font-medium text-ink/50 ring-1 ring-card/60">
          {result.timestamp}
        </span>
      </div>
      <div className="mt-5 rounded-2xl bg-gradient-to-br from-brand/10 to-accent/10 p-6 ring-1 ring-card/50">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-ink/50">
          Predicted Risk Category
        </p>
        <p className="font-display mt-1 text-4xl font-semibold tracking-tight text-brand-deep">
          {result.prediction}
        </p>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-card/60">
          <div
            className={`h-full rounded-full ${RISK_BAR[result.index]}`}
            style={{ width: `${(result.index + 1) * 20}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[11px] font-medium text-ink/45">
          {RISK_CLASSES.map((c, i) => (
            <span key={c} className={i === result.index ? RISK_TEXT[i] : undefined}>
              {c.replace(" Risk", "").replace(" Disease", "")}
            </span>
          ))}
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-ink/65">{result.explanation}</p>
      <button
        type="button"
        onClick={onReset}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-card px-5 py-3 text-sm font-semibold text-brand-deep ring-1 ring-brand/20 transition hover:bg-brand/5"
      >
        New Prediction
      </button>
      <Disclaimer className="mt-5" />
    </div>
  );
}

function Predict() {
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [failed, setFailed] = useState<string | null>(null);

  const setValue = (key: string, v: string) => {
    setValues((prev) => ({ ...prev, [key]: v }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const resetForm = () => {
    setValues(emptyValues());
    setErrors({});
    setResult(null);
    setFailed(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFailed(null);
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const first = FIELDS.find((f) => found[f.key]);
      if (first) {
        document.getElementById(first.key)?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    setLoading(true);
    try {
      const r = await predict(values);
      setResult(r);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setFailed("The prediction could not be completed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const errorCount = Object.keys(errors).length;

  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-5 pt-6 pb-16 sm:px-6">
        {result ? (
          <div className="mx-auto max-w-xl">
            <ResultCard result={result} onReset={resetForm} />
          </div>
        ) : (
          <div className="rounded-3xl bg-card/50 p-6 shadow-[0_20px_60px_-24px_oklch(0.376_0.058_204.6/0.4)] ring-1 ring-card/60 backdrop-blur-2xl sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-ink/45">
                  Prediction Form
                </p>
                <h1 className="font-display mt-1 text-2xl font-semibold tracking-tight">
                  Patient data, grouped &amp; validated
                </h1>
              </div>
              <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand-deep">
                {FIELD_COUNT} model inputs
              </span>
            </div>

            {errorCount > 0 ? (
              <p className="mt-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive ring-1 ring-destructive/20">
                {errorCount} field{errorCount > 1 ? "s need" : " needs"} attention before the
                prediction can run.
              </p>
            ) : null}
            {failed ? (
              <p className="mt-4 rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive ring-1 ring-destructive/20">
                {failed}
              </p>
            ) : null}

            <form onSubmit={onSubmit} noValidate>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {SECTIONS.map((section) => (
                  <div
                    key={section.id}
                    className="rounded-2xl bg-card/60 p-5 ring-1 ring-card/60"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-deep">
                      {section.title}
                    </p>
                    <p className="mt-1 text-[11px] text-ink/45">{section.caption}</p>
                    <div className="mt-4 grid gap-4">
                      {FIELDS.filter((f) => f.section === section.id).map((field) => (
                        <Field
                          key={field.key}
                          field={field}
                          value={values[field.key] ?? ""}
                          error={errors[field.key]}
                          onChange={(v) => setValue(field.key, v)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_12px_30px_oklch(0.503_0.077_202.5/0.35)] transition hover:bg-brand-deep disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <span className="size-3.5 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />
                      Processing…
                    </>
                  ) : (
                    "Predict CKD Risk"
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center gap-2 rounded-full bg-card/60 px-5 py-3 text-sm font-semibold text-ink ring-1 ring-line transition hover:bg-card/80"
                >
                  Reset form
                </button>
                <span className="text-xs text-ink/45">
                  All fields validated before submission.
                </span>
              </div>
            </form>

            <Disclaimer className="mt-6" />
          </div>
        )}
      </section>
    </SiteShell>
  );
}
