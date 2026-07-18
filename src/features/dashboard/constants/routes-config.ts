import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Layers,
  BookOpen,
  ClipboardCheck,
  CreditCard,
  Settings,
  CalendarCheck,
  FileText,
  Award,
} from "lucide-react";
import { UserRole } from "@/types";

export interface RouteItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
}

export const dashboardRoutes: RouteItem[] = [
  // OWNER Routes
  {
    title: "لوحة التحكم",
    href: "/dashboard/center-owner",
    icon: LayoutDashboard,
    roles: [UserRole.OWNER],
  },
  {
    title: "المراحل الدراسية",
    href: "/dashboard/center-owner/grades",
    icon: Layers,
    roles: [UserRole.OWNER],
  },
  {
    title: "الطلاب",
    href: "/dashboard/center-owner/students",
    icon: Users,
    roles: [UserRole.OWNER],
  },
  {
    title: "المعلمون",
    href: "/dashboard/center-owner/teachers",
    icon: GraduationCap,
    roles: [UserRole.OWNER],
  },
  {
    title: "المجموعات",
    href: "/dashboard/center-owner/groups",
    icon: Layers,
    roles: [UserRole.OWNER],
  },
  {
    title: "المواد الدراسية",
    href: "/dashboard/center-owner/subjects",
    icon: BookOpen,
    roles: [UserRole.OWNER],
  },
  {
    title: "الاختبارات",
    href: "/dashboard/center-owner/exams",
    icon: ClipboardCheck,
    roles: [UserRole.OWNER],
  },
  {
    title: "الاشتراك",
    href: "/dashboard/center-owner/subscription",
    icon: CreditCard,
    roles: [UserRole.OWNER],
  },
  {
    title: "الإعدادات",
    href: "/dashboard/center-owner/settings",
    icon: Settings,
    roles: [UserRole.OWNER],
  },

  // TEACHER Routes
  {
    title: "لوحة التحكم",
    href: "/dashboard/instructor",
    icon: LayoutDashboard,
    roles: [UserRole.TEACHER],
  },
  {
    title: "مجموعاتي",
    href: "/dashboard/instructor/groups",
    icon: Layers,
    roles: [UserRole.TEACHER],
  },
  {
    title: "التحضير والغياب",
    href: "/dashboard/instructor/attendance",
    icon: CalendarCheck,
    roles: [UserRole.TEACHER],
  },
  {
    title: "الاختبارات",
    href: "/dashboard/instructor/exams",
    icon: ClipboardCheck,
    roles: [UserRole.TEACHER],
  },
  {
    title: "الواجبات",
    href: "/dashboard/instructor/assignments",
    icon: FileText,
    roles: [UserRole.TEACHER],
  },
  {
    title: "الإعدادات",
    href: "/dashboard/instructor/settings",
    icon: Settings,
    roles: [UserRole.TEACHER],
  },

  // STUDENT Routes
  {
    title: "لوحة التحكم",
    href: "/dashboard/student",
    icon: LayoutDashboard,
    roles: [UserRole.STUDENT],
  },
  {
    title: "موادي الدراسية",
    href: "/dashboard/student/subjects",
    icon: BookOpen,
    roles: [UserRole.STUDENT],
  },
  {
    title: "الواجبات",
    href: "/dashboard/student/assignments",
    icon: FileText,
    roles: [UserRole.STUDENT],
  },
  {
    title: "الاختبارات",
    href: "/dashboard/student/exams",
    icon: ClipboardCheck,
    roles: [UserRole.STUDENT],
  },
  {
    title: "النتائج",
    href: "/dashboard/student/results",
    icon: Award,
    roles: [UserRole.STUDENT],
  },
  {
    title: "سجل الحضور والغياب",
    href: "/dashboard/student/attendance",
    icon: CalendarCheck,
    roles: [UserRole.STUDENT],
  },
  {
    title: "سجل المدفوعات",
    href: "/dashboard/student/payments",
    icon: CreditCard,
    roles: [UserRole.STUDENT],
  },
  {
    title: "الإعدادات",
    href: "/dashboard/student/settings",
    icon: Settings,
    roles: [UserRole.STUDENT],
  },
];
