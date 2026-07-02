"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, GraduationCap, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("الرئيسية");

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
                <span className="text-[10px] text-slate-400 font-medium -mt-1">
                  منصة مراكز التعليم
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setActiveItem(item.name)}
                className={`relative py-2 text-[15px] font-medium transition-colors hover:text-[#1E4632] ${
                  activeItem === item.name
                    ? "text-[#1E4632] font-semibold"
                    : "text-slate-500"
                }`}
              >
                {item.name}
                {activeItem === item.name && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#1E4632]" />
                )}
              </a>
            ))}
          </nav>

          {/* Left Side: Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="#pricing">
              <Button variant="brandOutline" size="brandMd">
                جرب مجاناً
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="brand" size="brandMd">
                تسجيل الدخول
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-700 focus:outline-none"
            >
              {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-6 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => {
                  setActiveItem(item.name);
                  setIsOpen(false);
                }}
                className={`py-2 text-[16px] font-medium transition-colors hover:text-[#1E4632] ${
                  activeItem === item.name
                    ? "text-[#1E4632] font-semibold border-r-2 border-[#1E4632] pr-3"
                    : "text-slate-600"
                }`}
              >
                {item.name}
              </a>
            ))}
            <hr className="my-2 border-slate-100" />
            <div className="flex flex-col gap-3">
              <Link href="#pricing" onClick={() => setIsOpen(false)}>
                <Button
                  variant="outline"
                  className="w-full h-11 border-[#1E4632]/20 text-[#1E4632] hover:bg-[#F0F7F4] font-medium text-base rounded-lg"
                >
                  جرب مجاناً
                </Button>
              </Link>
              <Link href="/login" onClick={() => setIsOpen(false)}>
                <Button className="w-full h-11 bg-[#1E4632] hover:bg-[#163625] text-white font-medium text-base rounded-lg">
                  تسجيل الدخول
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
