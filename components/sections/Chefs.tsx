"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
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

const chefs = [
  {
    id: 1,
    name: "Marco Rossi",
    role: "Executive Chef",
    image: "/chef-1.png",
    rating: 5.0,
    reviews: 124,
    specialty: "Italian Fine Dining",
    bio: "Leads premium event curation with a focus on heritage ingredients and refined plating.",
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
    bio: "Designs narrative dessert courses that blend precision technique with seasonal expression.",
  },
  {
    id: 3,
    name: "Kenji Sato",
    role: "Sous Chef",
    image: "/chef-3.png",
    rating: 4.9,
    reviews: 102,
    specialty: "Modern Fusion",
    bio: "Builds contemporary menus around layered textures, bold aromatics, and global influences.",
  },
] as const;

type ChefType = {
  id: string;
  name: string;
  avatar: string | null;
  specialty: string | null;
  rating: number;
  reviewCount: number;
  coverImage: string | null;
};

type ChefCard = {
  id: string | number;
  name: string;
  role: string;
  image: string;
  rating: number;
  reviews: number;
  specialty: string;
  bio: string;
};

export default function Chefs({ chefs: apiChefs }: { chefs?: ChefType[] }) {
  const t = useTranslations("Chefs");
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [selectedChef, setSelectedChef] = useState<ChefCard | null>(null);

  const chefsData: ChefCard[] =
    apiChefs && apiChefs.length > 0
      ? apiChefs.map((chef) => ({
          id: chef.id,
          name: chef.name,
          role: t("role"),
          image: chef.coverImage || chef.avatar || "/chef-1.png",
          rating: chef.rating,
          reviews: chef.reviewCount,
          specialty: chef.specialty || t("defaultSpecialty"),
          bio: t("detailDescription", { name: chef.name }),
        }))
      : chefs.map((chef) => ({ ...chef }));

  const handleOpenDetails = (chef: ChefCard) => {
    setSelectedChef(chef);
    setOpen(true);
  };

  const detailContent = selectedChef ? (
    <>
      <div className="relative aspect-[16/9] overflow-hidden rounded-md">
        <img src={selectedChef.image} alt={selectedChef.name} className="h-full w-full object-cover" />
      </div>
      <div className="space-y-4">
        <div className="space-y-1">
          <DialogTitle className="text-2xl text-white">{selectedChef.name}</DialogTitle>
          <DialogDescription className="text-muted-foreground">{selectedChef.role}</DialogDescription>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="h-4 w-4 fill-primary text-primary" />
            ))}
          </div>
          <span className="text-sm text-white/80">
            {selectedChef.rating.toFixed(1)} ({selectedChef.reviews} {t("reviews")})
          </span>
        </div>
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-wider text-primary">{t("specialty")}</p>
          <p className="text-sm text-white/80 border-l-2 border-primary/60 pl-3">{selectedChef.specialty}</p>
        </div>
        <p className="text-sm text-white/80">{selectedChef.bio}</p>
      </div>
    </>
  ) : null;

  return (
    <section id="chefs" className="py-24 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-4xl md:text-5xl mb-2">{t("title")}</h2>
            <p className="text-muted-foreground">{t("description")}</p>
          </div>
          <a
            href="#"
            className="hidden md:block text-primary hover:text-white transition-colors underline decoration-primary/30 underline-offset-8"
          >
            {t("viewAll")}
          </a>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {chefsData.map((chef, index) => (
              <CarouselItem key={chef.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <motion.button
                  type="button"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleOpenDetails(chef)}
                  className="group relative h-[500px] overflow-hidden cursor-pointer text-left w-full"
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
                          <Star key={s} className="w-3 h-3 text-primary fill-primary" />
                        ))}
                      </div>
                      <span className="text-xs text-white/70">
                        ({chef.reviews} {t("reviews")})
                      </span>
                    </div>

                    <h3 className="text-2xl text-white mb-1">{chef.name}</h3>
                    <p className="text-primary text-sm uppercase tracking-widest mb-4">{chef.role}</p>

                    <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-500">
                      <p className="text-sm text-white/80 border-l-2 border-primary pl-3">
                        {t("specialty")}: {chef.specialty}
                      </p>
                      <p className="mt-3 text-xs uppercase tracking-wider text-primary">{t("openDetails")}</p>
                    </div>
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

        <div className="mt-12 text-center md:hidden">
          <a
            href="#"
            className="text-primary hover:text-white transition-colors underline decoration-primary/30 underline-offset-8"
          >
            {t("viewAll")}
          </a>
        </div>
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
