import { motion } from "framer-motion";
import type { Jogador } from "@7a0/shared";
import { Card } from "@/components/ui/Card";
import { POSICAO_LABEL } from "@/utils/formacoes";

interface ListaJogadoresProps {
  jogadores: Jogador[];
  posicao: string | null;
  onEscolher: (jogador: Jogador) => void;
}

export function ListaJogadores({
  jogadores,
  posicao,
  onEscolher,
}: ListaJogadoresProps) {
  if (!posicao) {
    return (
      <Card className="p-6 text-center text-white/50">
        Time completo!
      </Card>
    );
  }

  return (
    <div>
      <h3 className="mb-3 text-sm font-medium text-white/60">
        Escolha um{" "}
        <span className="text-pitch-400">
          {POSICAO_LABEL[posicao as keyof typeof POSICAO_LABEL] ?? posicao}
        </span>
      </h3>

      {jogadores.length === 0 ? (
        <Card className="p-6 text-center text-white/50">
          Nenhum jogador compatível nesta seleção.
        </Card>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {jogadores.map((jogador, i) => (
            <motion.div
              key={jogador.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card
                hover
                className="cursor-pointer p-4"
                onClick={() => onEscolher(jogador)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">{jogador.nome}</p>
                    <p className="text-xs text-white/50">
                      {jogador.posicao}
                      {jogador.posicaoAlternativa &&
                        ` / ${jogador.posicaoAlternativa}`}
                    </p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pitch-500/20 font-display text-lg font-bold text-pitch-400">
                    {jogador.forca}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
