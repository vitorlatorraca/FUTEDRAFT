import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import type { Jogador, Selecao } from "@7a0/shared";

const __dirname = dirname(fileURLToPath(import.meta.url));

interface JogadoresData {
  selecoes: Array<{
    id: string;
    pais: string;
    ano: number;
    jogadores: Jogador[];
  }>;
}

let cache: Selecao[] | null = null;

function calcularForcaMedia(jogadores: Jogador[]): number {
  if (jogadores.length === 0) return 0;
  return (
    Math.round(
      (jogadores.reduce((acc, j) => acc + j.forca, 0) / jogadores.length) * 10,
    ) / 10
  );
}

function normalizar(raw: JogadoresData["selecoes"][0]): Selecao {
  return {
    id: raw.id,
    pais: raw.pais,
    ano: raw.ano,
    jogadores: raw.jogadores,
    forca_media: calcularForcaMedia(raw.jogadores),
  };
}

export function carregarSelecoesJson(): Selecao[] {
  if (cache) return cache;
  const jsonPath = join(__dirname, "../../../web/public/data/jogadores.json");
  const data: JogadoresData = JSON.parse(readFileSync(jsonPath, "utf-8"));
  cache = data.selecoes.map(normalizar);
  return cache;
}

export function listarJogadoresJson(filtros?: {
  posicao?: string;
  pais?: string;
  ano?: number;
}): Jogador[] {
  let jogadores = carregarSelecoesJson().flatMap((s) => s.jogadores);
  if (filtros?.pais) jogadores = jogadores.filter((j) => j.pais === filtros.pais);
  if (filtros?.ano) jogadores = jogadores.filter((j) => j.anoCopa === filtros.ano);
  if (filtros?.posicao) {
    jogadores = jogadores.filter(
      (j) =>
        j.posicao === filtros.posicao ||
        j.posicaoAlternativa === filtros.posicao,
    );
  }
  return jogadores;
}
