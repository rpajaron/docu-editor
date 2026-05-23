import type { ReactNode } from "react";
import { DocsHeader } from "./DocsHeader.js";
import { DocsMenuBar } from "./DocsMenuBar.js";
import { DocsToolbar } from "./DocsToolbar.js";
import type { ConnectionStatus } from "../../hooks/useYjsRoom.js";

interface DocsLayoutProps {
  title: string;
  onTitleChange?: (title: string) => void;
  onShare: () => void;
  shareLabel: string;
  status: ConnectionStatus;
  children: ReactNode;
}

export function DocsLayout({
  title,
  onTitleChange,
  onShare,
  shareLabel,
  status,
  children,
}: DocsLayoutProps) {
  return (
    <div className="docs-app">
      <DocsHeader
        title={title}
        onTitleChange={onTitleChange}
        onShare={onShare}
        shareLabel={shareLabel}
        status={status}
      />
      <DocsMenuBar />
      <DocsToolbar />
      <div className="docs-workspace">
        <div className="docs-page-scroll">
          <div className="docs-page">{children}</div>
        </div>
      </div>
    </div>
  );
}
