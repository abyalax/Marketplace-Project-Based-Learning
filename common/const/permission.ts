/** biome-ignore-all lint/style/useNamingConvention: permission namespaces are intentionally uppercase */
export type roles = 'Learner' | 'Mentor' | 'Admin';

export const ROLE = Object.freeze({
  LEARNER: 'Learner',
  MENTOR: 'Mentor',
  ADMIN: 'Admin',
} as const);

export const PERMISSIONS = Object.freeze({
  USERS: {
    READ: 'users:read',
    CREATE: 'users:create',
    UPDATE: 'users:update',
    DELETE: 'users:delete',
  },
  LEARNER: {
    READ_PROJECT: 'project:read',
    READ_CLASS: 'class:read',
    READ_MESSAGES: 'messages:read',
    CREATE_ENROLLMENT: 'enrollment:create',
    READ_ENROLLMENT: 'enrollment:read',
    UPDATE_PROGRESS: 'progress:update',
    CREATE_BOOKMARK: 'bookmark:create',
    DELETE_BOOKMARK: 'bookmark:delete',
    CREATE_ORDER: 'order:create',
    READ_ORDER: 'order:read',
    READ_SUBSCRIPTION: 'subscription:read',
  },
  MENTOR: {
    CREATE_PROJECT: 'project:create',
    READ_PROJECT: 'project:read',
    UPDATE_PROJECT: 'project:update',
    DELETE_PROJECT: 'project:delete',
    PUBLISH_PROJECT: 'project:publish',
    CREATE_CLASS: 'class:create',
    READ_CLASS: 'class:read',
    UPDATE_CLASS: 'class:update',
    DELETE_CLASS: 'class:delete',
    UPLOAD_ASSET: 'asset:create',
    READ_ASSET: 'asset:read',
    DELETE_ASSET: 'asset:delete',
    READ_ENROLLMENT: 'enrollment:read',
    READ_REVENUE: 'revenue:read',
    READ_PAYOUT: 'payout:read',
  },
  ADMIN: {
    MANAGE_USERS: 'admin:users',
    MANAGE_MENTORS: 'admin:mentors',
    MODERATE_PROJECTS: 'admin:projects',
    MODERATE_CLASSES: 'admin:classes',
    READ_TRAFFIC: 'admin:traffic',
    READ_REVENUE: 'admin:revenue',
    MANAGE_PAYMENTS: 'payment:manage',
    MANAGE_SUBSCRIPTIONS: 'subscription:manage',
    MANAGE_SETTINGS: 'admin:settings',
  },
} as const);
