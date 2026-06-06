import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '~/common/const/querykey';
import { getRoles } from '~/data/users/users.api';

export const queryGetRoles = () =>
  queryOptions({
    queryKey: [QUERY_KEY.ROLE.GETS],
    queryFn: getRoles,
    select: (data) => data.data.data,
  });

export const useGetRoles = () => {
  return useSuspenseQuery(queryGetRoles());
};
