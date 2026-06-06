import { ExtractString } from '~/lib/utils';

export const QUERY_KEY = {
  AUTH: {
    LOGIN: 'login',
    REGISTER: 'register',
    LOGOUT: 'logout',
    FORGOT_PASSWORD: 'forgot_password',
    RESET_PASSWORD: 'reset_password',
  },
  PROJECT: {
    GETS: 'get_projects',
    GET_BY_ID: 'get_project_by_id',
    CREATE: 'create_project',
    UPDATE: 'update_project',
    DELETE: 'delete_project',
  },
  CLASS: {
    GETS: 'get_classes',
    GET_BY_ID: 'get_class_by_id',
    CREATE: 'create_class',
    UPDATE: 'update_class',
    DELETE: 'delete_class',
  },
  USER: {
    GETS: 'get_users',
    GET_BY_ID: 'get_user_by_id',
    CREATE: 'create_user',
    UPDATE: 'update_user',
    DELETE: 'delete_user',
  },
  ROLE: {
    GETS: 'get_roles',
  },
} as const;

export type QueryKey<T = string> = ExtractString<typeof QUERY_KEY> & T;
