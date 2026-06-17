import type { Jogador, ModoJogo, Selecao } from "@7a0/shared";
import { DiceRoll } from "@/components/draft/DiceRoll";
import { getCountryCode, POSICAO_DISPLAY } from "@/utils/pitchLayout";
import { maskPlayerName, maskRating } from "@/utils/memoria";

interface RollPanelProps {
  selecao: Selecao | null;
  loading: boolean;
  modo: ModoJogo;
  rerollsRestantes: number;
  aguardandoRoll: boolean;
  jogadores: Jogador[];
  proximaPosicao: string | null;
  timeCompleto: boolean;
  onRoll: () => void;
  onRerollTeam: () => void;
  onRerollCup: () => void;
  onEscolher: (j: Jogador) => void;
  onSimular: () => void;
}

export function RollPanel({
  selecao,
  loading,
  modo,
  rerollsRestantes,
  aguardandoRoll,
  jogadores,
  proximaPosicao,
  timeCompleto,
  onRoll,
  onRerollTeam,
  onRerollCup,
  onEscolher,
  onSimular,
}: RollPanelProps) {
  if (timeCompleto) {
    return (
      <div className="space-y-4">
        <div className="border-2 border-ink bg-white p-4 text-center">
          <p className="font-condensed text-sm font-bold uppercase">
            Team complete!
          </p>
          <p className="mt-1 text-xs text-ink-muted">
            11/11 players selected. Ready to simulate.
          </p>
        </div>
        <button type="button" onClick={onSimular} className="retro-btn w-full">
          Simulate →
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!selecao && aguardandoRoll && (
        <div className="border-2 border-ink bg-white p-4">
          <p className="mb-4 text-center font-condensed text-xs leading-relaxed text-ink-muted">
            Roll to draw a national team and a World Cup.
            {modo === "memoria" && (
              <span className="mt-1 block font-bold text-brand-red">
                From memory — player names hidden
              </span>
            )}
          </p>
          <DiceRoll rolling={loading} onRoll={onRoll} disabled={loading} />
        </div>
      )}

      {selecao && (
        <>
          <div className="border-2 border-ink bg-white p-4">
            <div className="mb-1 flex items-center gap-2">
              <span className="rounded border border-ink px-1.5 py-0.5 font-mono text-[10px] font-bold">
                {getCountryCode(selecao.pais)}
              </span>
              <span className="font-condensed text-sm font-bold uppercase">
                {selecao.pais}
              </span>
            </div>
            <p className="font-condensed text-xs text-ink-muted">
              Cup {selecao.ano}
            </p>

            {loading && (
              <div className="mt-3 flex justify-center">
                <DiceRoll rolling onRoll={() => {}} disabled />
              </div>
            )}

            {rerollsRestantes > 0 && !loading && (
              <div className="mt-4 border-t-2 border-ink/10 pt-3">
                <p className="mb-2 font-condensed text-[10px] font-bold uppercase tracking-wider text-ink-light">
                  Not feeling it? Re-roll — {rerollsRestantes} left
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onRerollTeam}
                    className="retro-btn-outline flex-1 text-[10px]"
                    title="Same World Cup year, different country"
                  >
                    Another team
                  </button>
                  <button
                    type="button"
                    onClick={onRerollCup}
                    className="retro-btn-outline flex-1 text-[10px]"
                    title="Same country, different World Cup"
                  >
                    Another cup
                  </button>
                </div>
              </div>
            )}
          </div>

          {!loading && (
            <div className="border-2 border-ink bg-white">
              <div className="border-b-2 border-ink px-3 py-2">
                <p className="font-condensed text-[10px] font-bold uppercase tracking-widest">
                  Pick a player
                  {proximaPosicao && (
                    <span className="ml-1 text-brand-red">
                      ·{" "}
                      {POSICAO_DISPLAY[
                        proximaPosicao as keyof typeof POSICAO_DISPLAY
                      ] ?? proximaPosicao}
                    </span>
                  )}
                </p>
              </div>

              <div className="max-h-[340px] overflow-y-auto">
                {jogadores.length === 0 ? (
                  <p className="p-4 text-center text-xs text-ink-muted">
                    No compatible players for this position.
                  </p>
                ) : (
                  jogadores.map((j, i) => (
                    <button
                      key={j.id}
                      type="button"
                      onClick={() => onEscolher(j)}
                      className="flex w-full items-center gap-2 border-b border-ink/10 px-3 py-2.5 text-left font-mono text-xs transition-colors hover:bg-brand-red hover:text-white last:border-0"
                    >
                      <span className="w-6 text-ink-light">#{i + 1}</span>
                      <span className="flex-1 font-semibold">
                        {maskPlayerName(modo, j.nome)}
                      </span>
                      <span className="text-ink-muted">
                        {POSICAO_DISPLAY[j.posicao]}
                        {j.posicaoAlternativa &&
                          `/${POSICAO_DISPLAY[j.posicaoAlternativa]}`}
                      </span>
                      <span className="w-8 text-right font-bold">
                        {maskRating(modo, j.forca)}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
