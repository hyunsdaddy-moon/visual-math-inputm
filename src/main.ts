import {
  App,
  Editor,
  EditorPosition,
  MarkdownView,
  Modal,
  Notice,
  Plugin,
  PluginSettingTab
} from "obsidian";
import { hangulEquationToLatex } from "./hangulEquation";
import { HANGUL_EQUATION_EXAMPLES } from "./equationExamples";
import "mathlive";

type MathMode = "inline" | "block" | "text";
type MathSize = "small" | "normal" | "large" | "xlarge";

interface VisualMathSettings {
  defaultMode: MathMode;
  insertSpacesInsideInlineMath: boolean;
}

const DEFAULT_SETTINGS: VisualMathSettings = {
  defaultMode: "block",
  insertSpacesInsideInlineMath: false
};

const FIXED_MATH_MODE: MathMode = "block";

interface FormulaTarget {
  latex: string;
  mode: MathMode;
  size?: MathSize;
  from?: EditorPosition;
  to?: EditorPosition;
}

interface HangulEquationTarget {
  source: string;
  mode: MathMode;
  size?: MathSize;
  from?: EditorPosition;
  to?: EditorPosition;
}

const SIZE_OPTIONS: Array<{ value: MathSize; label: string }> = [
  { value: "small", label: "작게" },
  { value: "normal", label: "보통" },
  { value: "large", label: "크게" },
  { value: "xlarge", label: "아주 크게" }
];

const SIZE_COMMANDS: Record<MathSize, string> = {
  small: "\\small",
  normal: "",
  large: "\\Large",
  xlarge: "\\Huge"
};

const EXAM_TEMPLATE = `---
cssclasses:
  - math-exam
---

<div class="exam-top">
  <span>1학기 중간고사</span>
  <span>내신대비</span>
  <span>15회</span>
</div>

## 범위: 처음-인수분해

### 1.
49의 양의 제곱근을 $a$, $\\sqrt{256}$의 음의 제곱근을 $b$라 할 때, $a+b$의 값은?

① 3　　　② 1　　　③ 0  
④ -1　　 ⑤ -3

### 2.
식 $3\\sqrt{5}-\\sqrt{125}+\\frac{15}{\\sqrt{5}}$의 값은?

① $-\\sqrt{5}$　　　② $\\frac{\\sqrt{5}}{5}$　　　③ $\\sqrt{5}$  
④ $2\\sqrt{5}$　　　⑤ $3\\sqrt{5}$

### 3.
다음 수 중에서 가장 큰 수와 가장 작은 수의 합은?

$\\sqrt{3}, -1.5, -\\sqrt{5}, 1+\\sqrt{3}, 1+\\sqrt{5}, \\frac{1}{2}$

① -1　　　② $1+\\sqrt{3}-\\sqrt{5}$　　　③ 1  
④ $\\sqrt{5}-0.5$　　　⑤ 2

### 4.
<보기>에서 옳은 것의 개수는?

> [!exam-view] 보기
> ㄱ. 유리수는 모두 유한소수이다.
> ㄴ. 무리수의 제곱은 항상 유리수이다.
> ㄷ. $\\sqrt{5}$와 $\\sqrt{20}$ 사이의 정수는 2개 있다.
> ㄹ. $n$이 자연수일 때, $\\sqrt{n}$은 항상 무리수이다.

① 1개　　　② 2개　　　③ 3개　　　④ 4개　　　⑤ 5개
`;

type MathfieldElement = HTMLElement & {
  value: string;
  getValue?: (format?: string) => string;
  insert?: (latex: string, options?: unknown) => unknown;
  executeCommand?: (command: string | unknown[]) => unknown;
  focus: () => void;
};

const PALETTE_ITEMS: Array<{ label: string; latex: string }> = [
  { label: "a/b", latex: "\\frac{#?}{#?}" },
  { label: "sqrt", latex: "\\sqrt{#?}" },
  { label: "x^n", latex: "^{#?}" },
  { label: "x_n", latex: "_{#?}" },
  { label: "sum", latex: "\\sum_{#?}^{#?}" },
  { label: "int", latex: "\\int_{#?}^{#?}" },
  { label: "lim", latex: "\\lim_{#? \\to #?}" },
  { label: "pi", latex: "\\pi" },
  { label: "theta", latex: "\\theta" },
  { label: "alpha", latex: "\\alpha" },
  { label: "matrix", latex: "\\begin{matrix}#? & #?\\\\#? & #?\\end{matrix}" },
  { label: "cases", latex: "\\begin{cases}#? & #?\\\\#? & #?\\end{cases}" }
];

export default class VisualMathInputPlugin extends Plugin {
  settings: VisualMathSettings = DEFAULT_SETTINGS;

  async onload(): Promise<void> {
    await this.loadSettings();

    this.addRibbonIcon("sigma", "Visual Math InputM", () => {
      this.openHangulEquationModalForActiveEditor();
    });

    this.addCommand({
      id: "open",
      name: "열기 / Open",
      editorCallback: (editor) => {
        const target = getHangulEquationTarget(editor, getPreferredMathMode(editor));
        this.openHangulEquationModal(editor, target);
      }
    });

    this.addCommand({
      id: "insert-exam-template",
      name: "시험지 템플릿 삽입 / Insert exam template",
      editorCallback: (editor) => {
        editor.replaceSelection(EXAM_TEMPLATE);
      }
    });

    this.addCommand({
      id: "wrap-in-exam-box",
      name: "박스에 넣기 / Put in box",
      editorCallback: (editor) => {
        wrapSelectionInExamBox(editor);
      }
    });

    this.addSettingTab(new VisualMathSettingTab(this.app, this));
  }

  async loadSettings(): Promise<void> {
    this.settings = {
      ...DEFAULT_SETTINGS,
      ...(await this.loadData())
    };
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }

  private openHangulEquationModalForActiveEditor(): void {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    const editor = view?.editor;

    if (!editor) {
      new Notice("활성화된 Markdown 편집기가 없습니다.");
      return;
    }

    this.openHangulEquationModal(editor, getHangulEquationTarget(editor, getPreferredMathMode(editor)));
  }

  private openHangulEquationModal(editor: Editor, target: HangulEquationTarget): void {
    new HangulEquationModal(this.app, target, (source, size) => {
      const latex = equationSourceToLatex(source);
      const formatted = formatLatex(applyLatexSize(latex, size), target.mode, this.settings);

      if (target.from && target.to) {
        editor.replaceRange(formatted, target.from, target.to);
      } else {
        editor.replaceSelection(formatted);
      }
    }).open();
  }
}

class VisualMathModal extends Modal {
  private field?: MathfieldElement;
  private previewEl?: HTMLElement;
  private mode: MathMode;

  constructor(
    app: App,
    private readonly target: FormulaTarget,
    private readonly onSubmit: (latex: string, mode: MathMode) => void
  ) {
    super(app);
    this.mode = FIXED_MATH_MODE;
  }

  onOpen(): void {
    const { contentEl } = this;
    this.modalEl.addClass("visual-math-input-shell");
    contentEl.empty();
    contentEl.addClass("visual-math-input-modal");

    const toolbar = contentEl.createDiv({ cls: "visual-math-input-toolbar" });
    toolbar.createEl("h2", { text: "수식 입력" });

    this.field = document.createElement("math-field") as MathfieldElement;
    this.field.setAttribute("virtual-keyboard-mode", "onfocus");
    this.field.setAttribute("smart-fence", "");
    this.field.setAttribute("smart-mode", "");
    this.field.value = this.target.latex;
    this.field.addEventListener("input", () => this.updatePreview());
    this.field.addEventListener("keydown", (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        this.submit();
      }
    });
    contentEl.appendChild(this.field);

    const palette = contentEl.createDiv({ cls: "visual-math-input-palette" });
    for (const item of PALETTE_ITEMS) {
      const button = palette.createEl("button", {
        text: item.label,
        attr: {
          type: "button",
          "aria-label": item.latex
        }
      });
      button.addEventListener("click", () => this.insertLatex(item.latex));
    }

    this.previewEl = contentEl.createDiv({ cls: "visual-math-input-preview" });

    const actions = contentEl.createDiv({ cls: "visual-math-input-actions" });
    const cancelButton = actions.createEl("button", { text: "취소" });
    cancelButton.addEventListener("click", () => this.close());

    const insertButton = actions.createEl("button", {
      text: "넣기",
      cls: "mod-cta"
    });
    insertButton.addEventListener("click", () => this.submit());

    this.updatePreview();
    window.setTimeout(() => this.field?.focus(), 50);
  }

  onClose(): void {
    this.contentEl.empty();
  }

  private insertLatex(latex: string): void {
    if (!this.field) return;

    if (this.field.insert) {
      this.field.insert(latex, { selectionMode: "placeholder" });
    } else if (this.field.executeCommand) {
      this.field.executeCommand(["insert", latex]);
    } else {
      this.field.value = `${this.field.value}${latex.replaceAll("#?", "")}`;
    }

    this.field.dispatchEvent(new Event("input"));
    this.field.focus();
  }

  private submit(): void {
    const latex = this.getLatexValue().trim();
    this.onSubmit(latex, this.mode);
    this.close();
  }

  private updatePreview(): void {
    if (!this.previewEl || !this.field) return;

    this.previewEl.setText(formatLatex(this.getLatexValue(), this.mode, {
      defaultMode: this.mode,
      insertSpacesInsideInlineMath: false
    }));
  }

  private getLatexValue(): string {
    return this.field?.getValue?.("latex-without-placeholders") ?? this.field?.value ?? "";
  }
}

class HangulEquationModal extends Modal {
  private sourceEl?: HTMLTextAreaElement;
  private previewField?: MathfieldElement;
  private markdownPreviewEl?: HTMLElement;
  private latexPreviewEl?: HTMLElement;
  private readonly insertMode: MathMode;
  private size: MathSize;

  constructor(
    app: App,
    private readonly target: HangulEquationTarget,
    private readonly onSubmit: (source: string, size: MathSize) => void
  ) {
    super(app);
    this.insertMode = target.mode;
    this.size = target.size ?? "normal";
  }

  onOpen(): void {
    const { contentEl } = this;
    this.modalEl.addClass("visual-math-input-shell");
    contentEl.empty();
    contentEl.addClass("visual-math-input-modal");

    const toolbar = contentEl.createDiv({ cls: "visual-math-input-toolbar" });
    toolbar.createEl("h2", { text: "한글 수식 입력" });
    this.createSizeControl(toolbar);

    this.sourceEl = contentEl.createEl("textarea", {
      cls: "visual-math-input-source",
      attr: {
        spellcheck: "false",
        placeholder: "예: x = {-b +- sqrt{b^2-4ac}} over {2a}"
      }
    });
    this.sourceEl.value = this.target.source;
    this.sourceEl.addEventListener("input", () => this.updatePreview());
    this.sourceEl.addEventListener("keydown", (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        this.submit();
      }
    });

    const exampleLibrary = contentEl.createDiv({ cls: "visual-math-example-library" });
    const exampleSelect = exampleLibrary.createEl("select", {
      cls: "visual-math-example-select",
      attr: { "aria-label": "수식 예제 선택" }
    });
    exampleSelect.createEl("option", {
      text: `예제 선택 (${HANGUL_EQUATION_EXAMPLES.length}개)`,
      value: ""
    });
    for (const category of getExampleCategories()) {
      const group = document.createElement("optgroup");
      group.label = category;
      HANGUL_EQUATION_EXAMPLES.forEach((example, index) => {
        if (example.category !== category) return;
        const option = document.createElement("option");
        option.value = String(index);
        option.textContent = example.label;
        group.appendChild(option);
      });
      exampleSelect.appendChild(group);
    }
    exampleSelect.addEventListener("change", () => {
      const index = Number(exampleSelect.value);
      if (!Number.isInteger(index)) return;
      this.applyExample(HANGUL_EQUATION_EXAMPLES[index]?.source);
    });

    this.previewField = document.createElement("math-field") as MathfieldElement;
    this.previewField.setAttribute("read-only", "");
    this.previewField.setAttribute("virtual-keyboard-mode", "off");
    contentEl.appendChild(this.previewField);

    this.latexPreviewEl = contentEl.createDiv({ cls: "visual-math-input-preview" });
    this.markdownPreviewEl = contentEl.createDiv({ cls: "visual-math-input-preview" });

    const actions = contentEl.createDiv({ cls: "visual-math-input-actions" });
    const cancelButton = actions.createEl("button", { text: "취소" });
    cancelButton.addEventListener("click", () => this.close());

    const insertButton = actions.createEl("button", {
      text: "넣기",
      cls: "mod-cta"
    });
    insertButton.addEventListener("click", () => this.submit());

    this.updatePreview();
    window.setTimeout(() => this.sourceEl?.focus(), 50);
  }

  onClose(): void {
    this.contentEl.empty();
  }

  private submit(): void {
    this.onSubmit(this.sourceEl?.value ?? "", this.size);
    this.close();
  }

  private createSizeControl(containerEl: HTMLElement): void {
    const control = containerEl.createDiv({ cls: "visual-math-size-control" });
    control.createEl("span", { text: "크기" });
    const select = control.createEl("select", { attr: { "aria-label": "수식 크기" } });

    for (const option of SIZE_OPTIONS) {
      select.createEl("option", {
        text: option.label,
        value: option.value
      });
    }

    select.value = this.size;
    select.addEventListener("change", () => {
      this.size = select.value as MathSize;
      this.updatePreview();
    });
  }

  private applyExample(source: string | undefined): void {
    if (!source || !this.sourceEl) return;

    this.sourceEl.value = source;
    this.updatePreview();
    this.sourceEl.focus();
  }

  private updatePreview(): void {
    const source = this.sourceEl?.value ?? "";
    const latex = equationSourceToLatex(source);
    const sizedLatex = applyLatexSize(latex, this.size);
    const markdown = formatLatex(sizedLatex, this.insertMode, {
      defaultMode: this.insertMode,
      insertSpacesInsideInlineMath: false
    });

    if (this.previewField) this.previewField.value = sizedLatex;
    this.latexPreviewEl?.setText(`LaTeX: ${sizedLatex}`);
    this.markdownPreviewEl?.setText(`Markdown: ${markdown}`);
  }
}

function getExampleCategories(): string[] {
  return Array.from(new Set(HANGUL_EQUATION_EXAMPLES.map((example) => example.category)));
}

function wrapSelectionInExamBox(editor: Editor): void {
  const selection = editor.getSelection();

  if (!selection.trim()) {
    new Notice("박스에 넣을 내용을 먼저 선택하세요.");
    return;
  }

  const content = selection.replace(/\r\n?/g, "\n").trim();
  const quotedLines = content.split("\n").map((line) => (line.trim() ? `> ${line}` : ">"));
  const boxed = [
    "> [!exam-view] 보기",
    "> <span class=\"exam-center\"></span>",
    ...quotedLines
  ].join("\n");

  editor.replaceSelection(boxed);
}

function equationSourceToLatex(source: string): string {
  const normalized = source
    .replace(/\u00a0/g, " ")
    .replace(/\r\n?/g, "\n")
    .trim();

  if (looksLikeLatex(normalized)) return normalized;

  return hangulEquationToLatex(normalized);
}

function looksLikeLatex(source: string): boolean {
  return /\\[A-Za-z]+/.test(source) || /\\[{}$%&#_^]/.test(source);
}

function getPreferredMathMode(editor: Editor): MathMode {
  const selection = editor.getSelection();
  const cursor = editor.getCursor();
  const line = editor.getLine(cursor.line);

  if (selection.trim()) {
    const selectedLines = selection.split(/\r?\n/);
    if (selectedLines.length > 1) return "block";
    return line.trim() ? "inline" : "block";
  }

  return line.trim() ? "inline" : FIXED_MATH_MODE;
}

class VisualMathSettingTab extends PluginSettingTab {
  constructor(app: App, private readonly plugin: VisualMathInputPlugin) {
    super(app, plugin);
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Visual Math InputM" });
    containerEl.createEl("p", {
      text: "빈 줄에서는 블록 수식($$...$$), 문장이나 표 안에서는 인라인 수식($...$)으로 삽입합니다."
    });
    containerEl.createEl("p", {
      text: "시험지 레이아웃은 새 노트에서 'Visual Math InputM: 시험지 템플릿 삽입'을 실행한 뒤 읽기/인쇄 화면에서 확인합니다."
    });
  }
}

function getHangulEquationTarget(editor: Editor, defaultMode: MathMode): HangulEquationTarget {
  const selection = editor.getSelection();

  if (selection.trim()) {
    const target = unwrapLatex(selection, defaultMode, editor.getCursor("from"), editor.getCursor("to"));
    return {
      source: target.latex,
      mode: target.mode,
      size: target.size,
      from: target.from,
      to: target.to
    };
  }

  const inlineTarget = getInlineFormulaAtCursor(editor);
  if (inlineTarget) {
    return {
      source: inlineTarget.latex,
      mode: inlineTarget.mode,
      size: inlineTarget.size,
      from: inlineTarget.from,
      to: inlineTarget.to
    };
  }

  const blockTarget = getBlockFormulaAtCursor(editor);
  if (blockTarget) {
    return {
      source: blockTarget.latex,
      mode: blockTarget.mode,
      size: blockTarget.size,
      from: blockTarget.from,
      to: blockTarget.to
    };
  }

  return {
    source: "",
    mode: defaultMode,
    size: "normal"
  };
}

function getFormulaTarget(editor: Editor, defaultMode: MathMode): FormulaTarget {
  const selection = editor.getSelection();
  if (selection.trim()) {
    return unwrapLatex(selection, defaultMode, editor.getCursor("from"), editor.getCursor("to"));
  }

  const inlineTarget = getInlineFormulaAtCursor(editor);
  if (inlineTarget) return inlineTarget;

  return { latex: "", mode: defaultMode };
}

function getInlineFormulaAtCursor(editor: Editor): FormulaTarget | null {
  const cursor = editor.getCursor();
  const line = editor.getLine(cursor.line);

  const before = line.slice(0, cursor.ch);
  const after = line.slice(cursor.ch);
  const start = before.lastIndexOf("$");
  const endOffset = after.indexOf("$");

  if (start === -1 || endOffset === -1) return null;
  if (line[start - 1] === "$" || after[endOffset + 1] === "$") return null;

  const end = cursor.ch + endOffset;
  const raw = line.slice(start, end + 1);
  const extracted = extractLatexSize(raw.slice(1, -1).trim());

  return {
    latex: extracted.latex,
    mode: "inline",
    size: extracted.size,
    from: { line: cursor.line, ch: start },
    to: { line: cursor.line, ch: end + 1 }
  };
}

function getBlockFormulaAtCursor(editor: Editor): FormulaTarget | null {
  const cursor = editor.getCursor();
  let from: EditorPosition | null = null;
  let to: EditorPosition | null = null;

  for (let lineNumber = cursor.line; lineNumber >= 0; lineNumber--) {
    const line = editor.getLine(lineNumber);
    const searchText = lineNumber === cursor.line ? line.slice(0, cursor.ch + 1) : line;
    const ch = searchText.lastIndexOf("$$");
    if (ch !== -1) {
      from = { line: lineNumber, ch };
      break;
    }
  }

  if (!from) return null;

  for (let lineNumber = cursor.line; lineNumber < editor.lineCount(); lineNumber++) {
    const line = editor.getLine(lineNumber);
    const searchFrom = lineNumber === from.line ? from.ch + 2 : 0;
    const ch = line.indexOf("$$", searchFrom);
    if (ch !== -1) {
      to = { line: lineNumber, ch: ch + 2 };
      break;
    }
  }

  if (!to) return null;

  const raw = editor.getRange(from, to);
  const unwrapped = unwrapLatex(raw, "block", from, to);
  return unwrapped.mode === "block" ? unwrapped : null;
}

function unwrapLatex(
  rawSelection: string,
  defaultMode: MathMode,
  from: EditorPosition,
  to: EditorPosition
): FormulaTarget {
  const trimmed = rawSelection.trim();

  if (trimmed.startsWith("$$") && trimmed.endsWith("$$")) {
    const extracted = extractLatexSize(trimmed.slice(2, -2).trim());
    return {
      latex: extracted.latex,
      mode: "block",
      size: extracted.size,
      from,
      to
    };
  }

  if (trimmed.startsWith("\\$") && trimmed.endsWith("\\$")) {
    const extracted = extractLatexSize(trimmed.slice(2, -2).trim());
    return {
      latex: extracted.latex,
      mode: "text",
      size: extracted.size,
      from,
      to
    };
  }

  if (trimmed.startsWith("$") && trimmed.endsWith("$")) {
    const extracted = extractLatexSize(trimmed.slice(1, -1).trim());
    return {
      latex: extracted.latex,
      mode: "inline",
      size: extracted.size,
      from,
      to
    };
  }

  if (trimmed.startsWith("\\[") && trimmed.endsWith("\\]")) {
    const extracted = extractLatexSize(trimmed.slice(2, -2).trim());
    return {
      latex: extracted.latex,
      mode: "block",
      size: extracted.size,
      from,
      to
    };
  }

  if (trimmed.startsWith("\\(") && trimmed.endsWith("\\)")) {
    const extracted = extractLatexSize(trimmed.slice(2, -2).trim());
    return {
      latex: extracted.latex,
      mode: "inline",
      size: extracted.size,
      from,
      to
    };
  }

  return {
    latex: rawSelection,
    mode: defaultMode,
    size: "normal",
    from,
    to
  };
}

function applyLatexSize(latex: string, size: MathSize): string {
  const body = latex.trim();
  const command = SIZE_COMMANDS[size];
  return command ? `${command} ${body}` : body;
}

function extractLatexSize(latex: string): { latex: string; size: MathSize } {
  const trimmed = latex.trim();
  const match = trimmed.match(/^\\(scriptsize|footnotesize|small|normalsize|large|Large|LARGE|huge|Huge)\s+([\s\S]*)$/);

  if (!match) {
    return { latex: trimmed, size: "normal" };
  }

  const [, command, body] = match;
  const size =
    command === "scriptsize" || command === "footnotesize" || command === "small"
      ? "small"
      : command === "huge" || command === "Huge"
        ? "xlarge"
        : command === "normalsize"
          ? "normal"
          : "large";
  return { latex: body.trim(), size };
}

function formatLatex(latex: string, mode: MathMode, settings: VisualMathSettings): string {
  const body = latex.trim();

  if (mode === "block") {
    return `$$${body}$$`;
  }

  if (mode === "text") {
    return `\\$${body}\\$`;
  }

  if (settings.insertSpacesInsideInlineMath) {
    return `$ ${body} $`;
  }

  return `$${body}$`;
}
