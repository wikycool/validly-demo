"use client";

import { useView } from "@/lib/view-store";
import { SiteNav, WorkspaceNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { VerdictDemo } from "@/components/sections/verdict-demo";
import { Pricing } from "@/components/sections/pricing";
import { FinalCta } from "@/components/sections/final-cta";
import { Workspace } from "@/components/workspace/workspace";

export default function Home() {
  const view = useView((s) => s.view);

  if (view === "workspace") {
    return (
      <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background">
        <WorkspaceNav />
        <main className="relative flex-1">
          <Workspace />
        </main>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden">
      <SiteNav />

      <main className="relative flex-1">
        <Hero />
        <HowItWorks />
        <VerdictDemo />
        <Pricing />
        <FinalCta />
      </main>

      <SiteFooter />
    </div>
  );
}
