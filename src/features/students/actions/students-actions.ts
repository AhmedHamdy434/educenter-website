"use server";

import { serverApiClient } from "@/lib/api/apiClient";
import { type Student, type CreateStudentDTO, type UpdateStudentDTO } from "../types";
import { type ApiResponse, QueryParams } from "@/types";

export async function getStudents(
  params: QueryParams & { gradeId?: string },
): Promise<ApiResponse<Student[]>> {
  return serverApiClient<Student[]>({
    url: "/students",
    method: "GET",
    params,
    cache: "no-store",
  });
}

export async function createStudentAction(
  data: CreateStudentDTO,
): Promise<ApiResponse<Student>> {
  return serverApiClient<Student>({
    url: "/students",
    method: "POST",
    body: data,
  });
}

export async function updateStudentAction(
  id: string,
  data: UpdateStudentDTO,
): Promise<ApiResponse<Student>> {
  return serverApiClient<Student>({
    url: `/students/${id}`,
    method: "PATCH",
    body: data,
  });
}

export async function toggleStudentStatusAction(
  id: string,
): Promise<ApiResponse<Student>> {
  return serverApiClient<Student>({
    url: `/students/${id}/toggle-status`,
    method: "PATCH",
  });
}
