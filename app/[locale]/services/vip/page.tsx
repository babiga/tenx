import { Button } from "@/components/ui/button";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { Link } from "@/i18n/routing";
import {
  ArrowLeft,
  Crown,
  Gem,
  ShieldCheck,
  Sparkles,
  Stars,
  Wine,
} from "lucide-react";

const pillars = [
  {
    title: "Rare Ingredient Sourcing",
    description: "Ingredient strategy is curated per guest profile and event narrative.",
    icon: Gem,
  },
  {
    title: "White-Glove Service",
    description: "Senior service teams execute discreetly with VIP treatment standards.",
    icon: ShieldCheck,
  },
  {
    title: "Concierge Control",
    description: "One lead point-of-contact coordinates all culinary and service decisions.",
    icon: Sparkles,
  },
];

const signatureMoments = [
  "Chef-led tasting arc before final event signoff",
  "Sommelier-ready pairings for each menu movement",
  "Table-side finishing and guest-by-guest personalization",
  "Real-time pacing control for high-visibility moments",
];

export default function VipServicePage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#40351f_0%,#1f1a11_45%,#0b0906_100%)] text-amber-50">
      <Navbar trimmed />
      <main className="container mx-auto px-6 pt-28 pb-20 space-y-16">
        <Button asChild variant="ghost" className="text-amber-100 hover:bg-amber-100/10">
          <Link href="/#services">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to services
          </Link>
        </Button>

        <section className="grid gap-8 rounded-3xl border border-amber-200/25 bg-[#17130d]/80 p-8 md:grid-cols-[1fr_1fr] md:p-12">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-amber-200/30 bg-amber-200/15 px-4 py-1 text-xs uppercase tracking-[0.2em] text-amber-100">
              <Crown className="h-4 w-4" />
              VIP Premiere
            </p>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              Bespoke service for high-stakes and high-visibility events.
            </h1>
            <p className="max-w-xl text-amber-50/85">
              VIP is engineered for hosts who need precision, discretion, and unmistakable quality at
              every touchpoint from first briefing to final guest departure.
            </p>
            <Button asChild className="bg-amber-200 text-[#1f1a11] hover:bg-amber-100">
              <Link href="/profile">Request VIP consultation</Link>
            </Button>
          </div>
          <div className="relative min-h-72 overflow-hidden rounded-2xl border border-amber-100/25">
            <img src="/hero-food.png" alt="VIP catering service" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0906]/90 via-[#1f1a11]/40 to-transparent" />
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {pillars.map((item) => (
            <article key={item.title} className="rounded-2xl border border-amber-200/20 bg-[#1f1a11]/75 p-6">
              <item.icon className="mb-4 h-6 w-6 text-amber-200" />
              <h2 className="mb-2 text-xl font-semibold">{item.title}</h2>
              <p className="text-sm text-amber-50/80">{item.description}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 md:grid-cols-[1.05fr_0.95fr]">
          <article className="rounded-2xl border border-amber-200/20 bg-[#17130d]/80 p-7">
            <h2 className="mb-5 flex items-center gap-2 text-2xl font-semibold">
              <Stars className="h-5 w-5 text-amber-200" />
              Signature moments
            </h2>
            <ul className="space-y-3 text-sm text-amber-50/80">
              {signatureMoments.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Wine className="mt-0.5 h-4 w-4 text-amber-200" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-amber-200/20 bg-[#1f1a11]/80 p-7">
            <h2 className="mb-4 text-2xl font-semibold">Service cadence</h2>
            <div className="space-y-3">
              <div className="rounded-xl border border-amber-200/20 bg-[#17130d]/80 p-4 text-sm text-amber-50/80">
                Discovery and preference mapping with host or EA team.
              </div>
              <div className="rounded-xl border border-amber-200/20 bg-[#17130d]/80 p-4 text-sm text-amber-50/80">
                Bespoke menu architecture and sensory presentation planning.
              </div>
              <div className="rounded-xl border border-amber-200/20 bg-[#17130d]/80 p-4 text-sm text-amber-50/80">
                Real-time white-glove execution and discreet oversight.
              </div>
            </div>
          </article>
        </section>
      </main>
      <Footer />
    </div>
  );
}
