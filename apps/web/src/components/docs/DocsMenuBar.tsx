const MENU_ITEMS = [
  "File",
  "Edit",
  "View",
  "Insert",
  "Format",
  "Tools",
  "Extensions",
  "Help",
] as const;

export function DocsMenuBar() {
  return (
    <nav className="docs-menu" aria-label="Document menu">
      {MENU_ITEMS.map((item) => (
        <button key={item} type="button" className="docs-menu__item">
          {item}
        </button>
      ))}
    </nav>
  );
}
