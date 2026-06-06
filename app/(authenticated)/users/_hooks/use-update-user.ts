import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { QUERY_KEY } from '~/common/const/querykey';
import { TResponse } from '~/common/types/response';
import { updateUser } from '~/data/users/users.api';
import { FormDataUserUpdate } from '../_components/form/schema';

export const useUpdateUser = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEY.USER.UPDATE, userId],
    mutationFn: (payload: FormDataUserUpdate) => updateUser(userId, payload),
    onSuccess: async () => {
      toast.success('User updated successfully');
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY.USER.GETS] }),
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY.USER.GET_BY_ID, userId] }),
      ]);
    },
    onError: (error: AxiosError<TResponse>) => {
      toast.error(error.response?.data.message ?? 'Failed to update user');
    },
  });
};
