import { Link } from "react-router-dom";
import { Icon } from "./Icon.js";
import type { ConnectionStatus } from "../../hooks/useYjsRoom.js";

interface DocsHeaderProps {
  title: string;
  onTitleChange?: (title: string) => void;
  onShare: () => void;
  shareLabel: string;
  status: ConnectionStatus;
}

function statusLabel(status: ConnectionStatus): string {
  switch (status) {
    case "connected":
      return "Saved to cloud";
    case "connecting":
      return "Connecting…";
    case "disconnected":
      return "Offline";
  }
}

export function DocsHeader({
  title,
  onTitleChange,
  onShare,
  shareLabel,
  status,
}: DocsHeaderProps) {
  return (
    <header className="docs-header">
      <div className="docs-header__left">
        <Link to="/" className="docs-logo" title="Documents home" aria-label="Home">
          <Icon name="description" filled className="docs-logo__icon" />
        </Link>
        <div className="docs-header__title-block">
          <input
            type="text"
            className="docs-title-input"
            value={title}
            onChange={(event) => onTitleChange?.(event.target.value)}
            aria-label="Document title"
            spellCheck={false}
          />
          <div className="docs-header__meta">
            <button type="button" className="docs-icon-btn docs-icon-btn--sm" title="Move">
              <Icon name="folder" />
            </button>
            <span
              className={`docs-save-status ${status === "connected" ? "docs-save-status--ok" : ""}`}
            >
              {statusLabel(status)}
            </span>
          </div>
        </div>
      </div>
      <div className="docs-header__right">
        <button type="button" className="docs-icon-btn" title="Show comments">
          <Icon name="comment" />
        </button>
        <button
          type="button"
          className="docs-share-btn"
          onClick={onShare}
        >
          <Icon name="lock" className="docs-share-btn__icon" />
          {shareLabel}
        </button>
        <div className="docs-avatar" title="You">
          Y
        </div>
      </div>
    </header>
  );
}
