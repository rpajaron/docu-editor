import * as Y from "yjs";
import type { RoomId } from "@collab/shared";

export interface RoomState {
  readonly doc: Y.Doc;
  readonly connections: Set<RoomConnection>;
}

export interface RoomConnection {
  readonly id: string;
  send: (data: Uint8Array) => void;
  close: () => void;
}

export class RoomManager {
  private readonly rooms = new Map<RoomId, RoomState>();

  getOrCreate(roomId: RoomId): RoomState {
    const existing = this.rooms.get(roomId);
    if (existing) {
      return existing;
    }

    const doc = new Y.Doc();
    const state: RoomState = {
      doc,
      connections: new Set(),
    };
    this.rooms.set(roomId, state);
    return state;
  }

  has(roomId: RoomId): boolean {
    return this.rooms.has(roomId);
  }

  removeConnection(roomId: RoomId, connection: RoomConnection): void {
    const room = this.rooms.get(roomId);
    if (!room) {
      return;
    }
    room.connections.delete(connection);
    if (room.connections.size === 0) {
      room.doc.destroy();
      this.rooms.delete(roomId);
    }
  }
}

export const roomManager = new RoomManager();
