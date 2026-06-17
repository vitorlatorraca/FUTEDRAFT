import type { FastifyInstance } from "fastify";
import { prisma } from "../plugins/prisma.js";

export async function rankingRoutes(app: FastifyInstance) {
  app.get("/api/ranking", async () => {
    const partidas = await prisma.partida.findMany({
      orderBy: { pontuacao: "desc" },
      take: 100,
      select: {
        id: true,
        apelido: true,
        formacao: true,
        forcaTime: true,
        faseAlcancada: true,
        venceu: true,
        pontuacao: true,
        createdAt: true,
      },
    });

    return partidas.map((p: (typeof partidas)[number]) => ({
      id: p.id,
      apelido: p.apelido,
      formacao: p.formacao,
      forcaTime: p.forcaTime,
      faseAlcancada: p.faseAlcancada,
      venceu: p.venceu,
      pontuacao: p.pontuacao,
      createdAt: p.createdAt.toISOString(),
    }));
  });

  app.get<{ Params: { id: string } }>(
    "/api/ranking/usuario/:id",
    async (req) => {
      const partidas = await prisma.partida.findMany({
        where: { userId: req.params.id },
        orderBy: { createdAt: "desc" },
        take: 50,
        select: {
          id: true,
          apelido: true,
          formacao: true,
          forcaTime: true,
          faseAlcancada: true,
          venceu: true,
          pontuacao: true,
          createdAt: true,
        },
      });

      return partidas.map((p: (typeof partidas)[number]) => ({
        id: p.id,
        apelido: p.apelido,
        formacao: p.formacao,
        forcaTime: p.forcaTime,
        faseAlcancada: p.faseAlcancada,
        venceu: p.venceu,
        pontuacao: p.pontuacao,
        createdAt: p.createdAt.toISOString(),
      }));
    },
  );
}
