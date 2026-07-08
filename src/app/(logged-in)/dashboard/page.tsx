import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/actions/get-current-user";
import { UserRole } from "@/types";

export default async function DashboardIndexPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const role = user.role;

  if (role === UserRole.OWNER) {
    redirect("/dashboard/center-owner");
  } else if (role === UserRole.TEACHER) {
    redirect("/dashboard/instructor");
  } else if (role === UserRole.STUDENT) {
    redirect("/dashboard/student");
  } else {
    redirect("/login");
  }
}
