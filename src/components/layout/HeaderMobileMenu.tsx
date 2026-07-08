"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderMobileMenuProps {
  navItems: { name: string; href: string }[];
  isAuthenticated: boolean;
}

export function HeaderMobileMenu({
  navItems,
  isAuthenticated,
}: HeaderMobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("الرئيسية");

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <div className="flex md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label={isOpen ? "إغلاق القائمة" : "فتح القائمة"}
          className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-50 hover:text-[#1E4632] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4632]"
        >
          {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <nav
          className="absolute top-20 right-0 left-0 md:hidden border-t border-slate-100 bg-white px-4 py-6 shadow-lg animate-in slide-in-from-top duration-200"
          aria-label="التنقل للهواتف"
        >
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => {
                  setActiveItem(item.name);
                  setIsOpen(false);
                }}
                className={`py-2 text-[16px] font-medium transition-colors hover:text-[#1E4632] rounded-md border-r-2 pr-3 focus-visible:outline-none focus-visible:text-[#1E4632] focus-visible:ring-2 focus-visible:ring-[#1E4632] focus-visible:ring-offset-2 ${
                  activeItem === item.name
                    ? "text-[#1E4632] font-semibold border-[#1E4632]"
                    : "text-slate-600 border-transparent"
                }`}
                aria-current={activeItem === item.name ? "page" : undefined}
              >
                {item.name}
              </a>
            ))}
            <hr className="my-2 border-slate-100" />
            <div className="flex flex-col gap-3">
              <Button
                asChild
                variant="outline"
                className="w-full h-11 border-[#1E4632]/20 text-[#1E4632] hover:bg-[#F0F7F4] font-medium text-base rounded-lg"
              >
                <Link href="#pricing" onClick={() => setIsOpen(false)}>
                  جرب مجاناً
                </Link>
              </Button>
              <Button
                asChild
                className="w-full h-11 bg-[#1E4632] hover:bg-[#163625] text-white font-medium text-base rounded-lg"
              >
                <Link
                  href={isAuthenticated ? "/dashboard" : "/login"}
                  onClick={() => setIsOpen(false)}
                >
                  {isAuthenticated ? "لوحة التحكم" : "تسجيل الدخول"}
                </Link>
              </Button>
            </div>
          </div>
        </nav>
      )}
    </>
  );
}
