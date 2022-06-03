import { useAuth } from "../contexts/AuthContexts";

type UseCanParams = {
  persmissions?: string[];
  roles?: string[];
};

export function useCan({ persmissions, roles }: UseCanParams) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return false;

  if (persmissions?.length > 0) {
    const hasAllPermissions = persmissions.every((permission) =>
      user.permissions.includes(permission)
    );

    return hasAllPermissions;
  }

  if (roles?.length > 0) {
    const hasAllRoles = roles.some((role) => user.roles.includes(role));

    return hasAllRoles;
  }
}
