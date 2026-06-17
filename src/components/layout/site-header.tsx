import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { BrandMark } from "@/components/brand/brand-mark";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/86 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <BrandMark />
        <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
          <Link className="transition hover:text-foreground" href="/demo">
            Demo
          </Link>
          <Link className="transition hover:text-foreground" href="/resume-match">
            Resume Match
          </Link>
          <Link className="transition hover:text-foreground" href="/salary-practice">
            Salary
          </Link>
          <Link className="transition hover:text-foreground" href="/dashboard">
            Dashboard
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/demo">
              Try demo
              <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

