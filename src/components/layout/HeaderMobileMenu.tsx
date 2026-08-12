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
          className="inline-flex items-center justify-center rounded-lg p-2 text-foreground/80 hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
        >
          {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <nav
          className="absolute top-20 right-0 left-0 md:hidden border-t border-border bg-card px-4 py-6 shadow-xl animate-in slide-in-from-top duration-200"
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
                className={`py-2 text-[15px] font-semibold transition-colors rounded-md border-r-3 pr-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  activeItem === item.name
                    ? "text-primary font-bold border-primary bg-secondary/50"
                    : "text-muted-foreground border-transparent hover:text-foreground hover:bg-muted"
                }`}
                aria-current={activeItem === item.name ? "page" : undefined}
              >
                {item.name}
              </a>
            ))}
            <hr className="my-2 border-border" />
            <div className="flex flex-col gap-3">
              <Button
                asChild
                variant="brandOutline"
                className="w-full h-11 font-semibold text-sm rounded-lg"
              >
                <Link href="#pricing" onClick={() => setIsOpen(false)}>
                  جرب مجاناً
                </Link>
              </Button>
              <Button
                asChild
                variant="brand"
                className="w-full h-11 font-bold text-sm rounded-lg shadow-none"
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
