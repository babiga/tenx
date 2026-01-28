import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const menus = [
  {
    title: "Тансаг Зэрэглэлийн Цэс",
    price: "185,000₮-өөс",
    items: ["Амталсан Вагю Тарт", "Цөцгийтэй Лобстер", "Трюфель Рисотто", "Гар хийцийн амттан"],
    tier: "Тансаг"
  },
  {
    title: "Баярын Цэс",
    price: "145,000₮-өөс",
    items: ["Артизан бяслагны цуглуулга", "Шарсан далайн загас", "Удаан болгосон хонины мах", "Жимсний тарт"],
    tier: "Премиум"
  },
  {
    title: "Бизнес Цэс",
    price: "95,000₮-өөс",
    items: ["Гурмет сэндвич", "Шинэхэн салат", "Махны цуглуулга", "Мини амттан"],
    tier: "Стандарт"
  }
];

export default function SignatureMenus() {
  return (
    <section id="menus" className="py-24 bg-background border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-serif mb-2 text-white">Шилдэг Цэснүүд</h2>
            <p className="text-muted-foreground">Зэрэг бүрт зориулсан хоолны аялал.</p>
          </div>
          <Button className="bg-primary text-black hover:bg-white px-8 py-6 rounded-none text-lg">
            Бүрэн цэсийг татах
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {menus.map((menu, index) => (
            <motion.div
              key={menu.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 bg-card border border-white/5 relative group hover:border-primary/30 transition-colors"
            >
              <span className="text-xs uppercase tracking-[0.2em] text-primary mb-4 block">{menu.tier}</span>
              <h3 className="text-2xl font-serif text-white mb-2">{menu.title}</h3>
              <p className="text-xl text-foreground/80 mb-8 font-light">{menu.price} <span className="text-sm">/хүн</span></p>
              
              <ul className="space-y-4 mb-10">
                {menu.items.map((item) => (
                  <li key={item} className="text-sm text-muted-foreground flex items-center gap-3">
                    <div className="w-1 h-1 bg-primary rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>

              <Button className="w-full bg-transparent border border-white/10 hover:border-primary hover:bg-primary hover:text-black group transition-all duration-300">
                Захиалгад нэмэх <Plus className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
