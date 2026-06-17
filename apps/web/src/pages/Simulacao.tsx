import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { MatchRow } from "@/components/simulacao/MatchRow";
import { useSimulacao } from "@/hooks/useSimulacao";
import { FASE_LABEL } from "@/utils/simulacao";

export function Simulacao() {
  const navigate = useNavigate();
  const { estado, simulando, jogarFase } = useSimulacao();
  const [modoAuto, setModoAuto] = useState(false);

  useEffect(() => {
    if (!estado) {
      navigate("/");
      return;
    }
    if (estado.status === "draft") {
      navigate("/draft");
      return;
    }
    if (estado.status === "finalizado") {
      navigate("/resultado");
    }
  }, [estado, navigate]);

  if (!estado) return null;

  const historico = estado.historico;
  const proximaFase = estado.faseAtual;
  const partidasRestantes =
    estado.status !== "finalizado" && historico.length < 5;

  const handleReveal = async () => {
    const resultado = await jogarFase();
    if (!resultado) return;

    const finalizado =
      resultado.resultado === "derrota" ||
      (resultado.fase === "final" && resultado.resultado === "vitoria");

    if (finalizado) {
      setTimeout(() => navigate("/resultado"), 800);
    } else if (modoAuto) {
      setTimeout(handleReveal, 1200);
    }
  };

  const revealLabel =
    historico.length === 0
      ? "Reveal 1st match →"
      : `Reveal ${FASE_LABEL[proximaFase].toLowerCase()} →`;

  return (
    <AppShell showGameHeader formacao={estado.formacao} estilo={estado.estilo} modo={estado.modo}>
      <div className="divider-h bg-cream px-4 py-3">
        <div className="mx-auto flex max-w-2xl items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setModoAuto(false)}
            className={`pill-btn ${!modoAuto ? "pill-btn-active" : "pill-btn-inactive"}`}
          >
            Match by match
          </button>
          <button
            type="button"
            onClick={() => setModoAuto(true)}
            className={`pill-btn ${modoAuto ? "pill-btn-active" : "pill-btn-inactive"}`}
          >
            Automatic
          </button>
          <button type="button" className="pill-btn pill-btn-inactive">
            Normal ▾
          </button>
          <button type="button" className="retro-btn-outline text-[10px]">
            Settings
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-8 text-center font-display text-4xl uppercase tracking-wide">
          The Run
        </h1>

        {historico.length > 0 && (
          <div className="mb-8">
            {historico.map((partida, i) => (
              <MatchRow key={i} partida={partida} />
            ))}
          </div>
        )}

        {partidasRestantes && estado.status !== "finalizado" && (
          <div className="flex justify-center py-8">
            <button
              type="button"
              onClick={handleReveal}
              disabled={simulando}
              className="retro-btn px-10 py-4 text-base disabled:opacity-50"
            >
              {simulando ? "Simulating..." : revealLabel}
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
