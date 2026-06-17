import type { SlotTime } from "@7a0/shared";
import { POSICAO_LABEL } from "@/utils/formacoes";

interface SlotFormacaoProps {
  slot: SlotTime;
  isNext: boolean;
}

export function SlotFormacao({ slot, isNext }: SlotFormacaoProps) {
  const preenchido = slot.jogador !== null;

  return (
    <div
      className={`flex flex-col items-center rounded-lg border p-2 transition-all ${
        isNext
          ? "border-pitch-400 bg-pitch-500/10 ring-2 ring-pitch-400/50"
          : preenchido
            ? "border-white/20 bg-white/5"
            : "border-white/5 bg-white/[0.02]"
      }`}
    >
      <span className="text-[10px] font-medium uppercase tracking-wider text-white/40">
        {slot.posicao}
      </span>
      {preenchido ? (
        <>
          <span className="mt-1 text-center text-xs font-semibold text-white leading-tight">
            {slot.jogador!.nome.split(" ").pop()}
          </span>
          <span className="text-[10px] text-pitch-400">
            {slot.jogador!.forca}
          </span>
        </>
      ) : (
        <span className="mt-1 text-xs text-white/20">
          {POSICAO_LABEL[slot.posicao].split(" ")[0]}
        </span>
      )}
    </div>
  );
}
