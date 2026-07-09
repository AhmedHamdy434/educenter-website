import { useQuery } from "@tanstack/react-query";
import { getTeachers } from "../actions/teachers-actions";
import { teachersKeys } from "../utils/queryKeys";
import { type Teacher } from "../types";
import { QueryParams, type ApiResponse } from "@/types";

export function useTeachersQuery(
  params: QueryParams & { subjectId?: string },
  initialData: ApiResponse<Teacher[]>,
) {
  // Only use initialData when params match initial state (page 1, limit 10, no search, no active filter, no subjectId filter)
  const isInitialParams =
    params.page === 1 &&
    params.limit === 10 &&
    !params.search &&
    (params.active === null || params.active === undefined || (params.active as unknown) === "") &&
    !params.subjectId;

  return useQuery({
    queryKey: teachersKeys.list(params),
    queryFn: async () => {
      return getTeachers(params);
    },
    initialData: isInitialParams ? initialData : undefined,
  });
}
