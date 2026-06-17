import type {
  FaseCampeonato,
  Jogador,
  ResultadoPartida,
  Selecao,
  SlotTime,
} from "@7a0/shared";

const BONUS_FASE: Record<FaseCampeonato, number> = {
  grupos: 0,
  oitavas: 2,
  quartas: 4,
  semifinal: 6,
  final: 8,
};

export function calcularForcaTime(slots: SlotTime[]): number {
  const jogadores = slots
    .filter((s) => s.jogador !== null)
    .map((s) => s.jogador!);

  if (jogadores.length === 0) return 0;

  const media =
    jogadores.reduce((soma, j) => soma + j.forca, 0) / jogadores.length;

  const mesmaSelecao = jogadores.every(
    (j) => j.pais === jogadores[0].pais && j.anoCopa === jogadores[0].anoCopa,
  );
  const bonus = mesmaSelecao ? 5 : 0;

  return Math.round((media + bonus) * 10) / 10;
}

export function jogadorCompativel(
  jogador: Jogador,
  posicao: string,
): boolean {
  return (
    jogador.posicao === posicao ||
    jogador.posicaoAlternativa === posicao
  );
}

function gerarPlacar(minha: number, dele: number, venceu: boolean): string {
  const diff = Math.abs(minha - dele);
  const golsMeu = venceu
    ? Math.floor(1 + diff / 15 + Math.random() * 2)
    : Math.floor(Math.random() * 2);
  const golsDele = venceu
    ? Math.floor(Math.random() * golsMeu)
    : golsMeu + Math.floor(1 + Math.random() * 2);
  return `${golsMeu}-${golsDele}`;
}

export const FASE_LABEL: Record<FaseCampeonato, string> = {
  grupos: "GROUPS",
  oitavas: "ROUND OF 16",
  quartas: "QUARTER-FINALS",
  semifinal: "SEMI-FINAL",
  final: "FINAL",
};

function gerarGols(
  placar: string,
  venceu: boolean,
  jogadores: Jogador[],
): import("@7a0/shared").GolPartida[] {
  const [golsMeuStr, golsDeleStr] = placar.split("-");
  const golsMeu = parseInt(golsMeuStr, 10);
  if (!venceu || golsMeu === 0 || jogadores.length === 0) return [];

  const atacantes = jogadores.filter((j) =>
    ["CA", "AE", "AD", "ME", "MC"].includes(j.posicao),
  );
  const pool = atacantes.length > 0 ? atacantes : jogadores;
  const gols: import("@7a0/shared").GolPartida[] = [];

  for (let i = 0; i < golsMeu; i++) {
    const autor = pool[Math.floor(Math.random() * pool.length)];
    gols.push({
      minuto: Math.floor(5 + Math.random() * 85),
      jogador: autor.nome.split(" ").pop() ?? autor.nome,
    });
  }

  gols.sort((a, b) => a.minuto - b.minuto);
  return gols;
}

export function simularPartida(
  forcaMeuTime: number,
  adversario: Selecao,
  fase: FaseCampeonato,
  slots?: SlotTime[],
): ResultadoPartida {
  const rng = () => (Math.random() - 0.5) * 20;

  const minha = forcaMeuTime + rng();
  const dele =
    adversario.forca_media + BONUS_FASE[fase] + rng();

  const venceu = minha > dele;
  const placar = gerarPlacar(minha, dele, venceu);

  const jogadores =
    slots?.filter((s) => s.jogador).map((s) => s.jogador!) ?? [];

  return {
    fase,
    meuTime: forcaMeuTime,
    adversario,
    forcaAdversario: adversario.forca_media,
    resultado: venceu ? "vitoria" : "derrota",
    placar,
    gols: gerarGols(placar, venceu, jogadores),
  };
}

export function calcularPontuacao(
  historico: ResultadoPartida[],
  forcaTime: number,
  campeao: boolean,
): number {
  const fasePontos: Record<FaseCampeonato, number> = {
    grupos: 10,
    oitavas: 25,
    quartas: 50,
    semifinal: 75,
    final: 100,
  };

  let pontos = Math.round(forcaTime);
  for (const partida of historico) {
    if (partida.resultado === "vitoria") {
      pontos += fasePontos[partida.fase];
    }
  }
  if (campeao) pontos += 200;
  return pontos;
}