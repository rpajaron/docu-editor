import { Icon } from "./Icon.js";

interface ToolbarButtonProps {
  icon: string;
  label: string;
  filled?: boolean;
  active?: boolean;
}

function ToolbarButton({ icon, label, filled, active }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      className={`docs-toolbar__btn ${active ? "docs-toolbar__btn--active" : ""}`}
      title={label}
      aria-label={label}
    >
      <Icon name={icon} filled={filled} />
    </button>
  );
}

function ToolbarDivider() {
  return <span className="docs-toolbar__divider" aria-hidden />;
}

export function DocsToolbar() {
  return (
    <div className="docs-toolbar" role="toolbar" aria-label="Formatting">
      <ToolbarButton icon="undo" label="Undo" />
      <ToolbarButton icon="redo" label="Redo" />
      <ToolbarDivider />
      <ToolbarButton icon="print" label="Print" />
      <ToolbarButton icon="spellcheck" label="Spelling" />
      <ToolbarDivider />
      <select className="docs-toolbar__select" defaultValue="100" aria-label="Zoom">
        <option value="50">50%</option>
        <option value="75">75%</option>
        <option value="90">90%</option>
        <option value="100">100%</option>
        <option value="125">125%</option>
        <option value="150">150%</option>
      </select>
      <ToolbarDivider />
      <select className="docs-toolbar__select docs-toolbar__select--wide" defaultValue="Arial" aria-label="Font">
        <option>Arial</option>
        <option>Roboto</option>
        <option>Times New Roman</option>
        <option>Georgia</option>
        <option>Courier New</option>
      </select>
      <select className="docs-toolbar__select docs-toolbar__select--narrow" defaultValue="11" aria-label="Font size">
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
        <option value="11">11</option>
        <option value="12">12</option>
        <option value="14">14</option>
        <option value="18">18</option>
        <option value="24">24</option>
      </select>
      <ToolbarDivider />
      <ToolbarButton icon="format_bold" label="Bold" />
      <ToolbarButton icon="format_italic" label="Italic" />
      <ToolbarButton icon="format_underlined" label="Underline" />
      <ToolbarButton icon="format_color_text" label="Text color" />
      <ToolbarButton icon="format_color_fill" label="Highlight color" />
      <ToolbarDivider />
      <ToolbarButton icon="format_align_left" label="Align left" active />
      <ToolbarButton icon="format_align_center" label="Align center" />
      <ToolbarButton icon="format_align_right" label="Align right" />
      <ToolbarButton icon="format_align_justify" label="Justify" />
      <ToolbarDivider />
      <ToolbarButton icon="format_list_bulleted" label="Bulleted list" />
      <ToolbarButton icon="format_list_numbered" label="Numbered list" />
      <ToolbarDivider />
      <ToolbarButton icon="format_indent_decrease" label="Decrease indent" />
      <ToolbarButton icon="format_indent_increase" label="Increase indent" />
      <ToolbarButton icon="format_clear" label="Clear formatting" />
    </div>
  );
}
