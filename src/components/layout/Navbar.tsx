'use client'

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const t = useTranslations("Navbar");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: t("services"), href: "#services" },
    { name: t("howItWorks"), href: "#how-it-works" },
    { name: t("vip"), href: "#vip" },
    { name: t("chefs"), href: "#chefs" },
    { name: t("events"), href: "#events" },
  ];

  const handleLocaleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-background/90 backdrop-blur-md py-4 border-b border-white/5" : "bg-transparent py-6"
        }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-serif tracking-wider font-bold text-foreground uppercase">
          Tenx Catering
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors tracking-wide"
            >
              {link.name}
            </a>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-2 text-foreground/80 hover:text-primary">
                <Globe className="h-4 w-4" />
                <span className="uppercase">{locale}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background border-white/10">
              <DropdownMenuItem onClick={() => handleLocaleChange('en')} className="hover:bg-primary/10 cursor-pointer">
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLocaleChange('mn')} className="hover:bg-primary/10 cursor-pointer">
                Монгол
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-black transition-all">
            {t("bookNow")}
          </Button>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background border-l border-white/10 w-[80%]">
              <div className="flex flex-col space-y-8 mt-12">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-2xl font-serif text-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                ))}

                <div className="flex gap-4 pt-4 border-t border-white/5">
                  <button
                    onClick={() => handleLocaleChange('en')}
                    className={`text-sm uppercase tracking-widest ${locale === 'en' ? 'text-primary' : 'text-foreground/60'}`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => handleLocaleChange('mn')}
                    className={`text-sm uppercase tracking-widest ${locale === 'mn' ? 'text-primary' : 'text-foreground/60'}`}
                  >
                    MN
                  </button>
                </div>

                <Button className="bg-primary text-black hover:bg-primary/90 w-full">
                  {t("bookNow")}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
