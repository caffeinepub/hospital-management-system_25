import { useEffect, useState } from "react";
import type { HospitalRole } from "./backend.d";
import Layout from "./components/Layout";
import { useActor } from "./hooks/useActor";
import LoginPage from "./pages/Login";

export interface CurrentUser {
  name: string;
  role: HospitalRole;
}

export default function App() {
  const { actor } = useActor();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!actor) {
      setLoading(false);
      return;
    }
    actor
      .getCallerUserProfile()
      .then((profile) => {
        if (profile) setUser({ name: profile.name, role: profile.role });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [actor]);

  const handleLogin = async (u: CurrentUser) => {
    if (actor) {
      try {
        await actor.saveCallerUserProfile({
          name: u.name,
          role: u.role,
          email: "",
          phone: "",
        });
      } catch {}
    }
    setUser(u);
  };

  const handleLogout = () => setUser(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <div
            className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center"
            style={{ background: "oklch(0.58 0.14 200)" }}
          >
            <svg
              aria-hidden="true"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="text-white"
            >
              <path
                d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14.93V17a1 1 0 0 1-2 0v-.07A8.007 8.007 0 0 1 4.07 9H5a1 1 0 0 1 0 2 6 6 0 0 0 6 6zm0-4.93V13a1 1 0 0 1-2 0v-1.07A4 4 0 0 1 8.07 9H9a1 1 0 0 1 0 2 2 2 0 0 0 2 2zm0-4.93V8a1 1 0 0 1 0-2V5.07A6 6 0 0 1 17.93 9H17a1 1 0 0 1 0-2 4 4 0 0 0-4-4z"
                fill="currentColor"
              />
            </svg>
          </div>
          <p className="text-sm text-muted-foreground">
            Loading MediCore HMS...
          </p>
        </div>
      </div>
    );
  }

  if (!user) return <LoginPage onLogin={handleLogin} />;
  return <Layout user={user} onLogout={handleLogout} />;
}
