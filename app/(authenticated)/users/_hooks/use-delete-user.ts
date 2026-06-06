import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { QUERY_KEY } from '~/common/const/querykey';
import { TResponse } from '~/common/types/response';
import { deleteUser } from '~/data/users/users.api';

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEY.USER.DELETE],
    mutationFn: deleteUser,
    onSuccess: async () => {
      toast.success('User deleted successfully');
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.USER.GETS] });
    },
    onError: (error: AxiosError<TResponse>) => {
      toast.error(error.response?.data.message ?? 'Failed to delete user');
    },
  });
};
