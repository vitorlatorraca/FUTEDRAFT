import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Room } from "@7a0/shared";
import { AppShell } from "@/components/layout/AppShell";
import { createRoom, getRoom, joinRoom } from "@/services/rooms";
import { useGameStore } from "@/store/gameStore";

export function Friends() {
  const navigate = useNavigate();
  const iniciarJogo = useGameStore((s) => s.iniciarJogo);
  const [room, setRoom] = useState<Room | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [name, setName] = useState("Player");
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!room) return;
    const interval = setInterval(async () => {
      try {
        const updated = await getRoom(room.code);
        setRoom(updated);
      } catch {
        /* room expired */
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [room?.code]);

  const handleCreate = async () => {
    setLoading(true);
    setError("");
    try {
      const newRoom = await createRoom(name);
      setRoom(newRoom);
      setPlayerId(newRoom.hostId);
    } catch {
      setError("Could not create room. Is the API running?");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!joinCode.trim()) return;
    setLoading(true);
    setError("");
    try {
      const joined = await joinRoom(joinCode.trim().toUpperCase(), name);
      setRoom(joined);
      const me = joined.players[joined.players.length - 1];
      setPlayerId(me.id);
    } catch {
      setError("Room not found or full.");
    } finally {
      setLoading(false);
    }
  };

  const handleStart = () => {
    if (!room || !playerId) return;
    iniciarJogo({
      formacao: "4-4-2",
      estilo: "equilibrado",
      modo: "classico",
      roomCode: room.code,
      playerId,
    });
    navigate("/draft");
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-lg px-4 py-12">
        <h1 className="mb-2 text-center font-display text-4xl uppercase">
          With Friends
        </h1>
        <p className="mb-8 text-center text-sm text-ink-muted">
          Create a room, share the code, compete for the best run.
        </p>

        {!room ? (
          <div className="space-y-4 border-2 border-ink bg-white p-6">
            <label className="block">
              <span className="font-condensed text-xs font-bold uppercase tracking-wider">
                Your name
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full border-2 border-ink px-3 py-2 font-mono text-sm"
              />
            </label>

            <button
              type="button"
              onClick={handleCreate}
              disabled={loading}
              className="retro-btn w-full"
            >
              Create room
            </button>

            <div className="divider-h pt-4">
              <label className="block">
                <span className="font-condensed text-xs font-bold uppercase tracking-wider">
                  Join with code
                </span>
                <input
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="ABC123"
                  maxLength={6}
                  className="mt-1 w-full border-2 border-ink px-3 py-2 font-mono text-sm uppercase"
                />
              </label>
              <button
                type="button"
                onClick={handleJoin}
                disabled={loading}
                className="retro-btn-outline mt-3 w-full"
              >
                Join room
              </button>
            </div>

            {error && (
              <p className="text-center text-xs text-brand-red">{error}</p>
            )}

            <p className="text-center text-[10px] text-ink-light">
              Requires API on port 3001
            </p>
          </div>
        ) : (
          <div className="space-y-4 border-2 border-ink bg-white p-6">
            <div className="text-center">
              <p className="font-condensed text-xs uppercase tracking-widest text-ink-light">
                Room code
              </p>
              <p className="font-display text-5xl tracking-widest">{room.code}</p>
              <p className="mt-1 text-xs text-ink-muted">
                Share this code with friends
              </p>
            </div>

            <div className="divide-y-2 divide-ink/10">
              {room.players.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between py-2 font-mono text-sm"
                >
                  <span className="font-semibold">
                    {p.name}
                    {p.id === playerId && " (you)"}
                  </span>
                  <span className="text-ink-muted">
                    {p.status === "finished"
                      ? `${p.pontuacao} pts${p.venceu ? " 🏆" : ""}`
                      : p.status}
                  </span>
                </div>
              ))}
            </div>

            <button type="button" onClick={handleStart} className="retro-btn w-full">
              Start your run →
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
