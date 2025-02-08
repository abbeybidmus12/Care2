interface WorkerSession {
  workerId: string;
  email: string;
  name: string;
}

export const useWorkerSession = () => {
  const setSession = (session: WorkerSession) => {
    localStorage.setItem("workerSession", JSON.stringify(session));
  };

  const getSession = (): WorkerSession | null => {
    const session = localStorage.getItem("workerSession");
    return session ? JSON.parse(session) : null;
  };

  const clearSession = () => {
    localStorage.removeItem("workerSession");
  };

  return { setSession, getSession, clearSession };
};
