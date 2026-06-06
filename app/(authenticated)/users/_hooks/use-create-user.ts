import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { QUERY_KEY } from '~/common/const/querykey';
import { TResponse } from '~/common/types/response';
import { createUser } from '~/data/users/users.api';
import { FormDataUserCreate } from '../_components/form/schema';

export const useCreateUser = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEY.USER.CREATE],
    mutationFn: (payload: FormDataUserCreate) => createUser(payload),
    onSuccess: async () => {
      toast.success('User created successfully');
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.USER.GETS] });
      router.push('/users');
    },
    onError: (error: AxiosError<TResponse>) => {
      toast.error(error.response?.data.message ?? 'Failed to create user');
    },
  });
};
