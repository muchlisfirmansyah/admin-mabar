const SESSION_KEY = "mabar_session";
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 jam

interface Session {
  username: string;
  expiresAt: number;
}

export function createSession(username: string): void {
  const session: Session = {
    username,
    expiresAt: Date.now() + SESSION_DURATION_MS,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    const session: Session = JSON.parse(raw);
    if (!session.expiresAt || Date.now() > session.expiresAt) {
      destroySession();
      return null;
    }
    return session;
  } catch {
    destroySession();
    return null;
  }
}

export function destroySession(): void {
  localStorage.removeItem(SESSION_KEY);
}
