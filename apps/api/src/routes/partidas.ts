import type { FastifyInstance } from "fastify";
import type { FaseCampeonato, ResultadoPartida } from "@7a0/shared";
import { prisma } from "../plugins/prisma.js";

interface SalvarPartidaBody {
  formacao: string;
  forcaTime: number;
  faseAlcancada: FaseCampeonato;
  venceu: boolean;
  placar: ResultadoPartida[];
  pontuacao: number;
  apelido?: string;
  userId?: string;
}

export async function partidasRoutes(app: FastifyInstance) {
  app.post<{ Body: SalvarPartidaBody }>("/api/partidas", async (req) => {
    const { formacao, forcaTime, faseAlcancada, venceu, placar, pontuacao, apelido, userId } =
      req.body;

    const partida = await prisma.partida.create({
      data: {
        formacao,
        forcaTime,
        faseAlcancada,
        venceu,
        pontuacao,
        placar: placar as unknown as object,
        apelido,
        userId,
      },
    });

    return { id: partida.id };
  });

  app.get("/api/partidas", async () => {
    return prisma.partida.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  });
}
