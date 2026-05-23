import * as Y from "yjs";
import * as syncProtocol from "y-protocols/sync";
import * as encoding from "lib0/encoding";
import * as decoding from "lib0/decoding";
import type { RoomConnection, RoomState } from "../rooms/roomManager.js";

const MESSAGE_SYNC = 0;

function readSyncMessage(
  decoder: decoding.Decoder,
  encoder: encoding.Encoder,
  doc: Y.Doc,
  connection: RoomConnection,
): void {
  const messageType = syncProtocol.readSyncMessage(
    decoder,
    encoder,
    doc,
    connection,
  );
  if (messageType === syncProtocol.messageYjsSyncStep1) {
    syncProtocol.writeSyncStep1(encoder, doc);
  }
}

export function handleSyncMessage(
  room: RoomState,
  connection: RoomConnection,
  data: Uint8Array,
): Uint8Array | null {
  const decoder = decoding.createDecoder(data);
  const messageType = decoding.readVarUint(decoder);

  if (messageType !== MESSAGE_SYNC) {
    return null;
  }

  const encoder = encoding.createEncoder();
  encoding.writeVarUint(encoder, MESSAGE_SYNC);
  readSyncMessage(decoder, encoder, room.doc, connection);

  if (encoding.length(encoder) > 1) {
    return encoding.toUint8Array(encoder);
  }
  return null;
}

export function broadcastUpdate(
  room: RoomState,
  update: Uint8Array,
  origin: RoomConnection,
): void {
  const encoder = encoding.createEncoder();
  encoding.writeVarUint(encoder, MESSAGE_SYNC);
  syncProtocol.writeUpdate(encoder, update);
  const message = encoding.toUint8Array(encoder);

  for (const peer of room.connections) {
    if (peer.id !== origin.id) {
      peer.send(message);
    }
  }
}

export function sendSyncStep1(
  room: RoomState,
  connection: RoomConnection,
): void {
  const encoder = encoding.createEncoder();
  encoding.writeVarUint(encoder, MESSAGE_SYNC);
  syncProtocol.writeSyncStep1(encoder, room.doc);
  connection.send(encoding.toUint8Array(encoder));
}
