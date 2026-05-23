import { describe, expect, it } from "vitest";
import * as Y from "yjs";
import * as syncProtocol from "y-protocols/sync";
import * as encoding from "lib0/encoding";
import * as decoding from "lib0/decoding";
import type { RoomConnection, RoomState } from "../rooms/roomManager.js";
import { handleSyncMessage } from "./sync.js";

const MESSAGE_SYNC = 0;

function encodeSyncMessage(
  writeInner: (encoder: encoding.Encoder) => void,
): Uint8Array {
  const encoder = encoding.createEncoder();
  encoding.writeVarUint(encoder, MESSAGE_SYNC);
  writeInner(encoder);
  return encoding.toUint8Array(encoder);
}

function createRoom(): { room: RoomState; connection: RoomConnection } {
  const connection: RoomConnection = {
    id: "test-client",
    send: () => {},
    close: () => {},
  };
  return {
    room: {
      doc: new Y.Doc(),
      connections: new Set([connection]),
    },
    connection,
  };
}

/** Simulates y-websocket client–server sync after connect. */
function syncClientToServer(
  clientDoc: Y.Doc,
  room: RoomState,
  connection: RoomConnection,
): void {
  const step1 = encodeSyncMessage((enc) => {
    syncProtocol.writeSyncStep1(enc, clientDoc);
  });
  const reply = handleSyncMessage(room, connection, step1);
  expect(reply).not.toBeNull();

  const decoder = decoding.createDecoder(reply!);
  expect(decoding.readVarUint(decoder)).toBe(MESSAGE_SYNC);

  const innerEncoder = encoding.createEncoder();
  syncProtocol.readSyncMessage(decoder, innerEncoder, clientDoc, null);

  expect(decoding.readVarUint(decoder)).toBe(syncProtocol.messageYjsSyncStep1);
  const serverStateVector = decoding.readVarUint8Array(decoder);

  const step2 = encodeSyncMessage((enc) => {
    syncProtocol.writeSyncStep2(enc, clientDoc, serverStateVector);
  });
  handleSyncMessage(room, connection, step2);
}

describe("handleSyncMessage", () => {
  it("merges owner document into server doc after SyncStep1 handshake", () => {
    const ownerDoc = new Y.Doc();
    ownerDoc.getText("content").insert(0, "Hello from owner");

    const { room, connection } = createRoom();
    syncClientToServer(ownerDoc, room, connection);

    expect(room.doc.getText("content").toString()).toBe("Hello from owner");
  });

  it("allows a guest to receive owner text from the server doc", () => {
    const ownerDoc = new Y.Doc();
    ownerDoc.getText("content").insert(0, "Shared content");

    const { room, connection: ownerConnection } = createRoom();
    syncClientToServer(ownerDoc, room, ownerConnection);

    const guestDoc = new Y.Doc();
    const guestConnection: RoomConnection = {
      id: "guest",
      send: () => {},
      close: () => {},
    };
    room.connections.add(guestConnection);

    const guestStep1 = encodeSyncMessage((enc) => {
      syncProtocol.writeSyncStep1(enc, guestDoc);
    });
    const serverReply = handleSyncMessage(room, guestConnection, guestStep1);
    expect(serverReply).not.toBeNull();

    const decoder = decoding.createDecoder(serverReply!);
    expect(decoding.readVarUint(decoder)).toBe(MESSAGE_SYNC);

    const innerEncoder = encoding.createEncoder();
    syncProtocol.readSyncMessage(decoder, innerEncoder, guestDoc, null);

    expect(guestDoc.getText("content").toString()).toBe("Shared content");
  });
});
