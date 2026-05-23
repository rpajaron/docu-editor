import type { FastifyInstance } from "fastify";
import { parseRoomId } from "@collab/shared";
import {
  roomManager,
  type RoomConnection,
} from "../rooms/roomManager.js";
import {
  broadcastUpdate,
  handleSyncMessage,
  sendSyncStep1,
} from "./sync.js";

function createConnectionId(): string {
  return crypto.randomUUID();
}

export async function registerRoomWebSocket(
  app: FastifyInstance,
): Promise<void> {
  app.get("/ws/:roomId", { websocket: true }, (socket, request) => {
    const roomIdParam = (request.params as { roomId: string }).roomId;
    const roomId = parseRoomId(roomIdParam);

    if (!roomId) {
      socket.close(1008, "Invalid room id");
      return;
    }

    const room = roomManager.getOrCreate(roomId);
    const connectionId = createConnectionId();

    const connection: RoomConnection = {
      id: connectionId,
      send: (data: Uint8Array) => {
        if (socket.readyState === socket.OPEN) {
          socket.send(data);
        }
      },
      close: () => {
        socket.close();
      },
    };

    room.connections.add(connection);

    const onDocUpdate = (update: Uint8Array, origin: unknown) => {
      broadcastUpdate(room, update, origin as RoomConnection);
    };

    room.doc.on("update", onDocUpdate);
    sendSyncStep1(room, connection);

    socket.on("message", (raw: Buffer | ArrayBuffer | Buffer[]) => {
      const data = Buffer.isBuffer(raw)
        ? new Uint8Array(raw)
        : raw instanceof ArrayBuffer
          ? new Uint8Array(raw)
          : Buffer.concat(raw);

      try {
        const reply = handleSyncMessage(room, connection, data);
        if (reply) {
          connection.send(reply);
        }
      } catch (error: unknown) {
        request.log.error({ err: error, roomId }, "WebSocket sync error");
        connection.close();
      }
    });

    socket.on("close", () => {
      room.doc.off("update", onDocUpdate);
      roomManager.removeConnection(roomId, connection);
    });
  });
}
