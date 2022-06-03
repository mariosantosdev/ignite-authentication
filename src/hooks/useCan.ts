import { useAuth } from "../contexts/AuthContexts";

type UseCanParams = {
  permissions?: string[];
  roles?: string[];
};

export function useCan({ permissions, roles }: UseCanParams) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return false;

  if (permissions?.length > 0) {
    const hasAllPermissions = permissions.every((permission) =>
      user.permissions.includes(permission)
    );

    return hasAllPermissions;
  }

  if (roles?.length > 0) {
    const hasAllRoles = roles.some((role) => user.roles.includes(role));

    return hasAllRoles;
  }
}
