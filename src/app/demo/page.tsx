import { SiteHeader } from "@/components/layout/site-header";
import { PracticeConsole } from "@/components/practice/practice-console";
import { PageHeader } from "@/components/ui/page-header";

export default function DemoPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Free demo"
          title="Try one scored answer before login."
          description="The demo gives one complete feedback cycle. Create an account to save history, dashboards, reports, streaks, and salary practice."
        />
        <PracticeConsole demo />
      </main>
    </div>
  );
}
