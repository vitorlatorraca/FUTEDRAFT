import type { FastifyInstance } from "fastify";
import type { RoomPlayer } from "@7a0/shared";
import { prisma } from "../plugins/prisma.js";

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

async function uniqueCode(): Promise<string> {
  for (let i = 0; i < 10; i++) {
    const code = generateCode();
    const exists = await prisma.room.findUnique({ where: { code } });
    if (!exists) return code;
  }
  return generateCode() + Date.now().toString(36).slice(-2).toUpperCase();
}

function mapRoom(room: {
  code: string;
  hostId: string;
  createdAt: Date;
  players: Array<{
    id: string;
    name: string;
    pontuacao: number | null;
    venceu: boolean | null;
    status: string;
  }>;
}) {
  return {
    code: room.code,
    hostId: room.hostId,
    createdAt: room.createdAt.toISOString(),
    players: room.players.map((p) => ({
      id: p.id,
      name: p.name,
      pontuacao: p.pontuacao ?? undefined,
      venceu: p.venceu ?? undefined,
      status: p.status as RoomPlayer["status"],
    })),
  };
}

export async function roomsRoutes(app: FastifyInstance) {
  app.post<{ Body: { hostName: string } }>("/api/rooms", async (req) => {
    const code = await uniqueCode();
    const hostName = req.body.hostName || "Host";

    const room = await prisma.$transaction(async (tx) => {
      const created = await tx.room.create({
        data: { code, hostId: "pending" },
      });
      const host = await tx.roomPlayer.create({
        data: {
          roomId: created.id,
          name: hostName,
          status: "waiting",
        },
      });
      return tx.room.update({
        where: { id: created.id },
        data: { hostId: host.id },
        include: { players: true },
      });
    });

    return mapRoom(room);
  });

  app.get<{ Params: { code: string } }>(
    "/api/rooms/:code",
    async (req, reply) => {
      const room = await prisma.room.findUnique({
        where: { code: req.params.code.toUpperCase() },
        include: { players: true },
      });
      if (!room) return reply.status(404).send({ message: "Room not found" });
      return mapRoom(room);
    },
  );

  app.post<{ Params: { code: string }; Body: { playerName: string } }>(
    "/api/rooms/:code/join",
    async (req, reply) => {
      const code = req.params.code.toUpperCase();
      const room = await prisma.room.findUnique({
        where: { code },
        include: { players: true },
      });
      if (!room) return reply.status(404).send({ message: "Room not found" });
      if (room.players.length >= 8) {
        return reply.status(400).send({ message: "Room is full" });
      }

      await prisma.roomPlayer.create({
        data: {
          roomId: room.id,
          name: req.body.playerName || "Guest",
          status: "waiting",
        },
      });

      const updated = await prisma.room.findUnique({
        where: { code },
        include: { players: true },
      });
      return mapRoom(updated!);
    },
  );

  app.post<{
    Params: { code: string };
    Body: { playerId: string; pontuacao: number; venceu: boolean };
  }>("/api/rooms/:code/score", async (req, reply) => {
    const code = req.params.code.toUpperCase();
    const room = await prisma.room.findUnique({ where: { code } });
    if (!room) return reply.status(404).send({ message: "Room not found" });

    const player = await prisma.roomPlayer.findFirst({
      where: { id: req.body.playerId, roomId: room.id },
    });
    if (!player) return reply.status(404).send({ message: "Player not found" });

    const updated = await prisma.roomPlayer.update({
      where: { id: player.id },
      data: {
        pontuacao: req.body.pontuacao,
        venceu: req.body.venceu,
        status: "finished",
      },
    });

    return {
      id: updated.id,
      name: updated.name,
      pontuacao: updated.pontuacao ?? undefined,
      venceu: updated.venceu ?? undefined,
      status: updated.status as RoomPlayer["status"],
    };
  });
}
