import type { ResultadoPartida } from "@7a0/shared";
import { FASE_LABEL } from "@/utils/simulacao";
import { getCountryCode } from "@/utils/pitchLayout";

interface MatchRowProps {
  partida: ResultadoPartida;
}

export function MatchRow({ partida }: MatchRowProps) {
  const venceu = partida.resultado === "vitoria";
  const [golsMeu, golsDele] = partida.placar.split("-");
  const code = getCountryCode(partida.adversario.pais);

  const golsTexto =
    partida.gols && partida.gols.length > 0
      ? partida.gols
          .reduce<string[]>((acc, g) => {
            const existing = acc.find((s) => s.startsWith(g.jogador));
            if (existing) {
              const count = parseInt(existing.split("(")[1] ?? "1", 10) + 1;
              return acc.map((s) =>
                s.startsWith(g.jogador) ? `${g.jogador} (${count})` : s,
              );
            }
            return [...acc, g.jogador];
          }, [])
          .join(", ")
      : null;

  return (
    <div className="border-b-2 border-ink/10 py-4">
      <div className="flex items-start gap-4">
        {venceu && (
          <div className="mt-1 h-full w-1 self-stretch bg-brand-green-light" />
        )}

        <div className="min-w-[80px] font-condensed text-[10px] font-bold uppercase tracking-widest text-ink-light">
          {FASE_LABEL[partida.fase]}
        </div>

        <div className="flex-1">
          <p className="font-condensed text-lg font-bold uppercase">
            vs {code}{" "}
            <span className="text-ink">
              {partida.adversario.pais} {partida.adversario.ano}
            </span>
          </p>
          {golsTexto && venceu && (
            <p className="mt-1 font-mono text-xs text-ink-muted">
              <span className="font-condensed font-bold uppercase">Goals </span>
              {golsTexto}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`font-display text-4xl tracking-wide ${
              venceu ? "text-brand-green" : "text-ink"
            }`}
          >
            {golsMeu} - {golsDele}
          </span>
          {venceu && (
            <span className="text-brand-green">✓</span>
          )}
        </div>
      </div>
    </div>
  );
}
