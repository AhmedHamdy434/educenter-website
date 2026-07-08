import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getGrades,
  createGradeAction,
  updateGradeAction,
  toggleGradeStatusAction,
} from "../actions/grades-actions";
import { type Grade } from "../types";
import { type GradeFormValues } from "../schemas/grade-schema";
import { handleResponseToast } from "@/lib/api/handleResponseToast";
import { type ApiResponse } from "@/types";

interface UseGradesProps {
  page: number;
  limit: number;
  search: string;
  activeFilter: string;
  initialData?: ApiResponse<Grade[]>;
  onSuccessSubmit?: () => void;
}

export function useGrades({
  page,
  limit,
  search,
  activeFilter,
  initialData,
  onSuccessSubmit,
}: UseGradesProps) {
  const queryClient = useQueryClient();
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // 1. Query for fetching grades
  const gradesQuery = useQuery({
    queryKey: ["grades", { page, limit, search, activeFilter }],
    queryFn: async () => {
      const activeParam =
        activeFilter === "true"
          ? true
          : activeFilter === "false"
          ? false
          : undefined;

      const response = await getGrades({
        page,
        limit,
        search: search || undefined,
        active: activeParam,
      });

      return response;
    },
    initialData:
      page === 1 && limit === 10 && search === "" && activeFilter === ""
        ? initialData
        : undefined,
  });

  // 2. Mutation for toggling status
  const toggleMutation = useMutation({
    mutationFn: async (id: string) => {
      setTogglingId(id);
      return toggleGradeStatusAction(id);
    },
    onSuccess: (result) => {
      handleResponseToast(result);
      queryClient.invalidateQueries({ queryKey: ["grades"] });
    },
    onError: () => {
      handleResponseToast({
        success: false,
        message: "فشل تغيير حالة تفعيل المرحلة الدراسية.",
        data: null,
      });
    },
    onSettled: () => {
      setTogglingId(null);
    },
  });

  // 3. Mutation for creating a grade
  const createGradeMutation = useMutation({
    mutationFn: async (values: GradeFormValues) => {
      return createGradeAction({
        name: values.name,
        description: values.description || undefined,
        order: values.order,
      });
    },
    onSuccess: (result) => {
      handleResponseToast(result);
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["grades"] });
        onSuccessSubmit?.();
      }
    },
  });

  // 4. Mutation for updating a grade
  const updateGradeMutation = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: GradeFormValues }) => {
      return updateGradeAction(id, {
        name: values.name,
        description: values.description || undefined,
        order: values.order,
      });
    },
    onSuccess: (result) => {
      handleResponseToast(result);
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["grades"] });
        onSuccessSubmit?.();
      }
    },
  });

  const isSubmitting = createGradeMutation.isPending || updateGradeMutation.isPending;

  return {
    grades: gradesQuery.data?.data || [],
    total: gradesQuery.data?.meta?.total || 0,
    totalPages: gradesQuery.data?.meta?.totalPages || 1,
    isLoading: gradesQuery.isLoading,
    togglingId,
    isSubmitting,
    toggleStatus: (id: string) => toggleMutation.mutate(id),
    createGrade: (values: GradeFormValues) => createGradeMutation.mutate(values),
    updateGrade: (id: string, values: GradeFormValues) => updateGradeMutation.mutate({ id, values }),
  };
}
