import { motion } from "framer-motion";
import { ChefHat, Utensils, Star, Trophy, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import serviceWedding from "@/assets/service-wedding.png";
import servicePrivate from "@/assets/service-private.png";

const services = [
  {
    title: "Компанийн Кейтеринг",
    description: "Бизнес үдийн хоол, удирдах зөвлөлийн хурал, оффисын арга хэмжээг дээд зэрэглэлийн цэсээр баяжуулна.",
    icon: Utensils,
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Хувийн Арга Хэмжээ",
    description: "Таны хувийн сонирхол, алсын хараанд нийцүүлэн бэлтгэсэн дотны хүмүүсийн оройн зоог болон томоохон баяр ёслолууд.",
    icon: Star,
    image: servicePrivate
  },
  {
    title: "Хурим",
    description: "Таны онцгой өдөрт зориулсан коктейлийн цагаас эхлээд эцсийн хундага өргөх хүртэлх цаг хугацаагүй хоолны амт.",
    icon: Heart,
    image: serviceWedding
  },
  {
    title: "VIP Үйлчилгээ",
    description: "Тусгайлан бэлтгэсэн цэс, ховор орц найрлага, дэлхийн түвшний үйлчилгээ бүхий хосгүй тансаг байдал.",
    icon: Trophy,
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2074&auto=format&fit=crop"
  }
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-serif mb-4">Бидний Үйлчилгээ</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Дотны хүмүүсийн цугларалтаас эхлээд томоохон компанийн арга хэмжээ хүртэл Tenx Catering бүх зүйлд шилдэг нь байх болно.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden bg-card border border-white/5"
            >
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <service.icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-2xl font-serif text-white mb-2">{service.title}</h3>
                  <p className="text-white/70 text-sm max-w-sm mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {service.description}
                  </p>
                  <Button variant="link" className="text-primary p-0 w-fit group/btn">
                    Дэлгэрэнгүй үзэх <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
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
