import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import weddingImg from "@/assets/event-wedding.png";
import corporateImg from "@/assets/event-corporate.png";
import privateImg from "@/assets/event-private.png";
import socialImg from "@/assets/event-social.png";

const events = [
  {
    id: 1,
    title: "Вандербильт хурим",
    type: "Хурим",
    image: weddingImg,
    guests: "250 Зочин",
  },
  {
    id: 2,
    title: "TechFlow жилийн гала",
    type: "Компанийн",
    image: corporateImg,
    guests: "500 Зочин",
  },
  {
    id: 3,
    title: "Дээвэр дээрх оройн зоог",
    type: "Хувийн",
    image: privateImg,
    guests: "20 Зочин",
  },
  {
    id: 4,
    title: "Зүний цэцэрлэгийн үдэшлэг",
    type: "Нийгмийн",
    image: socialImg,
    guests: "80 Зочин",
  },
];

export default function Events() {
  return (
    <section id="events" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif mb-4">Мартагдашгүй Мөчүүд</h2>
          <p className="text-muted-foreground">Tenx Catering-ийн бэлтгэсэн сүүлийн үеийн арга хэмжээнүүд.</p>
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
                      <span className="text-xs uppercase tracking-wider text-white">{event.type}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-serif text-white mb-2">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">{event.guests}</p>
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
