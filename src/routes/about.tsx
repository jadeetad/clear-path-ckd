import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, Disclaimer } from "@/components/site-shell";
import { FIELDS, SECTIONS, FIELD_COUNT } from "@/lib/ckd-fields";
import { RISK_CLASSES } from "@/lib/ckd-predict";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About the project — RenalSense" },
      {
        name: "description",
        content:
          "Problem, dataset, Random Forest model, 42 input features and the five CKD risk classes behind the RenalSense predictor.",
      },
      { property: "og:title", content: "About the project — RenalSense" },
      {
        property: "og:description",
        content:
          "Problem, dataset, Random Forest model, 42 input features and the five CKD risk classes behind the RenalSense predictor.",
      },
    ],
  }),
  component: About,
});

const CLASS_NOTES: Record<string, string> = {
  "No Disease": "No indicators of chronic kidney impairment in the submitted profile.",
  "Low Risk": "Mild deviations worth monitoring at routine follow-up.",
  "Moderate Risk": "Several markers outside expected ranges; clinician review advised.",
  "High Risk": "Substantially reduced kidney function across multiple markers.",
  "Severe Disease": "Profile consistent with advanced kidney impairment.",
};

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-card/60 p-5 ring-1 ring-card/60">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-deep">
        {title}
      </p>
      <div className="mt-3 text-sm leading-relaxed text-ink/70">{children}</div>
    </div>
  );
}

function About() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-5 pt-6 pb-16 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-ink/45">
          About the project
        </p>
        <h1 className="font-display mt-2 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
          A machine-learning study of chronic kidney disease staging.
        </h1>

        <div className="mt-8 rounded-3xl bg-card/50 p-6 shadow-[0_20px_60px_-24px_oklch(0.4_0.09_258/0.4)] ring-1 ring-card/60 backdrop-blur-2xl sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card title="Problem addressed">
              Chronic kidney disease often progresses silently until function is
              substantially lost. Routine laboratory panels already contain signals of
              early impairment; this project asks whether a supervised model can turn
              those signals into a staged risk classification.
            </Card>
            <Card title="Dataset">
              A tabular clinical dataset of patient records with {FIELD_COUNT} features —
              demographics, serum chemistry, haematology, urinalysis, comorbidity history
              and clinical observations — labelled with one of five CKD risk stages.
            </Card>
            <Card title="Machine-learning algorithm">
              A Random Forest classifier: an ensemble of decision trees trained on
              bootstrapped samples, with the majority vote as the predicted class. It
              handles mixed numeric and categorical inputs and is robust to outliers in
              laboratory values.
            </Card>
            <Card title="Model notes">
              Minority-class performance is still being evaluated, so confidence
              percentages are deliberately not shown. The interface reports the predicted
              class only.
            </Card>
          </div>

          <div className="mt-6 rounded-2xl bg-card/60 p-5 ring-1 ring-card/60">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-deep">
              How it works
            </p>
            <ol className="mt-4 grid gap-3 sm:grid-cols-4">
              {["Patient information", "Data preprocessing", "Random Forest model", "Risk classification"].map(
                (step, i) => (
                  <li
                    key={step}
                    className="rounded-xl bg-surface/80 p-4 text-sm font-medium text-ink ring-1 ring-line"
                  >
                    <span className="font-display block text-2xl font-semibold text-brand">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ),
              )}
            </ol>
          </div>

          <div className="mt-6 rounded-2xl bg-card/60 p-5 ring-1 ring-card/60">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-deep">
              Target classes
            </p>
            <ul className="mt-4 grid gap-2">
              {RISK_CLASSES.map((c, i) => (
                <li key={c} className="flex items-start gap-3 rounded-xl bg-surface/70 px-4 py-3">
                  <span
                    className={`mt-1.5 size-2.5 shrink-0 rounded-full ${
                      ["bg-risk-0", "bg-risk-1", "bg-risk-2", "bg-risk-3", "bg-risk-4"][i]
                    }`}
                  />
                  <span className="text-sm text-ink/70">
                    <span className="font-semibold text-ink">{c}</span> — {CLASS_NOTES[c]}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 rounded-2xl bg-card/60 p-5 ring-1 ring-card/60">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-deep">
              Input features ({FIELD_COUNT})
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SECTIONS.map((section) => (
                <div key={section.id}>
                  <p className="text-sm font-semibold text-ink">{section.title}</p>
                  <ul className="mt-1.5 space-y-1 text-[13px] text-ink/60">
                    {FIELDS.filter((f) => f.section === section.id).map((f) => (
                      <li key={f.key}>{f.label}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <Disclaimer className="mt-6" />
        </div>
      </section>
    </SiteShell>
  );
}
