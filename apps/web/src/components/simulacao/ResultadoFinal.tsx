import { motion } from "framer-motion";
import { Trophy, Skull, RotateCcw, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import type { ResultadoPartida } from "@7a0/shared";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FASE_LABEL } from "@/utils/simulacao";

interface ResultadoFinalProps {
  campeao: boolean;
  historico: ResultadoPartida[];
  pontuacao: number;
  forcaTime: number;
  onJogarNovamente: () => void;
}

export function ResultadoFinal({
  campeao,
  historico,
  pontuacao,
  forcaTime,
  onJogarNovamente,
}: ResultadoFinalProps) {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          animate={campeao ? { rotate: [0, -5, 5, 0] } : {}}
          transition={{ repeat: campeao ? Infinity : 0, duration: 2 }}
          className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full ${
            campeao ? "bg-gold-500/20" : "bg-red-500/20"
          }`}
        >
          {campeao ? (
            <Trophy className="h-10 w-10 text-gold-400" />
          ) : (
            <Skull className="h-10 w-10 text-red-400" />
          )}
        </motion.div>

        <h1 className="font-display text-3xl font-bold text-white">
          {campeao ? "Campeão! 🏆" : "Game Over 💀"}
        </h1>
        <p className="mt-2 text-white/60">
          {campeao
            ? "Você conquistou a Copa do Mundo!"
            : "Seu time foi eliminado do campeonato."}
        </p>
      </motion.div>

      <Card className="p-6">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-sm text-white/50">Força do Time</p>
            <p className="font-display text-2xl font-bold text-white">
              {forcaTime}
            </p>
          </div>
          <div>
            <p className="text-sm text-white/50">Pontuação</p>
            <p className="font-display text-2xl font-bold text-pitch-400">
              {pontuacao}
            </p>
          </div>
        </div>
      </Card>

      {historico.length > 0 && (
        <Card className="p-4">
          <h3 className="mb-3 text-sm font-medium text-white/60">
            Histórico de Partidas
          </h3>
          <div className="space-y-2">
            {historico.map((partida, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-sm"
              >
                <span className="text-white/70">
                  {FASE_LABEL[partida.fase]}
                </span>
                <span className="text-white/50">
                  vs {partida.adversario.pais}
                </span>
                <span
                  className={
                    partida.resultado === "vitoria"
                      ? "text-pitch-400"
                      : "text-red-400"
                  }
                >
                  {partida.placar}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="flex gap-3">
        <Button className="flex-1" onClick={onJogarNovamente}>
          <RotateCcw className="h-4 w-4" />
          Jogar Novamente
        </Button>
        <Link to="/ranking" className="flex-1">
          <Button variant="secondary" className="w-full">
            <BarChart3 className="h-4 w-4" />
            Ranking
          </Button>
        </Link>
      </div>
    </div>
  );
}
