'use client'

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export default function VIPSection() {
  return (
    <section id="vip" className="py-32 bg-background relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-primary/5 blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/30 rounded-full mb-6">
              <Star className="w-3 h-3 text-primary fill-primary" />
              <span className="text-xs uppercase tracking-widest text-primary">Онцгой эрх</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-serif mb-6 leading-tight">
              VIP <br /> <span className="text-primary italic">Туршлага</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Ер бусын зүйл шаардсан мөчүүдэд зориулав. Манай VIP үйлчилгээ нь Мишлен зэрэглэлийн тогооч нар, тусгайлан бэлтгэсэн цэс, таны хамгийн чухал арга хэмжээнд зориулсан дээд зэрэглэлийн үйлчилгээг санал болгодог.
            </p>

            <ul className="space-y-4 mb-10">
              {["Мишлен зэрэглэлийн туршлагатай тогооч нар", "Ховор орц найрлагын нийлүүлэлт", "Сомелье дарсны хослол", "Арга хэмжээний иж бүрэн засалт"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-foreground/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>

            <Button className="bg-white text-black hover:bg-primary hover:text-black text-lg px-8 py-6 rounded-none transition-all">
              VIP эрх хүсэх
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:w-1/2 relative"
          >
            <div className="relative aspect-[4/5] bg-card border border-white/5 p-2 rotate-3 hover:rotate-0 transition-transform duration-700 ease-out shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10" />
              <div className="absolute bottom-8 left-8 z-20">
                <p className="font-serif text-3xl text-white mb-1">Тогооч Жан-Пьер</p>
                <p className="text-primary text-sm uppercase tracking-widest">3 Мишлен Одот</p>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2074&auto=format&fit=crop" 
                alt="VIP Dish" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
