import { Button } from "@/components/ui/button";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { Link } from "@/i18n/routing";
import { ArrowLeft, GlassWater, Sparkles, Users, Wine } from "lucide-react";

const touchpoints = [
  "Host-first menu workshop and atmosphere planning",
  "Flexible service format from plated to shared style",
  "Warm, discreet floor team for intimate guest flow",
  "Optional beverage pairing and signature welcome setup",
];

const moments = [
  {
    title: "Dinner Parties",
    description: "Refined multi-course experiences for small guest counts and close conversation.",
  },
  {
    title: "Milestone Celebrations",
    description: "Birthdays and anniversaries with expressive menus shaped around your story.",
  },
  {
    title: "Boutique Receptions",
    description: "Creative culinary layouts for curated homes, villas, and private spaces.",
  },
];

export default function PrivateServicePage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#50324f_0%,#2d1830_45%,#170d1b_100%)] text-rose-50">
      <Navbar trimmed />
      <main className="container mx-auto px-6 pt-28 pb-20 space-y-16">
        <Button asChild variant="ghost" className="text-rose-100 hover:bg-white/10">
          <Link href="/#services">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to services
          </Link>
        </Button>

        <section className="grid gap-8 rounded-3xl border border-rose-200/25 bg-[#2f1932]/70 p-8 md:grid-cols-[0.9fr_1.1fr] md:p-12">
          <div className="relative min-h-72 overflow-hidden rounded-2xl border border-rose-100/20">
            <img src="/service-private.png" alt="Private occasion service" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1b0d1f]/85 via-[#1b0d1f]/30 to-transparent" />
          </div>
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-rose-200/30 bg-rose-200/15 px-4 py-1 text-xs uppercase tracking-[0.2em] text-rose-100">
              <Sparkles className="h-4 w-4" />
              Private Occasions
            </p>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              Intimate events designed around your personal style.
            </h1>
            <p className="max-w-xl text-rose-100/85">
              Private service is built for comfort and character. Menus, pacing, and table presentation
              are tailored to your guests and setting so hosting feels effortless.
            </p>
            <Button asChild className="bg-rose-200 text-[#2b1230] hover:bg-rose-100">
              <Link href="/profile">Design my private event</Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-[1.05fr_0.95fr]">
          <article className="rounded-2xl border border-rose-200/25 bg-[#3a2040]/70 p-7">
            <h2 className="mb-5 text-2xl font-semibold">What is included</h2>
            <ul className="space-y-3 text-sm text-rose-50/85">
              {touchpoints.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <GlassWater className="mt-0.5 h-4 w-4 text-rose-200" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-2xl border border-rose-200/25 bg-[#2f1932]/70 p-7">
            <h2 className="mb-5 text-2xl font-semibold">Guest experience tone</h2>
            <div className="space-y-3 text-sm text-rose-50/85">
              <p className="rounded-xl border border-rose-200/20 bg-[#3a2040]/70 p-4">
                Service stays attentive without interrupting the flow of conversation.
              </p>
              <p className="rounded-xl border border-rose-200/20 bg-[#3a2040]/70 p-4">
                Course pacing adapts to your rhythm, from relaxed evenings to energetic celebrations.
              </p>
              <p className="rounded-xl border border-rose-200/20 bg-[#3a2040]/70 p-4">
                Tablescape and plating details are curated to reflect your host identity.
              </p>
            </div>
          </article>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {moments.map((item) => (
            <article key={item.title} className="rounded-2xl border border-rose-200/25 bg-[#2f1932]/70 p-6">
              <Wine className="mb-4 h-5 w-5 text-rose-200" />
              <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
              <p className="text-sm text-rose-50/85">{item.description}</p>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-rose-200/25 bg-[#3a2040]/70 p-7 text-sm text-rose-50/85">
          <p className="flex items-center gap-2 font-medium text-rose-100">
            <Users className="h-4 w-4" />
            Recommended guest range
          </p>
          <p className="mt-2">
            Best suited for 10-150 guests where detail-rich hospitality and personalized pacing matter most.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
