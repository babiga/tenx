import { motion } from "framer-motion";
import { Check, Calendar, ChefHat, FileSignature } from "lucide-react";

const steps = [
  {
    id: 1,
    icon: Check,
    title: "Үйлчилгээ сонгох",
    desc: "Стандарт, Премиум, эсвэл VIP зэргээс өөрийн хэрэгцээнд нийцүүлэн сонгоно уу.",
  },
  {
    id: 2,
    icon: Calendar,
    title: "Огноо сонгох",
    desc: "Арга хэмжээ болох огноо, байршлаа сонгоно уу. Бид бүх логистикийг хариуцна.",
  },
  {
    id: 3,
    icon: ChefHat,
    title: "Цэсээ сонгох",
    desc: "Бидний бэлтгэсэн шилдэг цэснүүдээс зочдод тань таалагдахыг сонгоно уу.",
  },
  {
    id: 4,
    icon: FileSignature,
    title: "Төлбөр баталгаажуулах",
    desc: "Цахим гэрээ болон төлбөрөө аюулгүйгээр баталгаажуулна уу.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-background relative border-t border-white/5">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-serif mb-4">Хэрхэн ажилладаг вэ</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Сонголт хийхээс эхлээд баяр хөөр хүртэлх саадгүй аялал.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-12 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent -z-1" />

          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative flex flex-col items-center text-center group"
            >
              <div className="w-24 h-24 rounded-full bg-card border border-white/10 flex items-center justify-center mb-6 group-hover:border-primary/50 transition-colors duration-500 relative z-10 shadow-2xl">
                <step.icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-serif mb-3 text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed px-4">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
