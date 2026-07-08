import Link from "next/link";
import { GraduationCap, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/features/auth/actions/get-current-user";
import { HeaderMobileMenu } from "./HeaderMobileMenu";
import { HeaderNavLinks } from "./HeaderNavLinks";

export async function Header() {
  const user = await getCurrentUser();
  const isAuthenticated = !!user;

  const navItems = [
    { name: "الرئيسية", href: "#hero" },
    { name: "المميزات", href: "#features" },
    { name: "الباقات", href: "#pricing" },
    { name: "آراء العملاء", href: "#testimonials" },
    { name: "تواصل معنا", href: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Right Side: Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-[#F0F7F4] text-[#1E4632] shadow-sm transition-transform group-hover:scale-105">
                <GraduationCap className="size-6 relative z-10" />
                <BookOpen className="size-4 absolute bottom-1.5 left-1.5 opacity-40" />
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-xl font-bold tracking-tight text-[#1E4632]">
                  EduCenter
                </span>
                <span className="text-[10px] text-slate-600 font-medium -mt-1">
                  منصة مراكز التعليم
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Desktop Nav Links */}
          <HeaderNavLinks navItems={navItems} />

          {/* Left Side: Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button asChild variant="brandOutline" size="brandMd">
              <Link href="#pricing">
                جرب مجاناً
              </Link>
            </Button>
            <Button asChild variant="brand" size="brandMd">
              <Link href={isAuthenticated ? "/dashboard" : "/login"}>
                {isAuthenticated ? "لوحة التحكم" : "تسجيل الدخول"}
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <HeaderMobileMenu navItems={navItems} isAuthenticated={isAuthenticated} />
        </div>
      </div>
    </header>
  );
}
