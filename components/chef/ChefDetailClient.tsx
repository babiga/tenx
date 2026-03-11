"use client";

import { Button } from "@/components/ui/button";
import { ChefReviewsSection, type ChefReviewItem } from "@/components/chef/chef-reviews-section";
import { Link } from "@/i18n/routing";
import { ArrowLeft, Star, Award, MapPin, Clock, Users, Calendar, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

type PortfolioEvent = {
  id: string;
  title: string;
  eventType: string;
  guestCount: number;
  coverImageUrl: string | null;
  imageUrls: string[];
};

type ChefDetailProps = {
  chef: any;
  fallbackChef: any;
  customer: any;
  initialReviews: ChefReviewItem[];
  canReview: boolean;
  rating: number;
  reviews: number;
};

export function ChefDetailClient({
  chef,
  fallbackChef,
  customer,
  initialReviews,
  canReview,
  rating,
  reviews,
}: ChefDetailProps) {
  const t = useTranslations("Chefs");

  const displayName = chef?.name ?? fallbackChef?.name ?? "";
  const avatar = chef?.avatar ?? fallbackChef?.image ?? "/chef-1.png";
  const coverImage = chef?.chefProfile?.coverImage ?? "/event-private.png";
  const specialty = chef?.chefProfile?.specialty ?? fallbackChef?.specialty ?? t("defaultSpecialty");
  const bio = chef?.chefProfile?.bio ?? fallbackChef?.bio ?? t("detailDescription", { name: displayName });
  const yearsExperience = chef?.chefProfile?.yearsExperience ?? 0;
  const certifications = (chef?.chefProfile?.certifications as string[]) ?? [];
  const events = (chef?.chefProfile?.portfolioEvents as PortfolioEvent[]) ?? [];

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          src={coverImage} 
          alt="Cover" 
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/20 to-black" />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        
        <div className="container relative mx-auto h-full px-6">
          <div className="flex h-full flex-col justify-end pb-12">
            <motion.div {...fadeIn}>
              <Button asChild variant="ghost" className="mb-8 w-fit text-white hover:bg-white/10">
                <Link href="/#chefs">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t("back")}
                </Link>
              </Button>
            </motion.div>
            
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <motion.div 
                {...fadeIn}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="flex items-center gap-6"
              >
                <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-primary/50 shadow-2xl md:h-32 md:w-32 hover:scale-105 transition-transform duration-500 cursor-pointer">
                  <img src={avatar} alt={displayName} className="h-full w-full object-cover" />
                </div>
                <div className="space-y-1">
                  <Badge variant="outline" className="border-primary/50 text-primary uppercase tracking-widest text-[10px]">
                    {t("role")}
                  </Badge>
                  <h1 className="text-4xl font-light text-white md:text-6xl">{displayName}</h1>
                  <p className="text-lg text-white/70 italic">{specialty}</p>
                </div>
              </motion.div>
              
              <motion.div 
                {...fadeIn}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex gap-4"
              >
                <Button asChild className="bg-primary text-black hover:bg-white px-8 h-12 rounded-full font-medium transition-all duration-300">
                  <Link href="/inquiry">{t("bookConsultation")}</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-16">
            
            {/* Stats Grid */}
            <motion.div 
              variants={{
                animate: { transition: { staggerChildren: 0.1 } }
              }}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4 sm:grid-cols-4"
            >
              {[
                { icon: Star, value: rating.toFixed(1), label: t("reviews"), fill: true },
                { icon: Clock, value: yearsExperience, label: t("experience") },
                { icon: Users, value: reviews, label: t("reviewsSectionTitle") },
                { icon: Calendar, value: events.length, label: "Events" }
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  variants={{
                    initial: { opacity: 0, scale: 0.9 },
                    animate: { opacity: 1, scale: 1 }
                  }}
                  className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300"
                >
                  <div className="mb-2 text-primary">
                    <stat.icon className={`h-5 w-5 ${stat.fill ? 'fill-primary' : ''}`} />
                  </div>
                  <div className="text-2xl font-light text-white">{stat.value}</div>
                  <div className="text-xs uppercase tracking-wider text-white/40">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* About */}
            <motion.section 
              {...fadeIn}
              whileInView="animate"
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-light text-white uppercase tracking-widest">{t("bio")}</h2>
                <Separator className="flex-1 bg-white/10" />
              </div>
              <div className="prose prose-invert max-w-none">
                <p className="text-lg leading-relaxed text-white/70">
                  {bio}
                </p>
              </div>
            </motion.section>

            {/* Certifications if any */}
            {certifications.length > 0 && (
              <motion.section 
                {...fadeIn}
                whileInView="animate"
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-light text-white uppercase tracking-widest">{t("certifications")}</h2>
                  <Separator className="flex-1 bg-white/10" />
                </div>
                <div className="flex flex-wrap gap-3">
                  {certifications.map((cert: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm text-primary hover:bg-primary/10 transition-colors duration-300">
                      <Award className="h-4 w-4" />
                      {cert}
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Portfolio Grid */}
            {events.length > 0 && (
              <motion.section 
                {...fadeIn}
                whileInView="animate"
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-2xl font-light text-white uppercase tracking-widest">{t("portfolio")}</h2>
                  <Separator className="flex-1 bg-white/10" />
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  {events.map((event: PortfolioEvent) => (
                    <Card key={event.id} className="group overflow-hidden border-white/5 bg-white/5 backdrop-blur-sm transition-all duration-500 hover:border-primary/20">
                      <div className="relative aspect-16/10 overflow-hidden">
                        <img 
                          src={event.coverImageUrl || event.imageUrls[0] || "/event-private.png"} 
                          alt={event.title} 
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 transition-opacity duration-500 group-hover:opacity-0" />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-primary/90 text-black backdrop-blur-md border-none">
                            {event.eventType}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-light text-white mb-2">{event.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-white/50">
                          <div className="flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5 text-primary" />
                            <span>{event.guestCount} Guests</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-primary" />
                            <span>Private Venue</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Reviews Section */}
            <motion.div 
              {...fadeIn}
              whileInView="animate"
              viewport={{ once: true }}
              className="pt-8"
            >
              <ChefReviewsSection
                chefId={chef?.id ?? null}
                initialReviews={initialReviews}
                initialAverageRating={rating}
                initialReviewCount={reviews}
                isCustomerLoggedIn={Boolean(customer)}
                currentCustomerId={customer?.id ?? null}
                canReview={canReview}
              />
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Card className="sticky top-24 overflow-hidden border-primary/20 bg-white/5 backdrop-blur-xl">
                <CardContent className="p-8 space-y-8">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-light text-white">Culinary Consultation</h3>
                    <p className="text-sm text-white/50">Discuss your event vision directly with {displayName.split(' ')[0]}.</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-xl bg-white/5 p-4 border border-white/5">
                      <span className="text-sm text-white/70">Typical Lead Time</span>
                      <span className="text-sm font-medium text-primary">7-14 Days</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-white/5 p-4 border border-white/5">
                      <span className="text-sm text-white/70">Menu Customization</span>
                      <span className="text-sm font-medium text-primary">Fully Bespoke</span>
                    </div>
                  </div>

                  <Button asChild className="w-full bg-primary text-black hover:bg-white h-14 rounded-full font-semibold transition-all duration-300">
                    <Link href="/inquiry">{t("requestConsultation")}</Link>
                  </Button>
                  
                  <div className="text-center">
                    <p className="text-xs text-white/30 uppercase tracking-[0.2em]">Excellence Guaranteed</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Links / Info */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="rounded-2xl border border-white/5 bg-white/5 p-8 space-y-6"
            >
              <h4 className="text-sm font-medium text-white uppercase tracking-widest">Why Chef {displayName.split(' ')[0]}?</h4>
              <ul className="space-y-4">
                {[
                  "Specialized in luxury private dining",
                  "Expert in seasonal ingredient sourcing",
                  "Meticulous attention to dietary needs",
                  "White-glove service standard"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/60">
                    <ChevronRight className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
