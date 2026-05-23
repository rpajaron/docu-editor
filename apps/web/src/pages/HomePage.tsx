import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "../components/docs/Icon.js";

interface CreateRoomResponse {
  roomId: string;
  joinUrl: string;
  createdAt: string;
}

export function HomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreateRoom(): Promise<void> {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/rooms", { method: "POST" });
      if (!response.ok) {
        throw new Error(`Failed to create document (${response.status})`);
      }
      const data = (await response.json()) as CreateRoomResponse;
      navigate(data.joinUrl);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="home">
      <header className="home__bar">
        <div className="home__brand">
          <Icon name="description" filled className="home__brand-icon" />
          <span className="home__brand-text">Docs</span>
        </div>
      </header>

      <main className="home__main">
        <h1 className="home__title">Start a new document</h1>
        <p className="home__section-label">Blank</p>
        <div className="home__templates">
          <button
            type="button"
            className="home__template"
            disabled={loading}
            onClick={() => {
              void handleCreateRoom();
            }}
          >
            <div className="home__template-preview home__template-preview--blank">
              <Icon name="add" />
            </div>
            <span className="home__template-label">
              {loading ? "Creating…" : "Blank document"}
            </span>
          </button>

          <button
            type="button"
            className="home__template"
            onClick={() => {
              navigate("/r/demo");
            }}
          >
            <div className="home__template-preview home__template-preview--demo">
              <div className="home__template-lines" aria-hidden>
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
            <span className="home__template-label">Demo document</span>
          </button>
        </div>

        {error ? <p className="home__error" role="alert">{error}</p> : null}
      </main>
    </div>
  );
}
