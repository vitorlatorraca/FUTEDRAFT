import type { Jogador, Selecao } from "@7a0/shared";
import { prisma } from "../plugins/prisma.js";

type JogadorDb = {
  id: string;
  nome: string;
  posicao: string;
  posicaoAlternativa: string | null;
  forca: number;
  velocidade: number;
  tecnica: number;
  pais: string;
  anoCopa: number;
  foto: string | null;
};

function mapJogador(j: JogadorDb): Jogador {
  return {
    id: j.id,
    nome: j.nome,
    posicao: j.posicao as Jogador["posicao"],
    posicaoAlternativa: j.posicaoAlternativa as Jogador["posicaoAlternativa"],
    forca: j.forca,
    velocidade: j.velocidade,
    tecnica: j.tecnica,
    selecao: j.pais,
    pais: j.pais,
    anoCopa: j.anoCopa,
    foto: j.foto ?? undefined,
  };
}

function calcularForcaMedia(jogadores: JogadorDb[]): number {
  if (jogadores.length === 0) return 0;
  const soma = jogadores.reduce((acc, j) => acc + j.forca, 0);
  return Math.round((soma / jogadores.length) * 10) / 10;
}

export function mapSelecao(
  raw: {
    id: string;
    pais: string;
    ano: number;
    forcaMedia: number;
    jogadores: JogadorDb[];
  },
): Selecao {
  const jogadores = raw.jogadores.map(mapJogador);
  return {
    id: raw.id,
    pais: raw.pais,
    ano: raw.ano,
    jogadores,
    forca_media: raw.forcaMedia || calcularForcaMedia(raw.jogadores),
  };
}

const selecaoInclude = { jogadores: true } as const;

export async function listarSelecoes(): Promise<Selecao[]> {
  const rows = await prisma.selecao.findMany({
    include: selecaoInclude,
    orderBy: [{ ano: "desc" }, { pais: "asc" }],
  });
  return rows.map(mapSelecao);
}

export async function buscarSelecaoPorId(id: string): Promise<Selecao | null> {
  const row = await prisma.selecao.findUnique({
    where: { id },
    include: selecaoInclude,
  });
  return row ? mapSelecao(row) : null;
}

export async function buscarSelecaoPorPaisAno(
  pais: string,
  ano: number,
): Promise<Selecao | null> {
  const row = await prisma.selecao.findUnique({
    where: { pais_ano: { pais, ano } },
    include: selecaoInclude,
  });
  return row ? mapSelecao(row) : null;
}

export async function listarJogadores(filtros?: {
  posicao?: string;
  pais?: string;
  ano?: number;
}): Promise<Jogador[]> {
  const where: Record<string, unknown> = {};
  if (filtros?.pais) where.pais = filtros.pais;
  if (filtros?.ano) where.anoCopa = filtros.ano;
  if (filtros?.posicao) {
    where.OR = [
      { posicao: filtros.posicao },
      { posicaoAlternativa: filtros.posicao },
    ];
  }

  const rows = await prisma.jogador.findMany({ where, orderBy: { forca: "desc" } });
  return rows.map(mapJogador);
}

export async function contarSelecoes(): Promise<number> {
  return prisma.selecao.count();
}
