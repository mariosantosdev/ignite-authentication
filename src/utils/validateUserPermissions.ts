type User = {
  permissions: string[];
  roles: string[];
};

type validateUserPermissionsParams = {
  user: User;
  permissions?: string[];
  roles?: string[];
};

export function validateUserPermissions({
  user,
  permissions,
  roles,
}: validateUserPermissionsParams) {
  if (permissions?.length > 0) {
    const userHasPermission = permissions.some((permission) =>
      user.permissions.includes(permission)
    );
    if (!userHasPermission) {
      return false;
    }
  }

  if (roles?.length > 0) {
    const userHasRole = roles.some((role) => user.roles.includes(role));
    if (!userHasRole) {
      return false;
    }
  }

  return true;
}
