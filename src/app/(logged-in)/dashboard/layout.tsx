import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/actions/get-current-user";
import { DashboardLayoutClient } from "@/features/dashboard/components/DashboardLayoutClient";
import { UserRole } from "@/types";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch current user from API helper
  const user = await getCurrentUser();

  // Redirect to login if unauthenticated
  if (!user) {
    redirect("/login");
  }

  const role = user.role;

  // Validate role and redirect if invalid
  if (!role || !Object.values(UserRole).includes(role)) {
    redirect("/login");
  }

  return (
    <DashboardLayoutClient user={user} role={role}>
      {children}
    </DashboardLayoutClient>
  );
}
