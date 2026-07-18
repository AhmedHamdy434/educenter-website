import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGroup } from "@/features/groups/actions/groups-actions";
import { TeacherAttendanceDetailsClient } from "@/features/attendance/components/TeacherAttendanceDetailsClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "تسجيل الحضور والغياب | المعلم",
  description: "تسجيل حضور وغياب الطلاب لمجموعة معينة.",
};

export default async function TeacherAttendanceDetailsPage({ params }: PageProps) {
  const { id } = await params;

  const groupRes = await getGroup(id);

  if (!groupRes.success || !groupRes.data) {
    notFound();
  }

  return (
    <TeacherAttendanceDetailsClient initialGroupData={groupRes} />
  );
}
