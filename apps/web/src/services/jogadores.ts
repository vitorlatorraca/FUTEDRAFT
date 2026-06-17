import type { Jogador, Posicao, Selecao } from "@7a0/shared";
import { jogadorCompativel } from "@/utils/simulacao";

interface JogadoresData {
  selecoes: Array<{
    id: string;
    pais: string;
    ano: number;
    jogadores: Jogador[];
  }>;
}

let cache: Selecao[] | null = null;
let dataSource: "api" | "json" | null = null;

function calcularForcaMedia(jogadores: Jogador[]): number {
  if (jogadores.length === 0) return 0;
  const soma = jogadores.reduce((acc, j) => acc + j.forca, 0);
  return Math.round((soma / jogadores.length) * 10) / 10;
}

function normalizarSelecao(raw: JogadoresData["selecoes"][0]): Selecao {
  return {
    id: raw.id,
    pais: raw.pais,
    ano: raw.ano,
    jogadores: raw.jogadores,
    forca_media: calcularForcaMedia(raw.jogadores),
  };
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function apiBase(): string {
  return import.meta.env.VITE_API_URL ?? "";
}

async function carregarDaApi(): Promise<Selecao[] | null> {
  try {
    const url = `${apiBase()}/api/selecoes`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data: Selecao[] = await res.json();
    return data.length > 0 ? data : null;
  } catch {
    return null;
  }
}

async function carregarDoJson(): Promise<Selecao[]> {
  const res = await fetch("/data/jogadores.json");
  if (!res.ok) throw new Error("Falha ao carregar jogadores");
  const data: JogadoresData = await res.json();
  return data.selecoes.map(normalizarSelecao);
}

export async function carregarSelecoes(): Promise<Selecao[]> {
  if (cache) return cache;

  const fromApi = await carregarDaApi();
  if (fromApi) {
    cache = fromApi;
    dataSource = "api";
    return cache;
  }

  cache = await carregarDoJson();
  dataSource = "json";
  return cache;
}

export function getDataSource(): "api" | "json" | null {
  return dataSource;
}

export function resetCacheSelecoes() {
  cache = null;
  dataSource = null;
}

function getExcluirIds(excluir?: Selecao[], extra?: Selecao): Set<string> {
  const ids = new Set(excluir?.map((s) => s.id) ?? []);
  if (extra) ids.add(extra.id);
  return ids;
}

export async function getSelecaoAleatoria(
  excluir?: Selecao[],
): Promise<Selecao> {
  const selecoes = await carregarSelecoes();
  const idsExcluidos = getExcluirIds(excluir);
  const disponiveis = selecoes.filter((s) => !idsExcluidos.has(s.id));
  const pool = disponiveis.length > 0 ? disponiveis : selecoes;
  return pickRandom(pool);
}

export async function getOutraSelecaoMesmoAno(
  atual: Selecao,
  excluir?: Selecao[],
): Promise<Selecao> {
  const selecoes = await carregarSelecoes();
  const idsExcluidos = getExcluirIds(excluir, atual);

  const mesmoAnoOutroPais = selecoes.filter(
    (s) =>
      s.ano === atual.ano &&
      s.pais !== atual.pais &&
      !idsExcluidos.has(s.id),
  );
  if (mesmoAnoOutroPais.length > 0) return pickRandom(mesmoAnoOutroPais);

  const mesmoAno = selecoes.filter(
    (s) => s.ano === atual.ano && !idsExcluidos.has(s.id),
  );
  if (mesmoAno.length > 0) return pickRandom(mesmoAno);

  return getSelecaoAleatoria([...(excluir ?? []), atual]);
}

export async function getOutraSelecaoMesmoPais(
  atual: Selecao,
  excluir?: Selecao[],
): Promise<Selecao> {
  const selecoes = await carregarSelecoes();
  const idsExcluidos = getExcluirIds(excluir, atual);

  const mesmoPaisOutroAno = selecoes.filter(
    (s) =>
      s.pais === atual.pais &&
      s.ano !== atual.ano &&
      !idsExcluidos.has(s.id),
  );
  if (mesmoPaisOutroAno.length > 0) return pickRandom(mesmoPaisOutroAno);

  const outroPais = selecoes.filter(
    (s) => s.pais !== atual.pais && !idsExcluidos.has(s.id),
  );
  if (outroPais.length > 0) return pickRandom(outroPais);

  return getSelecaoAleatoria([...(excluir ?? []), atual]);
}

export async function getSelecaoPorPaisAno(
  pais: string,
  ano: number,
): Promise<Selecao | null> {
  const selecoes = await carregarSelecoes();
  return selecoes.find((s) => s.pais === pais && s.ano === ano) ?? null;
}

export function filtrarJogadoresPorPosicao(
  selecao: Selecao,
  posicao: Posicao,
  idsUsados: Set<string>,
): Jogador[] {
  return selecao.jogadores.filter(
    (j) => !idsUsados.has(j.id) && jogadorCompativel(j, posicao),
  );
}

export async function getTodosJogadores(): Promise<Jogador[]> {
  const selecoes = await carregarSelecoes();
  return selecoes.flatMap((s) => s.jogadores);
}
