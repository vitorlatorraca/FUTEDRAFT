import Fastify from "fastify";
import cors from "@fastify/cors";
import { jogadoresRoutes } from "./routes/jogadores.js";
import { partidasRoutes } from "./routes/partidas.js";
import { rankingRoutes } from "./routes/ranking.js";
import { roomsRoutes } from "./routes/rooms.js";
import { prisma } from "./plugins/prisma.js";

const PORT = Number(process.env.PORT) || 3001;

async function main() {
  const app = Fastify({ logger: true });

  await app.register(cors, {
    origin: true,
  });

  await app.register(jogadoresRoutes);
  await app.register(partidasRoutes);
  await app.register(rankingRoutes);
  await app.register(roomsRoutes);

  app.get("/api/health", async () => {
    let db = "disconnected";
    try {
      await prisma.$queryRaw`SELECT 1`;
      const selecoes = await prisma.selecao.count();
      db = `connected (${selecoes} seleções)`;
    } catch {
      db = "disconnected";
    }
    return { status: "ok", database: db };
  });

  try {
    await app.listen({ port: PORT, host: "0.0.0.0" });
    console.log(`API rodando em http://localhost:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();
