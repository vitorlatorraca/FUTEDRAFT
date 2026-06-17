import type { Formacao, SlotTime } from "@7a0/shared";
import { getPitchLayout } from "@/utils/pitchLayout";

interface CampoTaticoProps {
  formacao: Formacao;
  slots: SlotTime[];
  proximoIndex: number | null;
}

export function CampoTatico({
  formacao,
  slots,
  proximoIndex,
}: CampoTaticoProps) {
  const layout = getPitchLayout(formacao);

  return (
    <div className="relative mx-auto aspect-[3/4] w-full max-w-[340px] border-4 border-ink pitch-stripes shadow-retro">
      {/* Linhas do campo */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-white/20" />
        <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/25" />
        <div className="absolute bottom-0 left-1/2 h-16 w-36 -translate-x-1/2 border-2 border-b-0 border-white/25" />
        <div className="absolute top-0 left-1/2 h-16 w-36 -translate-x-1/2 border-2 border-t-0 border-white/25" />
      </div>

      {layout.map((pos) => {
        const slot = slots[pos.index];
        const preenchido = slot?.jogador != null;
        const isNext = pos.index === proximoIndex;

        return (
          <div
            key={pos.index}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          >
            {preenchido ? (
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink bg-white font-condensed text-sm font-bold shadow-retro-sm">
                  {slot.jogador!.forca}
                </div>
                <span className="mt-0.5 max-w-[72px] truncate border border-ink bg-white px-1 font-condensed text-[9px] font-bold uppercase">
                  {slot.jogador!.nome.split(" ").pop()}
                </span>
              </div>
            ) : (
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-full border-2 border-dashed ${
                  isNext
                    ? "border-white bg-white/20 ring-2 ring-white/50"
                    : "border-white/60 bg-transparent"
                }`}
              >
                <span className="font-condensed text-[10px] font-bold text-white">
                  {pos.label}
                </span>
              </div>
            )}
          </div>
        );
      })}

      <p className="absolute bottom-2 left-0 right-0 text-center font-condensed text-[9px] font-semibold uppercase tracking-wider text-white/70">
        Tap a player to change position
      </p>
    </div>
  );
}
