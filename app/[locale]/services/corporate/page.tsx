import { Button } from "@/components/ui/button";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { Link } from "@/i18n/routing";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarClock,
  Presentation,
  UtensilsCrossed,
  Users,
} from "lucide-react";

const highlights = [
  {
    title: "Executive Ready Menus",
    description: "Balanced pacing for breakfast briefings, lunch workshops, and evening receptions.",
    icon: UtensilsCrossed,
  },
  {
    title: "Operational Precision",
    description: "Arrival windows, service cadence, and cleanup are aligned to your run-of-show.",
    icon: CalendarClock,
  },
  {
    title: "Brand-Aligned Delivery",
    description: "Service presentation can match company standards and event identity.",
    icon: Presentation,
  },
];

const formats = [
  "Board meetings and leadership offsites",
  "Product launches and media previews",
  "Client appreciation dinners",
  "Annual parties and end-of-year gatherings",
];

const process = [
  {
    step: "01",
    title: "Event Brief",
    description: "We align on event goals, guest profile, dietary needs, and venue constraints.",
  },
  {
    step: "02",
    title: "Menu and Flow Design",
    description: "Our team builds a menu and service plan that fits your timeline minute-by-minute.",
  },
  {
    step: "03",
    title: "Execution",
    description: "Dedicated coordinators manage setup, active service, and close-out without disruption.",
  },
];

export default function CorporateServicePage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#1f3b67_0%,#0f1f39_45%,#081222_100%)] text-slate-100">
      <Navbar trimmed />
      <main className="container mx-auto px-6 pt-28 pb-20 space-y-16">
        <Button asChild variant="ghost" className="text-slate-200 hover:bg-white/10">
          <Link href="/#services">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to services
          </Link>
        </Button>

        <section className="grid gap-10 rounded-3xl border border-blue-200/25 bg-[#0e213d]/75 p-8 md:grid-cols-[1.1fr_0.9fr] md:p-12">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-blue-200/30 bg-blue-200/15 px-4 py-1 text-xs uppercase tracking-[0.2em] text-blue-100">
              <BriefcaseBusiness className="h-4 w-4" />
              Corporate Catering
            </p>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              Business events with polished culinary execution.
            </h1>
            <p className="max-w-xl text-slate-200/90">
              From private leadership dinners to high-volume company functions, this service is built
              for reliability, speed, and premium guest experience.
            </p>
            <Button asChild className="bg-blue-200 text-[#0b1a33] hover:bg-blue-100">
              <Link href="/profile">Start booking consultation</Link>
            </Button>
          </div>
          <div className="relative min-h-72 overflow-hidden rounded-2xl border border-blue-100/25">
            <img src="/event-corporate.png" alt="Corporate catering service" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#081222]/90 via-[#081222]/35 to-transparent" />
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {highlights.map((item) => (
            <article key={item.title} className="rounded-2xl border border-blue-200/20 bg-[#12284b]/70 p-6">
              <item.icon className="mb-4 h-6 w-6 text-blue-200" />
              <h2 className="mb-2 text-xl font-semibold">{item.title}</h2>
              <p className="text-sm text-slate-200/85">{item.description}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-blue-200/20 bg-[#0e213d]/70 p-7">
            <h2 className="mb-4 text-2xl font-semibold">Best fit for</h2>
            <ul className="space-y-3 text-sm text-slate-200/90">
              {formats.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Users className="mt-0.5 h-4 w-4 text-blue-200" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-blue-200/20 bg-[#0e213d]/70 p-7">
            <h2 className="mb-4 text-2xl font-semibold">Delivery framework</h2>
            <div className="space-y-4">
              {process.map((item) => (
                <div key={item.step} className="rounded-xl border border-blue-200/20 bg-[#12284b]/70 p-4">
                  <p className="text-xs tracking-[0.18em] text-blue-200">{item.step}</p>
                  <h3 className="text-lg font-medium">{item.title}</h3>
                  <p className="text-sm text-slate-200/85">{item.description}</p>
                </div>
              ))}
            </div>
          </article>
        </section>
      </main>
      <Footer />
    </div>
  );
}
