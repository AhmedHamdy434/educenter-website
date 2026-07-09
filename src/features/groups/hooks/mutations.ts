import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createGroupAction,
  updateGroupAction,
  deleteGroupAction,
  toggleGroupStatusAction,
  addStudentsToGroupAction,
  removeStudentsFromGroupAction,
} from "../actions/groups-actions";
import { type GroupFormValues } from "../schemas/group-schema";
import { handleResponseToast } from "@/lib/api/handleResponseToast";
import { groupsKeys } from "../utils/queryKeys";

export function useToggleGroupStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => toggleGroupStatusAction(id),
    onSuccess: (result) => {
      handleResponseToast(result);
      queryClient.invalidateQueries({ queryKey: groupsKeys.all });
    },
    onError: () => {
      handleResponseToast({
        success: false,
        message: "فشل تغيير حالة تفعيل المجموعة.",
        data: null,
      });
    },
  });
}

export function useCreateGroupMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: GroupFormValues) => {
      return createGroupAction({
        name: values.name,
        gradeId: values.gradeId,
        subjectId: values.subjectId,
        teacherId: values.teacherId,
        capacity: values.capacity || undefined,
        schedule: values.schedule,
      });
    },
    onSuccess: (result) => {
      handleResponseToast(result);
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: groupsKeys.all });
      }
    },
  });
}

export function useUpdateGroupMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: string;
      values: GroupFormValues;
    }) => {
      return updateGroupAction(id, {
        name: values.name,
        gradeId: values.gradeId,
        subjectId: values.subjectId,
        teacherId: values.teacherId,
        capacity: values.capacity || undefined,
        schedule: values.schedule,
      });
    },
    onSuccess: (result) => {
      handleResponseToast(result);
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: groupsKeys.all });
      }
    },
  });
}

export function useDeleteGroupMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => deleteGroupAction(id),
    onSuccess: (result) => {
      handleResponseToast(result);
      queryClient.invalidateQueries({ queryKey: groupsKeys.all });
    },
  });
}

export function useAddStudentsToGroupMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      studentIds,
    }: {
      id: string;
      studentIds: string[];
    }) => addStudentsToGroupAction(id, studentIds),
    onSuccess: (result) => {
      handleResponseToast(result);
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: groupsKeys.all });
      }
    },
  });
}

export function useRemoveStudentsFromGroupMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      studentIds,
    }: {
      id: string;
      studentIds: string[];
    }) => removeStudentsFromGroupAction(id, studentIds),
    onSuccess: (result) => {
      handleResponseToast(result);
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: groupsKeys.all });
      }
    },
  });
}
