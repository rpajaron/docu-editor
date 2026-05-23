import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { parseRoomId } from "@collab/shared";
import { DocsLayout } from "../components/docs/DocsLayout.js";
import { CollabEditor } from "../editor/CollabEditor.js";
import { useYjsRoom } from "../hooks/useYjsRoom.js";

const DEFAULT_TITLE = "Untitled document";

export function RoomPage() {
  const { roomId: roomIdParam } = useParams<{ roomId: string }>();
  const roomId = useMemo(
    () => (roomIdParam ? parseRoomId(roomIdParam) : null),
    [roomIdParam],
  );
  const { yText, status } = useYjsRoom(roomIdParam);
  const [docTitle, setDocTitle] = useState(DEFAULT_TITLE);
  const [copied, setCopied] = useState(false);

  const joinUrl =
    typeof window !== "undefined" && roomIdParam
      ? `${window.location.origin}/r/${roomIdParam}`
      : "";

  useEffect(() => {
    document.title = docTitle === DEFAULT_TITLE ? DEFAULT_TITLE : `${docTitle} - Docs`;
  }, [docTitle]);

  async function handleShare(): Promise<void> {
    if (!joinUrl) {
      return;
    }
    await navigator.clipboard.writeText(joinUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2500);
  }

  if (!roomId) {
    return (
      <div className="docs-error-page">
        <h1>Document not found</h1>
        <p>This link doesn&apos;t point to a valid document.</p>
        <Link to="/" className="docs-text-btn">
          Go to Docs home
        </Link>
      </div>
    );
  }

  return (
    <DocsLayout
      title={docTitle}
      onTitleChange={setDocTitle}
      onShare={() => {
        void handleShare();
      }}
      shareLabel={copied ? "Link copied" : "Share"}
      status={status}
    >
      <CollabEditor yText={yText} status={status} />
    </DocsLayout>
  );
}
