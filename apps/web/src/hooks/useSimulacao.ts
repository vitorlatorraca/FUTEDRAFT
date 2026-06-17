import { useCallback, useState } from "react";
import type { ResultadoPartida } from "@7a0/shared";
import { useGameStore } from "@/store/gameStore";
import { getSelecaoAleatoria } from "@/services/jogadores";

export function useSimulacao() {
  const estado = useGameStore((s) => s.estado);
  const simularProximaFase = useGameStore((s) => s.simularProximaFase);
  const getForcaTime = useGameStore((s) => s.getForcaTime);
  const [simulando, setSimulando] = useState(false);

  const jogarFase = useCallback(async () => {
    if (!estado || simulando || estado.status === "finalizado") return null;
    setSimulando(true);

    try {
      const adversario = await getSelecaoAleatoria();
      const resultado = simularProximaFase(adversario);
      return resultado;
    } finally {
      setSimulando(false);
    }
  }, [estado, simulando, simularProximaFase]);

  return {
    estado,
    forcaTime: getForcaTime(),
    simulando,
    jogarFase,
  };
}
