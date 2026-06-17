import type { Formacao, SlotTime } from "@7a0/shared";
import { calcularStatsTime } from "@/utils/pitchLayout";
import { getPitchLayout } from "@/utils/pitchLayout";

interface BoxScoreProps {
  formacao: Formacao;
  slots: SlotTime[];
  slotsPreenchidos: number;
}

export function BoxScore({
  formacao,
  slots,
  slotsPreenchidos,
}: BoxScoreProps) {
  const stats = calcularStatsTime(slots);
  const layout = getPitchLayout(formacao);
  const maxAttack = 99;
  const maxDefense = 99;

  return (
    <div className="border-2 border-ink bg-white">
      <div className="flex items-center justify-between border-b-2 border-ink px-4 py-3">
        <h3 className="font-condensed text-xs font-bold uppercase tracking-widest">
          Box Score · {slotsPreenchidos}/11
        </h3>
        {slotsPreenchidos > 0 && (
          <span className="font-display text-3xl">{stats.overall}</span>
        )}
      </div>

      {slotsPreenchidos > 0 && (
        <div className="space-y-2 border-b-2 border-ink px-4 py-3">
          <StatBar label="Attack" value={stats.attack} max={maxAttack} color="bg-brand-red" />
          <StatBar label="Defense" value={stats.defense} max={maxDefense} color="bg-ink" />
        </div>
      )}

      <div className="divide-y divide-ink/10">
        {layout
          .slice()
          .sort((a, b) => a.index - b.index)
          .map((pos) => {
            const slot = slots[pos.index];
            const jogador = slot?.jogador;

            return (
              <div
                key={pos.index}
                className="flex items-center gap-2 px-4 py-2 font-mono text-xs"
              >
                <span className="w-8 font-condensed font-bold text-ink-light">
                  {pos.label}
                </span>
                {jogador ? (
                  <>
                    <span className="flex-1 truncate font-semibold">
                      {jogador.nome.split(" ").pop()}
                    </span>
                    <span className="font-bold text-brand-red">
                      {jogador.forca}
                    </span>
                  </>
                ) : (
                  <span className="flex-1 text-ink-light">—</span>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}

function StatBar({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-14 font-condensed text-[10px] font-bold uppercase">
        {label}
      </span>
      <div className="h-2 flex-1 border border-ink bg-cream">
        <div
          className={`h-full ${color}`}
          style={{ width: `${Math.min(100, (value / max) * 100)}%` }}
        />
      </div>
      <span className="w-6 text-right font-mono text-xs font-bold">{value}</span>
    </div>
  );
}
