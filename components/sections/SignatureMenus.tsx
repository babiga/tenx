'use client'

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

const menuData = [
  { key: "menu1", price: "185,000₮+", tier: "luxuryTier" },
  { key: "menu2", price: "145,000₮+", tier: "premiumTier" },
  { key: "menu3", price: "95,000₮+", tier: "standardTier" },
];

export default function SignatureMenus() {
  const t = useTranslations("SignatureMenus");
  return (
    <section id="menus" className="py-24 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-4xl md:text-5xl mb-2 text-white">{t("title")}</h2>
            <p className="text-muted-foreground">{t("description")}</p>
          </div>
          <Button className="bg-primary text-black hover:bg-white px-8 py-6 rounded-none text-lg">
            {t("downloadMenu")}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {menuData.map((menu, index) => (
            <motion.div
              key={menu.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 bg-card border border-white/5 relative group hover:border-primary/30 transition-colors"
            >
              <span className="text-xs uppercase tracking-[0.2em] text-primary mb-4 block">{t(menu.tier)}</span>
              <h3 className="text-2xl text-white mb-2">{t(`${menu.key}.title`)}</h3>
              <p className="text-xl text-foreground/80 mb-8 font-light">{menu.price} <span className="text-sm">{t("perGuest")}</span></p>

              <ul className="space-y-4 mb-10">
                {(t.raw(`${menu.key}.items`) as string[]).map((item) => (
                  <li key={item} className="text-sm text-muted-foreground flex items-center gap-3">
                    <div className="w-1 h-1 bg-primary rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>

              <Button className="w-full border border-white/10 hover:border-primary hover:text-black group transition-all duration-300">
                {t("addToBooking")} <Plus className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
