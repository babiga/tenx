import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black py-16 border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <h2 className="text-3xl font-serif font-bold text-white mb-6 tracking-wide uppercase">TENX CATERING</h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Тансаг зэрэглэлийн кейтерингийг дэлхийн түвшний хоолны урлагтай хослуулна.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-white/60 hover:text-primary transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-white/60 hover:text-primary transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-white/60 hover:text-primary transition-colors"><Facebook className="w-5 h-5" /></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-6 uppercase tracking-widest text-xs">Компани</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Бидний тухай</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Ажлын байр</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Мэдээ мэдээлэл</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Холбоо барих</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-6 uppercase tracking-widest text-xs">Үйлчилгээ</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Хувийн тогооч</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Хуримын кейтеринг</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Компанийн арга хэмжээ</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Хоолны хичээл</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-6 uppercase tracking-widest text-xs">Шинэ мэдээ</h4>
            <p className="text-muted-foreground text-sm mb-4">Тусгай цэс болон саналуудыг хүлээн авах.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Имэйл хаяг" 
                className="bg-transparent border-b border-white/20 text-white py-2 px-0 w-full focus:outline-none focus:border-primary text-sm"
              />
              <button className="text-primary text-sm uppercase tracking-wider font-medium hover:text-white transition-colors ml-4">
                Нэгдэх
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-xs text-muted-foreground">
          <p>© 2024 Tenx Catering. Бүх эрх хуулиар хамгаалагдсан.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">Нууцлалын бодлого</a>
            <a href="#" className="hover:text-white">Үйлчилгээний нөхцөл</a>
            <a href="#" className="hover:text-white">Сайтын бүтэц</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
