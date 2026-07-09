import { type DayOfWeek } from "@/utils/time";
export type { DayOfWeek };

export interface GroupScheduleItem {
  id?: string;
  day: DayOfWeek;
  hour: number;
  minute: number;
}

export interface Group {
  id: string;
  name: string;
  capacity: number | null;
  isActive: boolean;
  centerId: string;
  gradeId: string;
  grade: {
    id: string;
    name: string;
  };
  subjectId: string;
  subject: {
    id: string;
    name: string;
  };
  teacherId: string;
  teacher: {
    id: string;
    user: {
      fullName: string;
      avatar: string | null;
    };
  };
  schedule: GroupScheduleItem[];
  _count: {
    students: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface GroupStudent {
  id: string;
  joinedAt: string;
  student: {
    id: string;
    parentPhone: string;
    user: {
      id: string;
      fullName: string;
      email: string;
      phone: string;
      avatar: string | null;
    };
  };
}

export interface GroupDetails extends Group {
  teacher: {
    id: string;
    specialization: string;
    user: {
      id: string;
      fullName: string;
      email: string;
      phone: string;
      avatar: string | null;
    };
  };
  students: GroupStudent[];
}

export interface CreateGroupDTO {
  name: string;
  gradeId: string;
  subjectId: string;
  teacherId: string;
  capacity?: number;
  schedule: {
    day: DayOfWeek;
    hour: number;
    minute: number;
  }[];
}

export interface UpdateGroupDTO {
  name?: string;
  gradeId?: string;
  subjectId?: string;
  teacherId?: string;
  capacity?: number;
  schedule?: {
    day: DayOfWeek;
    hour: number;
    minute: number;
  }[];
  isActive?: boolean;
}
