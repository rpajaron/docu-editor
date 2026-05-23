export const MAX_ROOM_ID_LENGTH = 64;

declare const roomIdBrand: unique symbol;

export type RoomId = string & { readonly [roomIdBrand]: never };

const ROOM_ID_PATTERN = /^[a-zA-Z0-9_-]+$/;

export function createRoomId(): RoomId {
  const id = crypto.randomUUID().replace(/-/g, "").slice(0, 12);
  return id as RoomId;
}

export function parseRoomId(value: string): RoomId | null {
  if (value.length === 0 || value.length > MAX_ROOM_ID_LENGTH) {
    return null;
  }
  if (!ROOM_ID_PATTERN.test(value)) {
    return null;
  }
  return value as RoomId;
}

export interface RoomMeta {
  roomId: RoomId;
  createdAt: string;
}
