import { useEffect, useRef } from "react";
import type * as Y from "yjs";
import type { ConnectionStatus } from "../hooks/useYjsRoom.js";

interface CollabEditorProps {
  yText: Y.Text | null;
  status: ConnectionStatus;
}

export function CollabEditor({ yText, status }: CollabEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isLocalChangeRef = useRef(false);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea || !yText) {
      return;
    }

    textarea.value = yText.toString();

    const handleYTextChange = (): void => {
      if (isLocalChangeRef.current) {
        return;
      }
      const cursor = textarea.selectionStart;
      textarea.value = yText.toString();
      textarea.selectionStart = cursor;
      textarea.selectionEnd = cursor;
    };

    yText.observe(handleYTextChange);

    const handleInput = (): void => {
      const current = yText.toString();
      const next = textarea.value;
      if (current === next) {
        return;
      }

      isLocalChangeRef.current = true;
      yText.delete(0, current.length);
      yText.insert(0, next);
      isLocalChangeRef.current = false;
    };

    textarea.addEventListener("input", handleInput);

    return () => {
      yText.unobserve(handleYTextChange);
      textarea.removeEventListener("input", handleInput);
    };
  }, [yText]);

  if (!yText) {
    return (
      <div className="docs-editor docs-editor--loading" role="status">
        {status === "connecting" ? "Loading document…" : "Connecting…"}
      </div>
    );
  }

  return (
    <div className="docs-editor">
      <textarea
        ref={textareaRef}
        className="docs-editor__textarea"
        placeholder="Start typing…"
        spellCheck={true}
        aria-label="Document content"
      />
    </div>
  );
}
