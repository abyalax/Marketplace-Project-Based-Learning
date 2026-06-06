import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '~/common/const/querykey';
import { getListUsers } from '~/data/users/users.api';
import { TFilterUsers } from '~/data/users/users.type';

export const queryGetUsers = (params: TFilterUsers) =>
  queryOptions({
    queryKey: [QUERY_KEY.USER.GETS, params],
    queryFn: () => getListUsers(params),
    select: (data) => data.data.data,
  });

export const useGetUsers = (params: TFilterUsers) => {
  return useSuspenseQuery(queryGetUsers(params));
};
