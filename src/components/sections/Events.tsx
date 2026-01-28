'use client'

import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useTranslations } from "next-intl";

const events = [
  {
    id: 1,
    title: "The Vanderbilt Wedding",
    type: "Wedding",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop",
    guests: "250 Guests",
  },
  {
    id: 2,
    title: "TechFlow Annual Gala",
    type: "Corporate",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
    guests: "500 Guests",
  },
  {
    id: 3,
    title: "Penthouse Private Dining",
    type: "Private",
    image: "https://images.unsplash.com/photo-1530062845289-9109b2c9c868?q=80&w=2072&auto=format&fit=crop",
    guests: "20 Guests",
  },
  {
    id: 4,
    title: "Summer Garden Soirée",
    type: "Social",
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=2069&auto=format&fit=crop",
    guests: "80 Guests",
  },
];

export default function Events() {
  const t = useTranslations("Events");
  return (
    <section id="events" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif mb-4">{t("title")}</h2>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {events.map((event) => (
              <CarouselItem key={event.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <motion.div
                  whileHover={{ y: -10 }}
                  className="bg-card border border-white/5 overflow-hidden group"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-sm border border-white/10">
                      <span className="text-xs uppercase tracking-wider text-white">{t(`types.${event.type}`)}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-serif text-white mb-2">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">{event.guests.replace('Guests', t('guests'))}</p>
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center gap-4 mt-10">
            <CarouselPrevious className="static translate-y-0 hover:bg-primary hover:text-black border-white/10" />
            <CarouselNext className="static translate-y-0 hover:bg-primary hover:text-black border-white/10" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
