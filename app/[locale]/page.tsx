import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import HowItWorks from "@/components/sections/HowItWorks";
import SignatureMenus from "@/components/sections/SignatureMenus";
import VIPSection from "@/components/sections/VIPSection";
import Chefs from "@/components/sections/Chefs";
import Events from "@/components/sections/Events";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const t = await getTranslations("Home");

  const [dbBanners, dbPartners, dbSocialLinks] = await Promise.all([
    prisma.siteContent.findMany({ where: { type: "BANNER", isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.siteContent.findMany({ where: { type: "PARTNER", isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.siteContent.findMany({ where: { type: "SOCIAL_LINK", isActive: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  const banners = dbBanners.map(b => ({
    id: b.id, title: b.title, subtitle: b.subtitle, imageUrl: b.imageUrl
  }));

  const partners = dbPartners.map(p => ({
    id: p.id, title: p.title, imageUrl: p.imageUrl
  }));

  const socialLinks = dbSocialLinks.map(s => ({
    id: s.id, title: s.title, link: s.link, icon: s.icon
  }));

  return (
    <div className="min-h-screen text-foreground overflow-x-hidden">
      <Navbar />
      <Hero banners={banners} />
      <Services />
      <HowItWorks />
      <SignatureMenus />
      <VIPSection />
      <Chefs />
      <Events />

      <section id="ctaSection" className="py-24 bg-white/5 border-y border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,hsl(222,40%,25%,0.3),transparent)]" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-serif mb-6 text-white">{t("ctaTitle")}</h2>
          <p className="text-muted-foreground mb-10 max-w-2xl mx-auto text-lg leading-relaxed">{t("ctaDescription")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary text-black hover:bg-white px-10 py-6 text-lg rounded-none transition-all btn-glow">
              {t("startJourney")}
            </Button>
            <Button size="lg" variant="outline" className="border-white/10 hover:border-primary px-10 py-6 text-lg rounded-none">
              {t("consultation")}
            </Button>
          </div>
        </div>
      </section>

      {partners.length > 0 ? (
        <div className="py-20 border-t border-white/5 overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
              {partners.map((partner) => (
                partner.imageUrl ? (
                  <img
                    key={partner.id}
                    src={partner.imageUrl}
                    alt={partner.title || "Partner"}
                    className="h-12 object-contain"
                  />
                ) : (
                  <span key={partner.id} className="text-2xl font-serif font-bold tracking-[0.3em] uppercase">
                    {partner.title}
                  </span>
                )
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="py-20 border-t border-white/5 overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
              <span className="text-2xl font-serif font-bold tracking-[0.3em]">VOGUE</span>
              <span className="text-2xl font-serif font-bold tracking-[0.3em]">FORBES</span>
              <span className="text-2xl font-serif font-bold tracking-[0.3em]">EATER</span>
              <span className="text-2xl font-serif font-bold tracking-[0.3em]">MICHELIN</span>
              <span className="text-2xl font-serif font-bold tracking-[0.3em]">ROBB REPORT</span>
            </div>
          </div>
        </div>
      )}

      <Footer socialLinks={socialLinks} />
    </div>
  );
}
