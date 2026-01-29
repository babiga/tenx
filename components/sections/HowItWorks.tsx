'use client'

import { motion } from "framer-motion";
import { Check, Calendar, ChefHat, FileSignature } from "lucide-react";
import { useTranslations } from "next-intl";

const stepData = [
  { id: 1, icon: Check, key: "step1" },
  { id: 2, icon: Calendar, key: "step2" },
  { id: 3, icon: ChefHat, key: "step3" },
  { id: 4, icon: FileSignature, key: "step4" },
];

export default function HowItWorks() {
  const t = useTranslations("HowItWorks");
  return (
    <section id="how-it-works" className="py-24 bg-background relative border-t border-white/5">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-serif mb-4">{t("title")}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t("description")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-12 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent -z-1" />

          {stepData.map((step, index) => (
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
              <h3 className="text-xl font-serif mb-3 text-foreground">{t(`${step.key}.title`)}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed px-4">
                {t(`${step.key}.description`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
