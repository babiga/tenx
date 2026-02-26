'use client'

import { motion } from "framer-motion";
import { Utensils, Star, Trophy, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

type ServiceRoute = "corporate" | "private" | "wedding" | "vip";

const serviceData = [
  {
    key: "corporate",
    route: "corporate" as ServiceRoute,
    icon: Utensils,
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2070&auto=format&fit=crop"
  },
  {
    key: "private",
    route: "private" as ServiceRoute,
    icon: Star,
    image: "https://images.unsplash.com/photo-1530062845289-9109b2c9c868?q=80&w=2072&auto=format&fit=crop"
  },
  {
    key: "weddings",
    route: "wedding" as ServiceRoute,
    icon: Heart,
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop"
  },
  {
    key: "vip",
    route: "vip" as ServiceRoute,
    icon: Trophy,
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2074&auto=format&fit=crop"
  }
];

type ServiceTierType = {
  id: string;
  name: string;
  description: string | null;
  isVIP: boolean;
  pricePerGuest: number;
};

function resolveServiceRoute(
  name: string,
  isVIP: boolean,
  fallbackRoute: ServiceRoute,
): ServiceRoute {
  if (isVIP) return "vip";

  const normalized = name.toLowerCase();
  if (normalized.includes("wed")) return "wedding";
  if (normalized.includes("priv")) return "private";
  if (normalized.includes("corp") || normalized.includes("business")) return "corporate";
  if (normalized.includes("vip")) return "vip";

  return fallbackRoute;
}

export default function Services({ services }: { services?: ServiceTierType[] }) {
  const t = useTranslations("Services");

  const serviceCards = services && services.length > 0
    ? services.map((service, index) => {
      const visual = serviceData[index % serviceData.length];
      const route = resolveServiceRoute(service.name, service.isVIP, visual.route);

      return {
        id: service.id,
        title: service.name,
        description: service.description ?? "",
        image: visual.image,
        icon: visual.icon,
        href: `/services/${route}`,
      };
    })
    : serviceData.map((service) => ({
      id: service.key,
      title: t(`${service.key}.title`),
      description: t(`${service.key}.description`),
      image: service.image,
      icon: service.icon,
      href: `/services/${service.route}`,
    }));

  return (
    <section id="services" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl mb-4">{t("title")}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("description")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {serviceCards.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden bg-card border border-white/5"
            >
              <div className="aspect-[4/5] sm:aspect-square md:aspect-video relative overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent md:bg-black/60 md:group-hover:bg-black/40 transition-colors" />
                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                  <service.icon className="w-8 h-8 md:w-10 md:h-10 text-primary mb-3 md:mb-4" />
                  <h3 className="text-xl md:text-2xl text-white mb-2 font-medium">{service.title}</h3>
                  <p className="text-white/80 text-sm max-w-xs mb-4 md:mb-6 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 translate-y-0 md:translate-y-4 md:group-hover:translate-y-0">
                    {service.description}
                  </p>
                  <Button asChild variant="link" className="text-primary p-0 h-auto w-fit group/btn text-sm md:text-base">
                    <Link href={service.href}>
                      {t("exploreMore")} <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
