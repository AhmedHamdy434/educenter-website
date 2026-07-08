import Link from "next/link";
import { GraduationCap, MessageCircle, Send } from "lucide-react";

const Youtube = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.95 1.96C5.12 19.5 12 19.5 12 19.5s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

const Instagram = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export function Footer() {
  return (
    <footer className="w-full bg-slate-50 border-t border-slate-100 pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Brand Info */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1E4632] text-white shadow-sm">
                <GraduationCap className="size-6" />
              </div>
              <span className="font-sans text-xl font-bold tracking-tight text-[#1E4632]">
                EduCenter
              </span>
            </div>
            <p className="text-slate-600 text-sm max-w-sm leading-relaxed">
              منصة متكاملة لإدارة مراكز التعليم وتحسين العملية التعليمية، نهدف لمساعدتك في قيادة مركزك التعليمي نحو النجاح والتميز بأحدث التقنيات.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-slate-800 text-base">روابط سريعة</h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <a href="#hero" className="text-sm text-slate-600 hover:text-[#1E4632] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4632] focus-visible:ring-offset-2 rounded-sm">
                  الرئيسية
                </a>
              </li>
              <li>
                <a href="#features" className="text-sm text-slate-600 hover:text-[#1E4632] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4632] focus-visible:ring-offset-2 rounded-sm">
                  المميزات
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-sm text-slate-600 hover:text-[#1E4632] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4632] focus-visible:ring-offset-2 rounded-sm">
                  الباقات
                </a>
              </li>
              <li>
                <a href="#faq" className="text-sm text-slate-600 hover:text-[#1E4632] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4632] focus-visible:ring-offset-2 rounded-sm">
                  الأسئلة الشائعة
                </a>
              </li>
              <li>
                <a href="#contact" className="text-sm text-slate-600 hover:text-[#1E4632] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4632] focus-visible:ring-offset-2 rounded-sm">
                  تواصل معنا
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-slate-800 text-base">الدعم الفني</h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link href="#" className="text-sm text-slate-500 hover:text-[#1E4632] transition-colors">
                  مركز المساعدة
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-slate-500 hover:text-[#1E4632] transition-colors">
                  سياسة الخصوصية
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-slate-500 hover:text-[#1E4632] transition-colors">
                  شروط الاستخدام
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-200/60 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} EduCenter. جميع الحقوق محفوظة.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="قناة يوتيوب"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1E4632] text-white hover:bg-[#163625] transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4632] focus-visible:ring-offset-2"
            >
              <Youtube className="size-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="حساب إكس (تويتر سابقاً)"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1E4632] text-white hover:bg-[#163625] transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4632] focus-visible:ring-offset-2"
            >
              <Send className="size-4 rotate-135" aria-hidden="true" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="حساب إنستغرام"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1E4632] text-white hover:bg-[#163625] transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4632] focus-visible:ring-offset-2"
            >
              <Instagram className="size-4" />
            </a>
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="تواصل عبر واتساب"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1E4632] text-white hover:bg-[#163625] transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4632] focus-visible:ring-offset-2"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

