import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { MatchRow } from "@/components/simulacao/MatchRow";
import { useGameStore } from "@/store/gameStore";
import { useUserStore } from "@/store/userStore";
import { calcularForcaTime } from "@/utils/simulacao";
import { salvarPartida } from "@/services/api";
import { submitRoomScore } from "@/services/rooms";

export function Resultado() {
  const navigate = useNavigate();
  const estado = useGameStore((s) => s.estado);
  const resetar = useGameStore((s) => s.resetar);
  const apelido = useUserStore((s) => s.apelido);
  const salvoRef = useRef(false);

  useEffect(() => {
    if (!estado || estado.status !== "finalizado") {
      navigate("/");
    }
  }, [estado, navigate]);

  useEffect(() => {
    if (!estado || salvoRef.current || estado.status !== "finalizado") return;
    salvoRef.current = true;

    const forcaTime = calcularForcaTime(estado.slots);
    const campeao = estado.resultadoFinal === "campeao";

    salvarPartida({
      formacao: estado.formacao,
      forcaTime,
      faseAlcancada: estado.historico.at(-1)?.fase ?? "grupos",
      venceu: campeao,
      placar: estado.historico,
      pontuacao: estado.pontuacaoFinal ?? 0,
      apelido,
    }).catch(() => {});

    if (estado.roomCode && estado.playerId) {
      submitRoomScore(estado.roomCode, estado.playerId, {
        pontuacao: estado.pontuacaoFinal ?? 0,
        venceu: campeao,
      }).catch(() => {});
    }
  }, [estado, apelido]);

  if (!estado || estado.status !== "finalizado") return null;

  const campeao = estado.resultadoFinal === "campeao";
  const forcaTime = calcularForcaTime(estado.slots);

  return (
    <AppShell showGameHeader formacao={estado.formacao} estilo={estado.estilo} modo={estado.modo}>
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="mb-8 text-center">
          <p className="mb-2 font-condensed text-xs font-bold uppercase tracking-widest text-ink-light">
            {campeao ? "Champion" : "Eliminated"}
          </p>
          <h1 className="font-display text-5xl uppercase tracking-wide">
            {campeao ? "7-0! 🏆" : "Game Over"}
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            Score {estado.pontuacaoFinal} · Team strength {forcaTime}
          </p>
        </div>

        <div className="mb-8 border-2 border-ink bg-white">
          {estado.historico.map((partida, i) => (
            <MatchRow key={i} partida={partida} />
          ))}
        </div>

        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              resetar();
              navigate("/");
            }}
            className="retro-btn"
          >
            Play again →
          </button>
          <button
            type="button"
            onClick={() => navigate("/ranking")}
            className="retro-btn-outline"
          >
            Ranking
          </button>
        </div>
      </div>
    </AppShell>
  );
}
