import Link from "next/link";
import {
  BarChart3,
  FileSearch,
  GraduationCap,
  LayoutDashboard,
  Settings,
  Trophy,
  WalletCards
} from "lucide-react";

import { BrandMark } from "@/components/brand/brand-mark";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/practice", label: "Practice", icon: GraduationCap },
  { href: "/resume-match", label: "Resume Match", icon: FileSearch },
  { href: "/salary-practice", label: "Salary", icon: WalletCards },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/leaderboard", label: "Streaks", icon: Trophy },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-white/10 bg-slate-950/88 p-5 backdrop-blur-xl lg:block">
        <BrandMark />
        <nav className="mt-10 space-y-1.5">
          {navItems.map((item) => (
            <Link
              href={item.href}
              key={item.href}
              className="flex items-center gap-3 rounded-md border border-transparent px-3 py-3 text-sm font-medium text-muted-foreground transition hover:border-white/10 hover:bg-white/[0.045] hover:text-foreground"
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-5 left-5 right-5 rounded-lg border border-primary/20 bg-primary/[0.07] p-4">
          <p className="text-sm font-medium text-foreground">Premium-ready</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Unlimited interviews, deeper reports, certificates, and voice analytics
            are planned behind usage gates.
          </p>
          <Button asChild size="sm" className="mt-4 w-full">
            <Link href="/settings">View plan</Link>
          </Button>
        </div>
      </aside>
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/86 px-4 py-3 backdrop-blur-xl lg:hidden">
        <BrandMark />
      </header>
      <main className="lg:pl-72">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}

