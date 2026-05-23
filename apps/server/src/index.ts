import Fastify from "fastify";
import websocket from "@fastify/websocket";
import { registerRoomRoutes } from "./routes/rooms.js";
import { registerRoomWebSocket } from "./ws/roomHandler.js";

const PORT = Number(process.env.PORT ?? 3001);
const HOST = process.env.HOST ?? "0.0.0.0";

async function main(): Promise<void> {
  const app = Fastify({ logger: true });

  await app.register(websocket);
  await registerRoomRoutes(app);
  await registerRoomWebSocket(app);

  app.get("/health", async () => ({ ok: true }));

  await app.listen({ port: PORT, host: HOST });
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
