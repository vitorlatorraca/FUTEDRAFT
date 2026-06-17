import type { SlotTime } from "@7a0/shared";
import { SlotFormacao } from "./SlotFormacao";
import { Card } from "@/components/ui/Card";

interface TimeAtualProps {
  slots: SlotTime[];
  formacao: string;
  slotsPreenchidos: number;
}

export function TimeAtual({
  slots,
  formacao,
  slotsPreenchidos,
}: TimeAtualProps) {
  const proximoIndex = slots.findIndex((s) => s.jogador === null);

  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display font-bold text-white">
          Formação {formacao}
        </h3>
        <span className="rounded-full bg-pitch-500/20 px-3 py-1 text-xs font-medium text-pitch-400">
          {slotsPreenchidos}/11
        </span>
      </div>

      <div className="relative rounded-xl bg-pitch-800/30 p-4">
        <div className="absolute inset-0 rounded-xl border border-pitch-600/20" />
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-pitch-600/20" />
        <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-pitch-600/20" />

        <div className="relative grid grid-cols-4 gap-2">
          {slots.map((slot) => (
            <SlotFormacao
              key={slot.index}
              slot={slot}
              isNext={slot.index === proximoIndex}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}
