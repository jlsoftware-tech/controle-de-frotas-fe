export type PermissionModule = 'users' | 'profiles' | 'secretariats';

export type PermissionAction = 'view' | 'create' | 'update' | 'delete';

/** Mapa `módulo -> ação -> permitido` retornado por `GET users/permissions`. */
export type UserPermissionsResponse = Partial<
  Record<PermissionModule, Partial<Record<PermissionAction, boolean>>>
>;
