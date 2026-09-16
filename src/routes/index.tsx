import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell, Disclaimer } from "@/components/site-shell";
import { FIELD_COUNT } from "@/lib/ckd-fields";
import { RISK_CLASSES } from "@/lib/ckd-predict";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RenalSense — Chronic Kidney Disease Risk Predictor" },
      {
        name: "description",
        content:
          "Enter 42 patient health values and receive a machine-learning based chronic kidney disease risk classification across five bands.",
      },
      { property: "og:title", content: "RenalSense — Chronic Kidney Disease Risk Predictor" },
      {
        property: "og:description",
        content:
          "Enter 42 patient health values and receive a machine-learning based chronic kidney disease risk classification across five bands.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-6xl px-5 pt-10 pb-14 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-card/60 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-brand-deep ring-1 ring-card/60 backdrop-blur-xl">
              <span className="size-1.5 rounded-full bg-accent" /> ML-based risk classifier
            </span>
            <h1 className="font-display mt-5 text-5xl font-semibold leading-[1.03] tracking-tight text-ink sm:text-6xl">
              Predict Chronic Kidney Disease risk, with clarity.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-ink/65">
              Enter {FIELD_COUNT} patient health values across blood, urine and clinical
              history. A trained random-forest model returns a five-band risk
              classification.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to="/predict"
                className="group inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_12px_30px_oklch(0.52_0.115_252/0.35)] transition hover:bg-brand-deep"
              >
                Predict CKD Risk
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-full bg-card/60 px-5 py-3 text-sm font-semibold text-ink ring-1 ring-card/60 backdrop-blur-xl transition hover:bg-card/80"
              >
                How it works
              </Link>
            </div>
            <Disclaimer className="mt-6 max-w-md" />
          </div>

          <div className="relative">
            <div className="rounded-3xl bg-card/55 p-6 shadow-[0_30px_80px_-20px_oklch(0.4_0.09_258/0.45)] ring-1 ring-card/60 backdrop-blur-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-ink/45">
                  Example Result
                </span>
                <span className="rounded-full bg-card/70 px-3 py-1 text-[11px] font-medium text-ink/50 ring-1 ring-card/60">
                  Sample case
                </span>
              </div>
              <div className="mt-5 rounded-2xl bg-gradient-to-br from-brand/10 to-accent/10 p-6 ring-1 ring-card/50">
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-ink/50">
                  Predicted Risk Category
                </p>
                <p className="font-display mt-1 text-4xl font-semibold tracking-tight text-brand-deep">
                  Moderate Risk
                </p>
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-card/60">
                  <div className="h-full w-[52%] rounded-full bg-risk-2" />
                </div>
                <div className="mt-2 flex justify-between text-[11px] font-medium text-ink/45">
                  {RISK_CLASSES.map((c, i) => (
                    <span key={c} className={i === 2 ? "text-risk-2" : undefined}>
                      {c.replace(" Risk", "").replace(" Disease", "")}
                    </span>
                  ))}
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink/65">
                The model returns one of five classes, with a short explanation of what
                the submitted values indicate.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-card/60 p-3 ring-1 ring-card/60">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-ink/45">
                    Input features
                  </p>
                  <p className="font-display text-xl font-semibold text-ink">{FIELD_COUNT}</p>
                </div>
                <div className="rounded-xl bg-card/60 p-3 ring-1 ring-card/60">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-ink/45">
                    Target classes
                  </p>
                  <p className="font-display text-xl font-semibold text-ink">5</p>
                </div>
              </div>
              <Link
                to="/predict"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-card px-5 py-3 text-sm font-semibold text-brand-deep ring-1 ring-brand/20 transition hover:bg-brand/5"
              >
                Start a prediction
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
