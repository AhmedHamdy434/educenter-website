"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { GraduationCap, BookOpen, LogOut, HelpCircle } from "lucide-react";
import { dashboardRoutes } from "../constants/routes-config";
import { User, UserRole } from "@/types";
import { cn } from "@/lib/utils";

interface SidebarProps {
  role: UserRole;
  user: User;
  onClose?: () => void;
}

const roleTranslations: Record<UserRole, string> = {
  [UserRole.OWNER]: "مدير المركز",
  [UserRole.TEACHER]: "معلم",
  [UserRole.STUDENT]: "طالب",
};

export function Sidebar({ role, user, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Filter routes based on user role
  const filteredRoutes = dashboardRoutes.filter((route) =>
    route.roles.includes(role)
  );

  const handleLogout = () => {
    // Clear token cookie
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    
    // Redirect to login
    router.push("/login");
    router.refresh();
    if (onClose) onClose();
  };

  return (
    <aside className="flex h-full w-64 flex-col border-l border-slate-100 bg-[#1E4632] text-white shadow-xl">
      {/* Logo Header */}
      <div className="flex h-20 items-center gap-3 px-6 border-b border-white/10">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white shadow-sm">
          <GraduationCap className="size-5 relative z-10" />
          <BookOpen className="size-3.5 absolute bottom-1 left-1 opacity-40" />
        </div>
        <div className="flex flex-col">
          <span className="font-sans text-lg font-bold tracking-tight text-white">
            EduCenter
          </span>
          <span className="text-[10px] text-white/60 font-medium -mt-1">
            لوحة إدارة المنصة
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-4 py-6" aria-label="القائمة الجانبية">
        <ul className="space-y-1">
          {filteredRoutes.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 text-[15px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E4632]",
                    isActive
                      ? "bg-white/15 text-white font-semibold"
                      : "text-white/80 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon className={cn("size-5 shrink-0", isActive ? "text-white" : "text-white/70")} />
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Divider */}
        <hr className="my-6 border-white/10" />

        {/* Support Link */}
        <ul>
          <li>
            <Link
              href="/dashboard/support"
              onClick={onClose}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-[15px] font-medium text-white/80 hover:bg-white/5 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E4632]"
            >
              <HelpCircle className="size-5 shrink-0 text-white/70" />
              <span>الدعم الفني</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* User Card & Logout */}
      <div className="p-4 border-t border-white/10 bg-black/10">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white font-semibold">
              {user.name ? user.name.charAt(0).toUpperCase() : "م"}
            </div>
            <div className="flex flex-col overflow-hidden text-right">
              <span className="text-sm font-medium text-white truncate" title={user.name}>
                {user.name || "مستخدم"}
              </span>
              <span className="text-xs text-white/60 truncate">
                {roleTranslations[role] || "صلاحية غير معروفة"}
              </span>
            </div>
          </div>
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            aria-label="تسجيل الخروج"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E4632]/80"
          >
            <LogOut className="size-5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
