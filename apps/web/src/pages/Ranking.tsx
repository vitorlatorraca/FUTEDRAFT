import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { RankingEntry } from "@7a0/shared";
import { AppShell } from "@/components/layout/AppShell";
import { getRanking } from "@/services/api";

export function Ranking() {
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getRanking()
      .then(setRanking)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="font-display text-4xl uppercase tracking-wide">
            Ranking
          </h1>
          <p className="mt-2 text-sm text-ink-muted">Top 100 best runs</p>
        </div>

        {loading && (
          <p className="border-2 border-ink bg-white p-8 text-center text-ink-muted">
            Loading...
          </p>
        )}

        {error && (
          <div className="border-2 border-ink bg-white p-8 text-center">
            <p className="text-ink-muted">Ranking unavailable — start the API.</p>
            <Link to="/" className="retro-btn mt-4 inline-flex">
              Back home
            </Link>
          </div>
        )}

        {!loading && !error && ranking.length === 0 && (
          <p className="border-2 border-ink bg-white p-8 text-center text-ink-muted">
            No runs yet. Be the first!
          </p>
        )}

        {!loading && ranking.length > 0 && (
          <div className="border-2 border-ink bg-white divide-y-2 divide-ink/10">
            {ranking.map((entry, i) => (
              <div key={entry.id} className="flex items-center gap-4 px-4 py-3">
                <span className="w-8 font-display text-xl text-ink-light">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="font-semibold">{entry.apelido ?? "Anonymous"}</p>
                  <p className="font-mono text-xs text-ink-muted">
                    {entry.formacao} · {entry.faseAlcancada}
                    {entry.venceu && " · 🏆"}
                  </p>
                </div>
                <span className="font-display text-2xl text-brand-red">
                  {entry.pontuacao}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
