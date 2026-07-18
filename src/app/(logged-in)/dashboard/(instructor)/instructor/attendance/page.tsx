import type { Metadata } from "next";
import { getGroups } from "@/features/groups/actions/groups-actions";
import { TeacherAttendanceList } from "@/features/attendance/components/TeacherAttendanceList";

export const metadata: Metadata = {
  title: "التحضير والغياب | المعلم",
  description: "تسجيل حضور وغياب الطلاب للمجموعات المختلفة.",
};

export default async function TeacherAttendancePage() {
  // Fetch initial group list for the logged-in teacher (filtered by role at backend)
  const initialGroups = await getGroups({ limit: 100 });

  return <TeacherAttendanceList initialData={initialGroups} />;
}
