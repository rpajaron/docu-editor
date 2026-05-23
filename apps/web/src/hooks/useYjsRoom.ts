import { useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { parseRoomId } from "@collab/shared";

export type ConnectionStatus = "connecting" | "connected" | "disconnected";

interface UseYjsRoomResult {
  yText: Y.Text | null;
  status: ConnectionStatus;
}

function buildWsServerUrl(): string {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}/ws`;
}

export function useYjsRoom(roomIdParam: string | undefined): UseYjsRoomResult {
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const [yText, setYText] = useState<Y.Text | null>(null);
  const docRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);

  useEffect(() => {
    const roomId = roomIdParam ? parseRoomId(roomIdParam) : null;
    if (!roomId) {
      setStatus("disconnected");
      setYText(null);
      return;
    }

    const doc = new Y.Doc();
    const text = doc.getText("content");
    docRef.current = doc;
    setYText(text);
    setStatus("connecting");

    const provider = new WebsocketProvider(buildWsServerUrl(), roomId, doc, {
      connect: true,
      disableBc: true,
    });
    providerRef.current = provider;

    const handleStatus = (event: { status: string }): void => {
      if (event.status === "connected") {
        setStatus("connected");
      } else if (event.status === "disconnected") {
        setStatus("disconnected");
      } else {
        setStatus("connecting");
      }
    };

    provider.on("status", handleStatus);

    return () => {
      provider.off("status", handleStatus);
      provider.destroy();
      doc.destroy();
      docRef.current = null;
      providerRef.current = null;
      setYText(null);
    };
  }, [roomIdParam]);

  return { yText, status };
}
