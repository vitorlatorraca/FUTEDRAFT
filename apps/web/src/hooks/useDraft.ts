import type { ModoJogo, TipoReroll } from "@7a0/shared";
import { useGameStore } from "@/store/gameStore";

export function useDraft() {
  const estado = useGameStore((s) => s.estado);
  const loading = useGameStore((s) => s.loading);
  const sortearSelecao = useGameStore((s) => s.sortearSelecao);
  const usarReroll = useGameStore((s) => s.usarReroll);
  const escolherJogador = useGameStore((s) => s.escolherJogador);
  const setFormacao = useGameStore((s) => s.setFormacao);
  const setEstilo = useGameStore((s) => s.setEstilo);
  const setModo = useGameStore((s) => s.setModo);
  const getJogadoresDisponiveis = useGameStore((s) => s.getJogadoresDisponiveis);
  const getProximaPosicao = useGameStore((s) => s.getProximaPosicao);

  const jogadoresDisponiveis = getJogadoresDisponiveis();
  const proximaPosicao = getProximaPosicao();
  const slotsPreenchidos = estado?.slots.filter((s) => s.jogador).length ?? 0;
  const timeCompleto = slotsPreenchidos === 11;
  const aguardandoRoll = !estado?.selecaoAtual && !timeCompleto;
  const modo: ModoJogo = estado?.modo ?? "classico";

  const rerollTeam = () => usarReroll("team" as TipoReroll);
  const rerollCup = () => usarReroll("cup" as TipoReroll);

  return {
    estado,
    loading,
    modo,
    jogadoresDisponiveis,
    proximaPosicao,
    slotsPreenchidos,
    timeCompleto,
    aguardandoRoll,
    sortearSelecao,
    rerollTeam,
    rerollCup,
    escolherJogador,
    setFormacao,
    setEstilo,
    setModo,
  };
}
