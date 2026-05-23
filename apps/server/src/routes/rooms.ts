import type { FastifyInstance } from "fastify";
import {
  createRoomId,
  parseRoomId,
  type RoomMeta,
} from "@collab/shared";
import { roomManager } from "../rooms/roomManager.js";

export async function registerRoomRoutes(
  app: FastifyInstance,
): Promise<void> {
  app.post("/api/rooms", async (_request, reply) => {
    const roomId = createRoomId();
    roomManager.getOrCreate(roomId);

    const meta: RoomMeta = {
      roomId,
      createdAt: new Date().toISOString(),
    };

    return reply.status(201).send({
      roomId: meta.roomId,
      joinUrl: `/r/${meta.roomId}`,
      createdAt: meta.createdAt,
    });
  });

  app.get("/api/rooms/:roomId", async (request, reply) => {
    const { roomId: raw } = request.params as { roomId: string };
    const roomId = parseRoomId(raw);

    if (!roomId) {
      return reply.status(400).send({ error: "Invalid room id" });
    }

    const exists = roomManager.has(roomId);

    if (!exists) {
      return reply.status(404).send({ exists: false });
    }

    return reply.send({
      exists: true,
      meta: {
        roomId,
        createdAt: new Date().toISOString(),
      },
    });
  });
}
