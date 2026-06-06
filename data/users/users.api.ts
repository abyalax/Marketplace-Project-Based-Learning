import { TAxiosResponse, TListPagination } from '~/common/types/response';
import { api } from '~/lib/axios/api';
import { Role, UserDetail, UserPayload } from '~/modules/users/users.type';
import { TFilterUsers, UserOption } from './users.type';

export const getListUsers = (params: TFilterUsers): Promise<TAxiosResponse<TListPagination<UserOption>>> => {
  return api.get('/users', { params });
};

export const getUser = (userId: string): Promise<TAxiosResponse<UserDetail>> => {
  return api.get(`/users/${userId}`);
};

export const createUser = (payload: Required<UserPayload>) => {
  return api.post('/users', payload);
};

export const updateUser = (userId: string, payload: UserPayload) => {
  return api.put(`/users/${userId}`, payload);
};

export const deleteUser = (userId: string) => {
  return api.delete(`/users/${userId}`);
};

export const getRoles = (): Promise<TAxiosResponse<Role[]>> => {
  return api.get('/roles');
};
