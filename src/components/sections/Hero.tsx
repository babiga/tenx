'use client'

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-background">
      <div className="absolute inset-0 z-0">
        <img
          src="/tenx-hero.png"
          alt="Tenx Catering"
          className="w-full h-full object-cover opacity-60 scale-105 animate-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/30" />
      </div>

      <div className="absolute inset-0 z-1 pointer-events-none">
        <motion.div
          animate={{ y: [-10, 10, -10], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-primary blur-sm"
        />
        <motion.div
          animate={{ y: [15, -15, 15], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/3 right-1/4 w-3 h-3 rounded-full bg-white blur-md"
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <h2 className="text-primary tracking-[0.2em] text-sm uppercase mb-4 font-medium">
            Хувийн арга хэмжээ • Компанийн кейтеринг • VIP туршлага
          </h2>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6 leading-tight"
        >
          Tenx Catering — <br />
          <span className="italic font-light text-foreground/90 text-4xl md:text-6xl lg:text-7xl">Мартагдашгүй агшныг бүтээлцэнэ</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-col md:flex-row gap-4 justify-center mt-10"
        >
          <Button
            size="lg"
            className="bg-primary text-black hover:bg-white hover:text-black text-lg px-8 py-6 rounded-none transition-all duration-300 btn-glow"
          >
            Кейтеринг захиалах
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/30 text-white hover:border-primary hover:text-primary hover:bg-transparent text-lg px-8 py-6 rounded-none backdrop-blur-sm transition-all duration-300"
          >
            Үнийн санал авах
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs tracking-widest text-white/50 uppercase">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent" />
      </motion.div>
    </section>
  );
}
