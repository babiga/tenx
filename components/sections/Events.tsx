'use client'

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslations } from "next-intl";

const events = [
  {
    id: 1,
    title: "The Vanderbilt Wedding",
    type: "Wedding",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop",
    guests: "250 Guests",
    highlights: ["Custom tasting menu", "Floral-plated dessert course", "Late-night snack bar"],
  },
  {
    id: 2,
    title: "TechFlow Annual Gala",
    type: "Corporate",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
    guests: "500 Guests",
    highlights: ["Live carving stations", "Branded cocktail pairings", "Executive lounge service"],
  },
  {
    id: 3,
    title: "Penthouse Private Dining",
    type: "Private",
    image: "https://images.unsplash.com/photo-1530062845289-9109b2c9c868?q=80&w=2072&auto=format&fit=crop",
    guests: "20 Guests",
    highlights: ["Chef's table presentation", "Wine pairing flight", "Seasonal tasting progression"],
  },
  {
    id: 4,
    title: "Summer Garden Soiree",
    type: "Social",
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=2069&auto=format&fit=crop",
    guests: "80 Guests",
    highlights: ["Garden canape circulation", "Signature dessert wall", "Sunset welcome drinks"],
  },
] as const;

type EventType = {
  id: string;
  title: string;
  eventType: "WEDDING" | "CORPORATE" | "PRIVATE" | "SOCIAL";
  guestCount: number;
  coverImageUrl: string | null;
  imageUrls: string[];
};

type EventCard = {
  id: string | number;
  title: string;
  type: "Wedding" | "Corporate" | "Private" | "Social";
  image: string;
  guests: string;
  highlights: readonly string[];
};

const EVENT_TYPE_TRANSLATION_KEY: Record<EventType["eventType"], EventCard["type"]> = {
  WEDDING: "Wedding",
  CORPORATE: "Corporate",
  PRIVATE: "Private",
  SOCIAL: "Social",
};

const EVENT_HIGHLIGHTS: Record<EventCard["type"], string[]> = {
  Wedding: ["Bespoke tasting menu", "Elegant dessert station", "Premium table service"],
  Corporate: ["Fast-paced service team", "Executive menu curation", "Branded food presentation"],
  Private: ["Intimate plated dinner", "Chef-led storytelling", "Tailored dietary planning"],
  Social: ["Shareable small plates", "Seasonal beverage program", "Immersive ambiance design"],
};

export default function Events({ events: apiEvents }: { events?: EventType[] }) {
  const t = useTranslations("Events");
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventCard | null>(null);

  const eventCards: EventCard[] =
    apiEvents && apiEvents.length > 0
      ? apiEvents.map((event) => {
          const type = EVENT_TYPE_TRANSLATION_KEY[event.eventType];
          return {
            id: event.id,
            title: event.title,
            type,
            image: event.coverImageUrl || event.imageUrls[0] || "/event-private.png",
            guests: `${event.guestCount} Guests`,
            highlights: EVENT_HIGHLIGHTS[type],
          };
        })
      : events.map((event) => ({ ...event }));

  const handleOpenDetails = (event: EventCard) => {
    setSelectedEvent(event);
    setOpen(true);
  };

  const detailContent = selectedEvent ? (
    <>
      <div className="relative aspect-[16/9] overflow-hidden rounded-md">
        <img src={selectedEvent.image} alt={selectedEvent.title} className="h-full w-full object-cover" />
      </div>
      <div className="space-y-4">
        <div className="space-y-1">
          <DialogTitle className="text-2xl text-white">{selectedEvent.title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {t("detailDescription", {
              type: t(`types.${selectedEvent.type}`),
              guests: selectedEvent.guests.replace("Guests", t("guests")),
            })}
          </DialogDescription>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-white/90">
          <span className="rounded-sm border border-white/10 bg-white/5 px-2 py-1">
            {t("types." + selectedEvent.type)}
          </span>
          <span className="rounded-sm border border-white/10 bg-white/5 px-2 py-1">
            {selectedEvent.guests.replace("Guests", t("guests"))}
          </span>
        </div>
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-wider text-primary">{t("highlights")}</p>
          <ul className="space-y-2 text-sm text-white/80">
            {selectedEvent.highlights.map((highlight) => (
              <li key={highlight} className="border-l-2 border-primary/60 pl-3">
                {highlight}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  ) : null;

  return (
    <section id="events" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl mb-4">{t("title")}</h2>
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
            {eventCards.map((event) => (
              <CarouselItem key={event.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <motion.button
                  type="button"
                  whileHover={{ y: -10 }}
                  onClick={() => handleOpenDetails(event)}
                  className="bg-card border border-white/5 overflow-hidden group text-left w-full"
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
                    <h3 className="text-xl text-white mb-2">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">{event.guests.replace("Guests", t("guests"))}</p>
                    <p className="mt-3 text-xs uppercase tracking-wider text-primary">{t("openDetails")}</p>
                  </div>
                </motion.button>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center gap-4 mt-10">
            <CarouselPrevious className="static translate-y-0 hover:bg-primary hover:text-black border-white/10" />
            <CarouselNext className="static translate-y-0 hover:bg-primary hover:text-black border-white/10" />
          </div>
        </Carousel>
      </div>

      {isMobile ? (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent className="max-h-[85vh] border-white/10 bg-card">
            <div className="overflow-y-auto p-6 space-y-6">{detailContent}</div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-2xl border-white/10 bg-card text-white">
            <div className="space-y-6">{detailContent}</div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
}
