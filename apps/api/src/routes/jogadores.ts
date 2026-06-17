import type { FastifyInstance } from "fastify";
import type { Selecao } from "@7a0/shared";
import {
  buscarSelecaoPorPaisAno,
  contarSelecoes,
  listarJogadores,
  listarSelecoes,
} from "../services/selecoes.js";
import { carregarSelecoesJson, listarJogadoresJson } from "../services/jsonFallback.js";

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

async function getSelecoes(): Promise<Selecao[]> {
  const count = await contarSelecoes().catch(() => 0);
  if (count > 0) return listarSelecoes();
  return carregarSelecoesJson();
}

export async function jogadoresRoutes(app: FastifyInstance) {
  app.get("/api/selecoes", async () => getSelecoes());

  app.get("/api/selecoes/random", async () => {
    const selecoes = await getSelecoes();
    return pickRandom(selecoes);
  });

  app.get<{ Params: { pais: string; ano: string } }>(
    "/api/selecoes/:pais/:ano",
    async (req, reply) => {
      const ano = Number(req.params.ano);
      let selecao = await buscarSelecaoPorPaisAno(req.params.pais, ano).catch(
        () => null,
      );
      if (!selecao) {
        selecao =
          carregarSelecoesJson().find(
            (s) => s.pais === req.params.pais && s.ano === ano,
          ) ?? null;
      }
      if (!selecao) return reply.status(404).send({ message: "Não encontrada" });
      return selecao;
    },
  );

  app.get<{
    Querystring: { posicao?: string; pais?: string; ano?: string };
  }>("/api/jogadores", async (req) => {
    const filtros = {
      posicao: req.query.posicao,
      pais: req.query.pais,
      ano: req.query.ano ? Number(req.query.ano) : undefined,
    };

    const count = await contarSelecoes().catch(() => 0);
    if (count > 0) return listarJogadores(filtros);
    return listarJogadoresJson(filtros);
  });
}
