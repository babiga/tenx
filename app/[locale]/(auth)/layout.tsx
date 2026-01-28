import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "mn")) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background image */}
        <img
          src="/hero-food.png"
          alt="Tenx Catering"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div>
            <h2 className="text-2xl font-serif text-foreground">
              Tenx <span className="text-primary">Catering</span>
            </h2>
          </div>

          {/* Tagline */}
          <div className="max-w-md">
            <h1 className="text-4xl xl:text-5xl font-serif text-foreground leading-tight mb-4">
              Crafting{" "}
              <span className="italic text-primary">Unforgettable</span>
              <br />
              Culinary Moments
            </h1>
            <p className="text-muted-foreground text-lg">
              Where luxury catering meets world-class culinary artistry.
            </p>
          </div>

          {/* Decorative element */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-[1px] bg-primary" />
            <span className="text-xs tracking-[0.3em] text-muted-foreground uppercase">
              Since 2024
            </span>
          </div>
        </div>

        {/* Decorative gold accent */}
        <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
        {/* Mobile background */}
        <div className="absolute inset-0 lg:hidden">
          <img
            src="/hero-food.png"
            alt=""
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-background/90" />
        </div>

        {/* Form content */}
        <div className="relative z-10 w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
