
// Auto-generated file - do not edit manually
// Generated at: 2026-06-06T12:36:22.035Z

// Hierarchical permissions (includes parent route permissions)
export const routePermissions: Record<string, string[]> = {
  "/users": [
    "users:read"
  ],
  "/users/[userId]": [
    "users:read"
  ],
  "/users/create": [
    "users:read",
    "users:create"
  ],
  "/client/[clientId]/messages": [
    "messages:read"
  ],
  "/client/[clientId]/cv": [],
  "/users/:userId": [
    "users:read"
  ],
  "/client": [],
  "/client/[clientId]": [],
  "/client/:clientId/messages": [
    "messages:read"
  ],
  "/client/:clientId/cv": []
} as const;
