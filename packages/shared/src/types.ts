export type Posicao =
  | "GOL"
  | "LD"
  | "ZAG"
  | "LE"
  | "VOL"
  | "MC"
  | "MD"
  | "ME"
  | "AE"
  | "AD"
  | "CA";

export type Formacao = "4-3-3" | "4-4-2" | "3-5-2" | "4-2-3-1" | "5-3-2";

export type EstiloJogo = "defensivo" | "equilibrado" | "ofensivo";
export type ModoJogo = "classico" | "memoria";

export interface GolPartida {
  minuto: number;
  jogador: string;
}

export interface Jogador {
  id: string;
  nome: string;
  posicao: Posicao;
  posicaoAlternativa?: Posicao;
  forca: number;
  velocidade: number;
  tecnica: number;
  selecao: string;
  pais: string;
  anoCopa: number;
  foto?: string;
}

export interface Selecao {
  id: string;
  pais: string;
  ano: number;
  jogadores: Jogador[];
  forca_media: number;
}

export interface SlotTime {
  posicao: Posicao;
  jogador: Jogador | null;
  index: number;
}

export interface ConfigFormacao {
  nome: Formacao;
  slots: Posicao[];
}

export type FaseCampeonato =
  | "grupos"
  | "oitavas"
  | "quartas"
  | "semifinal"
  | "final";

export const FASES_CAMPEONATO: FaseCampeonato[] = [
  "grupos",
  "oitavas",
  "quartas",
  "semifinal",
  "final",
];

export interface ResultadoPartida {
  fase: FaseCampeonato;
  meuTime: number;
  adversario: Selecao;
  forcaAdversario: number;
  resultado: "vitoria" | "derrota";
  placar: string;
  gols?: GolPartida[];
}

export interface EstadoJogo {
  formacao: Formacao;
  estilo: EstiloJogo;
  modo: ModoJogo;
  slots: SlotTime[];
  rerollsRestantes: number;
  selecaoAtual: Selecao | null;
  faseAtual: FaseCampeonato;
  historico: ResultadoPartida[];
  pontuacaoFinal?: number;
  status: "draft" | "simulacao" | "finalizado";
  resultadoFinal?: "campeao" | "eliminado";
  roomCode?: string;
  playerId?: string;
}

export interface PartidaSalva {
  formacao: Formacao;
  forcaTime: number;
  faseAlcancada: FaseCampeonato;
  venceu: boolean;
  placar: ResultadoPartida[];
  pontuacao: number;
}

export type TipoReroll = "team" | "cup";

export interface RoomPlayer {
  id: string;
  name: string;
  pontuacao?: number;
  venceu?: boolean;
  status: "waiting" | "playing" | "finished";
}

export interface Room {
  code: string;
  hostId: string;
  players: RoomPlayer[];
  createdAt: string;
}

export interface RankingEntry {
  id: string;
  apelido?: string;
  formacao: string;
  forcaTime: number;
  faseAlcancada: string;
  venceu: boolean;
  pontuacao: number;
  createdAt: string;
}
