import { Navigate } from "react-router-dom";
import { useWorkerSession } from "@/lib/hooks/useWorkerSession";

export default function WorkerProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getSession } = useWorkerSession();
  const session = getSession();

  if (!session) {
    return <Navigate to="/worker-signin" replace />;
  }

  return <>{children}</>;
}
