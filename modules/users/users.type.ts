export interface Role {
  id: number;
  name: string;
}

export interface Permission {
  id: number;
  key: string;
  name: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  roles: Role[];
  permissions: Permission[];
}

export type UserListItem = Omit<User, 'password' | 'permissions'> & {
  createdAt?: Date;
  updatedAt?: Date;
};

export type UserDetail = UserListItem;

export type UserPayload = {
  name: string;
  email: string;
  password?: string;
  roleIds: number[];
};

export type ClientId = { clientId: string };
