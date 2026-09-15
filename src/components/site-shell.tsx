import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

function NavLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="rounded-full px-4 py-1.5 text-sm font-medium text-ink/55 transition hover:text-ink"
      activeProps={{
        className:
          "rounded-full bg-brand px-4 py-1.5 text-sm font-semibold text-primary-foreground shadow-[0_6px_18px_oklch(0.503_0.077_202.5/0.35)]",
      }}
      activeOptions={{ exact: to === "/" }}
    >
      {children}
    </Link>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-surface text-ink">
      <div className="pointer-events-none absolute -top-24 -left-24 size-[420px] rounded-full bg-brand/15 blur-3xl anim-a" />
      <div className="pointer-events-none absolute top-40 -right-32 size-[460px] rounded-full bg-accent/20 blur-3xl anim-b" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 size-[380px] rounded-full bg-brand/10 blur-3xl anim-c" />

      <header className="relative z-20">
        <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-5 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-card/70 shadow-[0_8px_30px_oklch(0.503_0.077_202.5/0.18)] ring-1 ring-card/60 backdrop-blur-xl">
              <span className="size-3.5 rounded-[4px] bg-brand" />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">RenalSense</span>
          </Link>
          <div className="flex items-center gap-1 rounded-full bg-card/50 p-1 shadow-sm ring-1 ring-card/60 backdrop-blur-xl">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/predict">Predict</NavLink>
            <NavLink to="/about">About</NavLink>
          </div>
        </nav>
      </header>

      <main className="relative z-10">{children}</main>

      <footer className="relative z-10 mx-auto max-w-6xl px-5 pb-10 text-xs text-ink/45 sm:px-6">
        RenalSense — educational machine-learning project. Not a medical device.
      </footer>
    </div>
  );
}

export function Disclaimer({ className = "" }: { className?: string }) {
  return (
    <p
      className={`rounded-2xl bg-accent/12 px-4 py-3 text-xs leading-relaxed text-brand-deep ring-1 ring-accent/30 ${className}`}
    >
      <span className="font-semibold">Disclaimer:</span> This is an educational
      machine-learning project. Predictions are not a medical diagnosis and are not a
      substitute for professional medical advice.
    </p>
  );
}
