import { Button } from "@/components/ui/button";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { Link } from "@/i18n/routing";
import { ArrowLeft, Clock3, Flower2, Heart, Sparkles, Utensils } from "lucide-react";

const timeline = [
  {
    title: "Welcome Reception",
    description: "Passed bites and drinks during guest arrival and photo session.",
  },
  {
    title: "Main Celebration Dining",
    description: "Plated or shared-service dinner paced around speeches and rituals.",
  },
  {
    title: "Late Celebration Service",
    description: "Light comfort selections and desserts for the final part of the night.",
  },
];

const signatures = [
  "Couple-led tasting and menu refinement session",
  "Dedicated wedding service captain and ceremony timing sync",
  "Dietary-aware guest management for seated plans",
  "Dessert and toast choreography with venue coordination",
];

export default function WeddingServicePage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f6ecdc_0%,#eadcc9_45%,#dbc8af_100%)] text-stone-900">
      <Navbar trimmed />
      <main className="container mx-auto px-6 pt-28 pb-20 space-y-16">
        <Button asChild variant="ghost" className="text-stone-700 hover:bg-stone-900/5">
          <Link href="/#services">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to services
          </Link>
        </Button>

        <section className="grid gap-8 rounded-3xl border border-[#d7c2a6] bg-[#fffaf1]/90 p-8 md:grid-cols-[1.1fr_0.9fr] md:p-12">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#ccb08f] bg-[#f5e8d6] px-4 py-1 text-xs uppercase tracking-[0.2em] text-[#6f4d2f]">
              <Heart className="h-4 w-4" />
              Wedding Catering
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-[#4a3221] md:text-5xl">
              Romantic, warm service for your most important day.
            </h1>
            <p className="max-w-xl text-[#6f4d2f]">
              This page is intentionally beige and soft-toned to match wedding styling. Every service detail
              is planned around ceremony flow, emotional moments, and elegant guest comfort.
            </p>
            <Button asChild className="bg-[#8a5b35] text-amber-50 hover:bg-[#764c2d]">
              <Link href="/profile">Plan wedding menu</Link>
            </Button>
          </div>

          <div className="relative min-h-72 overflow-hidden rounded-2xl border border-[#d7c2a6]">
            <img src="/service-wedding.png" alt="Wedding catering service" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#4f3d2f]/65 via-[#8f765c]/30 to-transparent" />
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-[1fr_1fr]">
          <article className="rounded-2xl border border-[#d7c2a6] bg-[#fff8ee]/95 p-7">
            <h2 className="mb-5 flex items-center gap-2 text-2xl font-semibold text-[#4a3221]">
              <Sparkles className="h-5 w-5 text-[#8a5b35]" />
              Signature inclusions
            </h2>
            <ul className="space-y-3 text-sm text-[#6f4d2f]">
              {signatures.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Flower2 className="mt-0.5 h-4 w-4 text-[#8a5b35]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-[#d7c2a6] bg-[#f4eadc]/95 p-7">
            <h2 className="mb-5 flex items-center gap-2 text-2xl font-semibold text-[#4a3221]">
              <Clock3 className="h-5 w-5 text-[#8a5b35]" />
              Celebration timeline
            </h2>
            <div className="space-y-3">
              {timeline.map((item) => (
                <div key={item.title} className="rounded-xl border border-[#d7c2a6] bg-[#fffaf1]/90 p-4">
                  <h3 className="text-lg font-medium text-[#4a3221]">{item.title}</h3>
                  <p className="text-sm text-[#6f4d2f]">{item.description}</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="rounded-2xl border border-[#d7c2a6] bg-[#fffaf1]/95 p-7">
          <h2 className="mb-3 flex items-center gap-2 text-2xl font-semibold text-[#4a3221]">
            <Utensils className="h-5 w-5 text-[#8a5b35]" />
            Menu direction
          </h2>
          <p className="text-sm leading-relaxed text-[#6f4d2f]">
            Couples typically choose a blend of plated elegance and interactive stations so formal moments
            feel refined while social moments remain lively and personal.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
