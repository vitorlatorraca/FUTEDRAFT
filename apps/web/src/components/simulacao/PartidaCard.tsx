import { motion } from "framer-motion";
import type { ResultadoPartida } from "@7a0/shared";
import { Card } from "@/components/ui/Card";
import { FASE_LABEL } from "@/utils/simulacao";
import { Trophy, Skull } from "lucide-react";

interface PartidaCardProps {
  resultado: ResultadoPartida;
  meuTimeLabel?: string;
}

export function PartidaCard({
  resultado,
  meuTimeLabel = "Seu Time",
}: PartidaCardProps) {
  const venceu = resultado.resultado === "vitoria";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <Card
        className={`p-6 ${venceu ? "border-pitch-500/30" : "border-red-500/30"}`}
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-medium text-white/60">
            {FASE_LABEL[resultado.fase]}
          </span>
          {venceu ? (
            <Trophy className="h-5 w-5 text-pitch-400" />
          ) : (
            <Skull className="h-5 w-5 text-red-400" />
          )}
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 text-center">
            <p className="text-sm text-white/50">{meuTimeLabel}</p>
            <p className="font-display text-4xl font-bold text-white">
              {resultado.placar.split("-")[0]}
            </p>
            <p className="text-xs text-white/40">
              Força: {resultado.meuTime}
            </p>
          </div>

          <span className="text-2xl font-bold text-white/30">×</span>

          <div className="flex-1 text-center">
            <p className="text-sm text-white/50">
              {resultado.adversario.pais} {resultado.adversario.ano}
            </p>
            <p className="font-display text-4xl font-bold text-white">
              {resultado.placar.split("-")[1]}
            </p>
            <p className="text-xs text-white/40">
              Força: {resultado.forcaAdversario}
            </p>
          </div>
        </div>

        <p
          className={`mt-4 text-center text-sm font-semibold ${
            venceu ? "text-pitch-400" : "text-red-400"
          }`}
        >
          {venceu ? "Vitória!" : "Derrota"}
        </p>
      </Card>
    </motion.div>
  );
}
