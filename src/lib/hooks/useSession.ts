interface CareHomeSession {
  careHomeId: string;
  email: string;
  name: string;
}

export const useSession = () => {
  const setSession = (session: CareHomeSession) => {
    localStorage.setItem("careHomeSession", JSON.stringify(session));
  };

  const getSession = (): CareHomeSession | null => {
    const session = localStorage.getItem("careHomeSession");
    return session ? JSON.parse(session) : null;
  };

  const clearSession = () => {
    localStorage.removeItem("careHomeSession");
  };

  return { setSession, getSession, clearSession };
};
