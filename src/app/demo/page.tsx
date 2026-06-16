import { PracticeConsole } from "@/components/practice/practice-console";
import { SiteHeader } from "@/components/layout/site-header";

export default function DemoPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm uppercase tracking-[0.2em] text-primary">Free demo</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal text-foreground">
            Try one scored answer before login.
          </h1>
          <p className="mt-4 text-muted-foreground">
            The demo gives one complete feedback cycle. Create an account to save
            history, dashboards, reports, streaks, and salary practice.
          </p>
        </div>
        <PracticeConsole demo />
      </main>
    </div>
  );
}

