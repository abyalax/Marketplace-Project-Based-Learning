import { MetaRequest } from '~/common/types/meta';
import { UserDetail, UserListItem, UserPayload } from '~/modules/users/users.type';

export type TFilterUsers = MetaRequest<UserListItem>;
export type PayloadUser = UserPayload;
export type UserOption = UserListItem;
export type UserRecord = UserDetail;
