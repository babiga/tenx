"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";

const chefs = [
  {
    id: 1,
    name: "Marco Rossi",
    role: "Executive Chef",
    image: "/chef-1.png",
    rating: 5.0,
    reviews: 124,
    specialty: "Italian Fine Dining",
  },
  {
    id: 2,
    name: "Elena Vance",
    role: "Pastry Virtuoso",
    image:
      "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=1977&auto=format&fit=crop",
    rating: 4.9,
    reviews: 89,
    specialty: "Artisan Desserts",
  },
  {
    id: 3,
    name: "Kenji Sato",
    role: "Sous Chef",
    image: "/chef-3.png",
    rating: 4.9,
    reviews: 102,
    specialty: "Modern Fusion",
  },
];

export default function Chefs() {
  const t = useTranslations("Chefs");
  return (
    <section id="chefs" className="py-24 bg-background border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-4xl md:text-5xl mb-2">
              {t("title")}
            </h2>
            <p className="text-muted-foreground">
              {t("description")}
            </p>
          </div>
          <a
            href="#"
            className="hidden md:block text-primary hover:text-white transition-colors underline decoration-primary/30 underline-offset-8"
          >
            {t("viewAll")}
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {chefs.map((chef, index) => (
            <motion.div
              key={chef.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative h-[500px] overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 z-10" />

              <img
                src={chef.image}
                alt={chef.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              <div className="absolute bottom-0 left-0 w-full p-8 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex items-center gap-2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className="w-3 h-3 text-primary fill-primary"
                      />
                    ))}
                  </div>
                  <span className="text-xs text-white/70">
                    ({chef.reviews} {t("reviews")})
                  </span>
                </div>

                <h3 className="text-2xl text-white mb-1">
                  {chef.name}
                </h3>
                <p className="text-primary text-sm uppercase tracking-widest mb-4">
                  {chef.role}
                </p>

                <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-500">
                  <p className="text-sm text-white/80 border-l-2 border-primary pl-3">
                    {t("specialty")}: {chef.specialty}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center md:hidden">
          <a
            href="#"
            className="text-primary hover:text-white transition-colors underline decoration-primary/30 underline-offset-8"
          >
            {t("viewAll")}
          </a>
        </div>
      </div>
    </section>
  );
}
