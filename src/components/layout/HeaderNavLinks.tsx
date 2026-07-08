"use client";

import { useState } from "react";

interface HeaderNavLinksProps {
  navItems: { name: string; href: string }[];
}

export function HeaderNavLinks({ navItems }: HeaderNavLinksProps) {
  const [activeItem, setActiveItem] = useState("الرئيسية");

  return (
    <nav
      className="hidden md:flex items-center gap-8"
      aria-label="التنقل الرئيسي"
    >
      {navItems.map((item) => (
        <a
          key={item.name}
          href={item.href}
          onClick={() => setActiveItem(item.name)}
          className={`relative py-2 text-[15px] font-medium transition-colors hover:text-[#1E4632] ${
            activeItem === item.name
              ? "text-[#1E4632] font-semibold"
              : "text-slate-600"
          }`}
          aria-current={activeItem === item.name ? "page" : undefined}
        >
          {item.name}
          {activeItem === item.name && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#1E4632]" />
          )}
        </a>
      ))}
    </nav>
  );
}
