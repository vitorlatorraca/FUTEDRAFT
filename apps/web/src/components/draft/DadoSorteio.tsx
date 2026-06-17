import { motion } from "framer-motion";
import { Dices, RefreshCw } from "lucide-react";
import type { Selecao } from "@7a0/shared";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface DadoSorteioProps {
  selecao: Selecao | null;
  rerollsRestantes: number;
  loading: boolean;
  onReroll: () => void;
}

export function DadoSorteio({
  selecao,
  rerollsRestantes,
  loading,
  onReroll,
}: DadoSorteioProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            animate={loading ? { rotate: 360 } : { rotate: 0 }}
            transition={
              loading
                ? { repeat: Infinity, duration: 0.8, ease: "linear" }
                : {}
            }
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-pitch-500/20"
          >
            <Dices className="h-6 w-6 text-pitch-400" />
          </motion.div>
          <div>
            <p className="text-sm text-white/50">Seleção sorteada</p>
            {loading ? (
              <p className="font-display text-lg font-bold text-white">
                Sorteando...
              </p>
            ) : selecao ? (
              <p className="font-display text-lg font-bold text-white">
                {selecao.pais}{" "}
                <span className="text-pitch-400">{selecao.ano}</span>
              </p>
            ) : (
              <p className="text-white/40">Aguardando sorteio</p>
            )}
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={onReroll}
          disabled={rerollsRestantes === 0 || loading || !selecao}
        >
          <RefreshCw className="h-4 w-4" />
          Reroll ({rerollsRestantes})
        </Button>
      </div>
    </Card>
  );
}
