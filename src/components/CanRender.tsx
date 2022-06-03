import { useCan } from "../hooks/useCan";

interface CanRenderProps {
  children: React.ReactNode;
  permissions?: string[];
  roles?: string[];
}

export function CanRender({ children, permissions, roles }: CanRenderProps) {
  const userCanRenderComponent = useCan({ permissions, roles });

  if (!userCanRenderComponent) return null;

  return <>{children}</>;
}
