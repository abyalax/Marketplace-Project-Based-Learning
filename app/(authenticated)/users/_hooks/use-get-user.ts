import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '~/common/const/querykey';
import { getUser } from '~/data/users/users.api';

export const queryGetUser = (userId: string) =>
  queryOptions({
    queryKey: [QUERY_KEY.USER.GET_BY_ID, userId],
    queryFn: () => getUser(userId),
    select: (data) => data.data.data,
  });

export const useGetUser = (userId: string) => {
  return useSuspenseQuery(queryGetUser(userId));
};
