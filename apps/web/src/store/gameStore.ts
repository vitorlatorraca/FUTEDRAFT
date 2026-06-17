import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  EstadoJogo,
  EstiloJogo,
  Formacao,
  FaseCampeonato,
  Jogador,
  ModoJogo,
  ResultadoPartida,
  Selecao,
  SlotTime,
  TipoReroll,
} from "@7a0/shared";
import { FASES_CAMPEONATO } from "@7a0/shared";
import { getFormationConfig } from "@/utils/formacoes";
import {
  calcularForcaTime,
  calcularPontuacao,
  simularPartida,
} from "@/utils/simulacao";
import {
  filtrarJogadoresPorPosicao,
  getOutraSelecaoMesmoAno,
  getOutraSelecaoMesmoPais,
  getSelecaoAleatoria,
} from "@/services/jogadores";

const ROLL_ANIMATION_MS = 900;

interface IniciarJogoParams {
  formacao: Formacao;
  estilo?: EstiloJogo;
  modo?: ModoJogo;
  roomCode?: string;
  playerId?: string;
}

function criarEstadoInicial({
  formacao,
  estilo = "equilibrado",
  modo = "classico",
  roomCode,
  playerId,
}: IniciarJogoParams): EstadoJogo {
  const config = getFormationConfig(formacao);
  const slots: SlotTime[] = config.slots.map((posicao, index) => ({
    posicao,
    jogador: null,
    index,
  }));

  return {
    formacao,
    estilo,
    modo,
    slots,
    rerollsRestantes: 3,
    selecaoAtual: null,
    faseAtual: "grupos",
    historico: [],
    status: "draft",
    roomCode,
    playerId,
  };
}

function getProximoSlotAberto(slots: SlotTime[]): SlotTime | null {
  return slots.find((s) => s.jogador === null) ?? null;
}

function getIdsUsados(slots: SlotTime[]): Set<string> {
  const ids = new Set<string>();
  for (const slot of slots) {
    if (slot.jogador) ids.add(slot.jogador.id);
  }
  return ids;
}

function timeCompleto(slots: SlotTime[]): boolean {
  return slots.every((s) => s.jogador !== null);
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface GameStore {
  estado: EstadoJogo | null;
  selecoesUsadas: Selecao[];
  loading: boolean;

  iniciarJogo: (params: IniciarJogoParams) => void;
  setFormacao: (formacao: Formacao) => void;
  setEstilo: (estilo: EstiloJogo) => void;
  setModo: (modo: ModoJogo) => void;
  sortearSelecao: () => Promise<void>;
  usarReroll: (tipo: TipoReroll) => Promise<void>;
  escolherJogador: (jogador: Jogador) => void;
  simularProximaFase: (adversario: Selecao) => ResultadoPartida | null;
  getJogadoresDisponiveis: () => Jogador[];
  getProximaPosicao: () => string | null;
  getForcaTime: () => number;
  resetar: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      estado: null,
      selecoesUsadas: [],
      loading: false,

      iniciarJogo: (params) => {
        set({
          estado: criarEstadoInicial(params),
          selecoesUsadas: [],
        });
      },

      setFormacao: (formacao) => {
        const { estado } = get();
        if (!estado || estado.slots.some((s) => s.jogador)) return;
        set({
          estado: criarEstadoInicial({
            formacao,
            estilo: estado.estilo,
            modo: estado.modo,
            roomCode: estado.roomCode,
            playerId: estado.playerId,
          }),
        });
      },

      setEstilo: (estilo) => {
        const { estado } = get();
        if (!estado) return;
        set({ estado: { ...estado, estilo } });
      },

      setModo: (modo) => {
        const { estado } = get();
        if (!estado) return;
        set({ estado: { ...estado, modo } });
      },

      sortearSelecao: async () => {
        const { selecoesUsadas, estado } = get();
        if (!estado || estado.selecaoAtual || get().loading) return;

        set({ loading: true });
        try {
          const [selecao] = await Promise.all([
            getSelecaoAleatoria(selecoesUsadas),
            delay(ROLL_ANIMATION_MS),
          ]);
          set({
            estado: { ...get().estado!, selecaoAtual: selecao },
            loading: false,
          });
        } catch {
          set({ loading: false });
        }
      },

      usarReroll: async (tipo) => {
        const { estado, selecoesUsadas } = get();
        if (!estado || estado.rerollsRestantes === 0 || !estado.selecaoAtual)
          return;

        const atual = estado.selecaoAtual;
        set({
          selecoesUsadas: [...selecoesUsadas, atual],
          loading: true,
          estado: {
            ...estado,
            rerollsRestantes: estado.rerollsRestantes - 1,
            selecaoAtual: null,
          },
        });

        try {
          const fetcher =
            tipo === "team" ? getOutraSelecaoMesmoAno : getOutraSelecaoMesmoPais;
          const [selecao] = await Promise.all([
            fetcher(atual, get().selecoesUsadas),
            delay(ROLL_ANIMATION_MS),
          ]);
          set({
            estado: { ...get().estado!, selecaoAtual: selecao },
            loading: false,
          });
        } catch {
          set({ loading: false });
        }
      },

      escolherJogador: (jogador) => {
        const { estado } = get();
        if (!estado) return;

        const proximoSlot = getProximoSlotAberto(estado.slots);
        if (!proximoSlot) return;

        const novosSlots = estado.slots.map((slot) =>
          slot.index === proximoSlot.index ? { ...slot, jogador } : slot,
        );

        const completo = timeCompleto(novosSlots);

        set({
          estado: {
            ...estado,
            slots: novosSlots,
            selecaoAtual: null,
            status: completo ? "simulacao" : "draft",
          },
        });
      },

      simularProximaFase: (adversario) => {
        const { estado } = get();
        if (!estado) return null;

        const forca = calcularForcaTime(estado.slots);
        const resultado = simularPartida(
          forca,
          adversario,
          estado.faseAtual,
          estado.slots,
        );

        const novoHistorico = [...estado.historico, resultado];

        if (resultado.resultado === "derrota") {
          const pontuacao = calcularPontuacao(novoHistorico, forca, false);
          set({
            estado: {
              ...estado,
              historico: novoHistorico,
              status: "finalizado",
              resultadoFinal: "eliminado",
              pontuacaoFinal: pontuacao,
            },
          });
          return resultado;
        }

        const faseIndex = FASES_CAMPEONATO.indexOf(estado.faseAtual);
        const ehFinal = estado.faseAtual === "final";

        if (ehFinal) {
          const pontuacao = calcularPontuacao(novoHistorico, forca, true);
          set({
            estado: {
              ...estado,
              historico: novoHistorico,
              status: "finalizado",
              resultadoFinal: "campeao",
              pontuacaoFinal: pontuacao,
            },
          });
          return resultado;
        }

        const proximaFase = FASES_CAMPEONATO[faseIndex + 1] as FaseCampeonato;
        set({
          estado: {
            ...estado,
            historico: novoHistorico,
            faseAtual: proximaFase,
          },
        });
        return resultado;
      },

      getJogadoresDisponiveis: () => {
        const { estado } = get();
        if (!estado?.selecaoAtual) return [];

        const proximoSlot = getProximoSlotAberto(estado.slots);
        if (!proximoSlot) return [];

        const idsUsados = getIdsUsados(estado.slots);
        return filtrarJogadoresPorPosicao(
          estado.selecaoAtual,
          proximoSlot.posicao,
          idsUsados,
        );
      },

      getProximaPosicao: () => {
        const { estado } = get();
        if (!estado) return null;
        const proximo = getProximoSlotAberto(estado.slots);
        return proximo?.posicao ?? null;
      },

      getForcaTime: () => {
        const { estado } = get();
        if (!estado) return 0;
        return calcularForcaTime(estado.slots);
      },

      resetar: () =>
        set({ estado: null, selecoesUsadas: [], loading: false }),
    }),
    { name: "7a0-game-state" },
  ),
);
