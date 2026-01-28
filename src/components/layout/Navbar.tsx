'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Бидний үйлчилгээ", href: "#services" },
    { name: "Хэрхэн ажилладаг вэ", href: "#how-it-works" },
    { name: "VIP үйлчилгээ", href: "#vip" },
    { name: "Манай тогооч нар", href: "#chefs" },
    { name: "Эвентүүд", href: "#events" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled ? "bg-background/90 backdrop-blur-md py-4 border-b border-white/5" : "bg-transparent py-6"
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
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-black transition-all">
            Захиалга өгөх
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
                <Button className="bg-primary text-black hover:bg-primary/90 w-full">
                  Book a Chef
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
