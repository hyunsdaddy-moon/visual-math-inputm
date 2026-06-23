const SYMBOL_REPLACEMENTS: Array<[string, string]> = [
  ["<=>", "\\Leftrightarrow"],
  ["=>", "\\Rightarrow"],
  ["+-", "\\pm"],
  ["-+", "\\mp"],
  [">=", "\\ge"],
  ["<=", "\\le"],
  ["!=", "\\ne"],
  ["<>", "\\ne"],
  ["->", "\\to"],
  ["<-", "\\leftarrow"],
  ["<<", "\\ll"],
  [">>", "\\gg"]
];

const WORD_COMMANDS: Record<string, string> = {
  aleph: "\\aleph",
  alpha: "\\alpha",
  and: "\\land",
  angle: "\\angle",
  approx: "\\approx",
  ast: "\\ast",
  because: "\\because",
  beta: "\\beta",
  bot: "\\bot",
  bullet: "\\bullet",
  cap: "\\cap",
  cdot: "\\cdot",
  cdots: "\\cdots",
  circ: "\\circ",
  complexc: "\\mathbb{C}",
  cong: "\\cong",
  cup: "\\cup",
  ddots: "\\ddots",
  diamond: "\\diamond",
  gamma: "\\gamma",
  delta: "\\delta",
  div: "\\div",
  dots: "\\dots",
  emptyset: "\\emptyset",
  epsilon: "\\epsilon",
  equiv: "\\equiv",
  eta: "\\eta",
  exists: "\\exists",
  forall: "\\forall",
  geq: "\\ge",
  gt: ">",
  iff: "\\Leftrightarrow",
  imaginaryi: "\\mathrm{i}",
  in: "\\in",
  inf: "\\infty",
  infinity: "\\infty",
  infty: "\\infty",
  iota: "\\iota",
  kappa: "\\kappa",
  ldots: "\\ldots",
  lambda: "\\lambda",
  land: "\\land",
  larrow: "\\leftarrow",
  lbrace: "\\{",
  leftarrow: "\\leftarrow",
  leq: "\\le",
  lor: "\\lor",
  lrarrow: "\\leftrightarrow",
  lt: "<",
  mapsto: "\\mapsto",
  mod: "\\bmod",
  minusplus: "\\mp",
  mp: "\\mp",
  mu: "\\mu",
  nabla: "\\nabla",
  naturaln: "\\mathbb{N}",
  ne: "\\ne",
  neq: "\\ne",
  ni: "\\ni",
  not: "\\neg",
  notin: "\\notin",
  nu: "\\nu",
  omega: "\\omega",
  oo: "\\infty",
  or: "\\lor",
  parallel: "\\parallel",
  partial: "\\partial",
  perp: "\\perp",
  phi: "\\phi",
  pi: "\\pi",
  plusminus: "\\pm",
  pm: "\\pm",
  prod: "\\prod",
  propto: "\\propto",
  psi: "\\psi",
  qquad: "\\qquad",
  quad: "\\quad",
  rationalq: "\\mathbb{Q}",
  rarrow: "\\to",
  rbrace: "\\}",
  realr: "\\mathbb{R}",
  rightarrow: "\\to",
  rho: "\\rho",
  adj: "\\operatorname{adj}",
  sim: "\\sim",
  simeq: "\\simeq",
  sigma: "\\sigma",
  smallint: "\\int",
  square: "\\square",
  star: "\\star",
  subset: "\\subset",
  subseteq: "\\subseteq",
  superset: "\\supset",
  superseteq: "\\supseteq",
  tau: "\\tau",
  therefore: "\\therefore",
  theta: "\\theta",
  times: "\\times",
  to: "\\to",
  top: "\\top",
  union: "\\cup",
  upsilon: "\\upsilon",
  varepsilon: "\\varepsilon",
  varphi: "\\varphi",
  vdots: "\\vdots",
  xi: "\\xi",
  zeta: "\\zeta",
  Alpha: "A",
  Beta: "B",
  Gamma: "\\Gamma",
  Delta: "\\Delta",
  Theta: "\\Theta",
  Lambda: "\\Lambda",
  Pi: "\\Pi",
  Sigma: "\\Sigma",
  Phi: "\\Phi",
  Psi: "\\Psi",
  Omega: "\\Omega",
  degree: "^\\circ",
  hbar: "\\hbar",
  integerz: "\\mathbb{Z}",
  int: "\\int",
  oint: "\\oint",
  sum: "\\sum"
};

const ONE_ARG_COMMANDS: Record<string, string> = {
  abs: "\\left|%\\right|",
  acute: "\\acute{%}",
  bar: "\\bar{%}",
  bbox: "\\boxed{%}",
  box: "\\boxed{%}",
  boxed: "\\boxed{%}",
  bracket: "\\left[%\\right]",
  breve: "\\breve{%}",
  ceil: "\\left\\lceil%\\right\\rceil",
  check: "\\check{%}",
  ddot: "\\ddot{%}",
  dot: "\\dot{%}",
  floor: "\\left\\lfloor%\\right\\rfloor",
  grave: "\\grave{%}",
  hat: "\\hat{%}",
  norm: "\\left\\|%\\right\\|",
  overbrace: "\\overbrace{%}",
  overline: "\\overline{%}",
  paren: "\\left(%\\right)",
  sqrt: "\\sqrt{%}",
  text: "\\text{%}",
  tilde: "\\tilde{%}",
  underbrace: "\\underbrace{%}",
  underline: "\\underline{%}",
  vec: "\\vec{%}"
};

const TWO_ARG_COMMANDS: Record<string, string> = {
  binom: "\\binom{%1}{%2}",
  choose: "\\binom{%1}{%2}",
  color: "\\color{%1}{%2}",
  frac: "\\frac{%1}{%2}",
  overset: "\\overset{%1}{%2}",
  stackrel: "\\stackrel{%1}{%2}",
  underset: "\\underset{%1}{%2}"
};

const MATH_FUNCTIONS = new Set([
  "arccos",
  "arccosh",
  "arcsin",
  "arcsinh",
  "arctan",
  "arctanh",
  "cos",
  "cosh",
  "cot",
  "coth",
  "csc",
  "deg",
  "det",
  "dim",
  "exp",
  "gcd",
  "hom",
  "ker",
  "lg",
  "lim",
  "ln",
  "log",
  "rank",
  "max",
  "min",
  "Pr",
  "sec",
  "sin",
  "sinh",
  "tan",
  "tanh"
]);

const SCRIPT_KEYWORDS = new Set(["sub", "sup", "from", "to", "under", "above"]);

export function hangulEquationToLatex(input: string): string {
  return convertExpression(normalizeInput(input));
}

function normalizeInput(input: string): string {
  return input
    .replace(/\u00a0/g, " ")
    .replace(/\r\n?/g, "\n")
    .trim();
}

function convertExpression(raw: string): string {
  const source = stripOuterGroup(raw.trim());
  const scripted = convertFirstScriptChain(source);

  if (scripted) {
    return scripted;
  }

  const over = findTopLevelOver(source);

  if (over) {
    const prefix = source.slice(0, over.leftStart);
    const numerator = source.slice(over.leftStart, over.leftEnd);
    const denominator = source.slice(over.rightStart, over.rightEnd);
    const suffix = source.slice(over.rightEnd);
    const convertedPrefix = convertSegments(prefix);
    const convertedSuffix = convertSegments(suffix);
    const fraction = `\\frac{${convertExpression(numerator)}}{${convertExpression(denominator)}}`;

    return joinConvertedParts(convertedPrefix, fraction, convertedSuffix);
  }

  return convertSegments(source);
}

function joinConvertedParts(...parts: string[]): string {
  return parts.filter(Boolean).join(" ");
}

function convertFirstScriptChain(source: string): string | null {
  const script = findTopLevelScriptKeyword(source);
  if (!script) return null;

  const baseEnd = trimLeftOperandEnd(source, script.index);
  const baseStart = findLeftOperandStart(source, baseEnd);
  if (baseStart === baseEnd) return null;

  const prefix = source.slice(0, baseStart);
  const base = source.slice(baseStart, baseEnd);
  let index = script.index;
  let convertedBase = convertExpression(base);

  while (true) {
    const next = readScriptKeywordAt(source, index);
    if (!next) break;

    const argumentStart = trimRightOperandStart(source, index + next.length);
    const argumentEnd = findRightOperandEnd(source, argumentStart);
    if (argumentStart === argumentEnd) break;

    const argument = convertExpression(source.slice(argumentStart, argumentEnd));

    if (next.keyword === "sub" || next.keyword === "from") {
      convertedBase += `_{${argument}}`;
    } else if (next.keyword === "sup" || next.keyword === "to") {
      convertedBase += `^{${argument}}`;
    } else if (next.keyword === "under") {
      convertedBase = `\\underset{${argument}}{${convertedBase}}`;
    } else if (next.keyword === "above") {
      convertedBase = `\\overset{${argument}}{${convertedBase}}`;
    }

    index = argumentEnd;
    while (/\s/.test(source[index] ?? "")) index += 1;
  }

  const suffix = source.slice(index);
  return joinConvertedParts(convertExpression(prefix), convertedBase, convertExpression(suffix));
}

function convertSegments(source: string): string {
  let output = "";
  let index = 0;

  while (index < source.length) {
    const operator = findSymbolReplacement(source, index);
    if (operator) {
      output += operator.replacement;
      index += operator.source.length;
      continue;
    }

    const char = source[index];

    if (char === "{") {
      const match = findMatching(source, index, "{", "}");
      if (match >= 0) {
        output += `{${convertExpression(source.slice(index + 1, match))}}`;
        index = match + 1;
        continue;
      }
    }

    if (char === "(") {
      const match = findMatching(source, index, "(", ")");
      if (match >= 0) {
        output += `(${convertExpression(source.slice(index + 1, match))})`;
        index = match + 1;
        continue;
      }
    }

    if (isIdentifierStart(char)) {
      const wordStart = index;
      index += 1;
      while (index < source.length && isIdentifierPart(source[index])) index += 1;

      const word = source.slice(wordStart, index);
      const lower = word.toLowerCase();
      const parsedRoot = parseRootOf(source, index);

      if (lower === "root" && parsedRoot) {
        output += `\\sqrt[${convertExpression(parsedRoot.indexBody)}]{${convertExpression(parsedRoot.radicand)}}`;
        index = parsedRoot.end;
        continue;
      }

      const parsedGroup = parseOptionalGroup(source, index);
      const parsedTwoGroups = parseTwoOptionalGroups(source, index);

      if (parsedTwoGroups && TWO_ARG_COMMANDS[lower]) {
        const first = convertExpression(parsedTwoGroups.first);
        const second = convertExpression(parsedTwoGroups.second);
        output += TWO_ARG_COMMANDS[lower].replace("%1", first).replace("%2", second);
        index = parsedTwoGroups.end;
        continue;
      }

      if (parsedGroup && ONE_ARG_COMMANDS[lower]) {
        const converted = convertExpression(parsedGroup.body);
        output += ONE_ARG_COMMANDS[lower].replace("%", converted);
        index = parsedGroup.end;
        continue;
      }

      if (parsedGroup && isMatrixCommand(lower)) {
        output += convertMatrixLike(lower, parsedGroup.body);
        index = parsedGroup.end;
        continue;
      }

      if (MATH_FUNCTIONS.has(word) || MATH_FUNCTIONS.has(lower)) {
        output += `\\${word}`;
        continue;
      }

      output += WORD_COMMANDS[word] ?? WORD_COMMANDS[lower] ?? word;
      continue;
    }

    output += char;
    index += 1;
  }

  return output.replace(/\s+/g, " ").trim();
}

function parseTwoOptionalGroups(source: string, start: number): { first: string; second: string; end: number } | null {
  const first = parseOptionalGroup(source, start);
  if (!first) return null;

  const second = parseOptionalGroup(source, first.end);
  if (!second) return null;

  return {
    first: first.body,
    second: second.body,
    end: second.end
  };
}

function findSymbolReplacement(source: string, index: number): { source: string; replacement: string } | null {
  for (const [needle, replacement] of SYMBOL_REPLACEMENTS) {
    if (source.startsWith(needle, index)) {
      return { source: needle, replacement };
    }
  }

  return null;
}

function parseOptionalGroup(source: string, start: number): { body: string; end: number } | null {
  let index = start;
  while (source[index] === " " || source[index] === "\n" || source[index] === "\t") index += 1;

  if (source[index] !== "{") return null;

  const end = findMatching(source, index, "{", "}");
  if (end < 0) return null;

  return {
    body: source.slice(index + 1, end),
    end: end + 1
  };
}

function parseRootOf(source: string, start: number): { indexBody: string; radicand: string; end: number } | null {
  const indexGroup = parseOptionalGroup(source, start);
  if (!indexGroup) return null;

  let index = indexGroup.end;
  while (source[index] === " " || source[index] === "\n" || source[index] === "\t") index += 1;

  if (source.slice(index, index + 2).toLowerCase() !== "of") return null;
  index += 2;

  const radicandGroup = parseOptionalGroup(source, index);
  if (!radicandGroup) return null;

  return {
    indexBody: indexGroup.body,
    radicand: radicandGroup.body,
    end: radicandGroup.end
  };
}

function convertMatrixLike(command: string, body: string): string {
  const environment = command === "cases" ? "cases" : command;
  const rows = splitTopLevel(body, "#").map((row) =>
    splitTopLevel(row, "&").map((cell) => convertExpression(cell)).join(" & ")
  );

  return `\\begin{${environment}}${rows.join("\\\\")}\\end{${environment}}`;
}

function isMatrixCommand(command: string): boolean {
  return (
    command === "matrix" ||
    command === "pmatrix" ||
    command === "bmatrix" ||
    command === "vmatrix" ||
    command === "Vmatrix" ||
    command === "cases"
  );
}

function splitTopLevel(source: string, delimiter: string): string[] {
  const result: string[] = [];
  let depth = 0;
  let start = 0;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (char === "{" || char === "(" || char === "[") depth += 1;
    if (char === "}" || char === ")" || char === "]") depth -= 1;

    if (depth === 0 && source[index] === delimiter) {
      result.push(source.slice(start, index));
      start = index + 1;
    }
  }

  result.push(source.slice(start));
  return result;
}

function findTopLevelOver(
  source: string
): { leftStart: number; leftEnd: number; rightStart: number; rightEnd: number } | null {
  const keyword = "over";
  const overIndex = findTopLevelKeyword(source, keyword);
  if (overIndex < 0) return null;

  const leftEnd = trimLeftOperandEnd(source, overIndex);
  const leftStart = findLeftOperandStart(source, leftEnd);
  const rightStart = trimRightOperandStart(source, overIndex + keyword.length);
  const rightEnd = findRightOperandEnd(source, rightStart);

  if (leftStart === leftEnd || rightStart === rightEnd) return null;

  return {
    leftStart,
    leftEnd,
    rightStart,
    rightEnd
  };
}

function findTopLevelKeyword(source: string, keyword: string): number {
  let depth = 0;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (char === "{" || char === "(" || char === "[") depth += 1;
    if (char === "}" || char === ")" || char === "]") depth -= 1;

    if (depth === 0 && source.slice(index, index + keyword.length).toLowerCase() === keyword) {
      const before = source[index - 1] ?? " ";
      const after = source[index + keyword.length] ?? " ";
      if (!isIdentifierPart(before) && !isIdentifierPart(after)) return index;
    }
  }

  return -1;
}

function findTopLevelScriptKeyword(source: string): { index: number; keyword: string } | null {
  let depth = 0;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (char === "{" || char === "(" || char === "[") depth += 1;
    if (char === "}" || char === ")" || char === "]") depth -= 1;
    if (depth !== 0 || !isIdentifierStart(char)) continue;

    const matched = readScriptKeywordAt(source, index);
    if (matched) return { index, keyword: matched.keyword };
  }

  return null;
}

function readScriptKeywordAt(source: string, index: number): { keyword: string; length: number } | null {
  for (const keyword of SCRIPT_KEYWORDS) {
    if (source.slice(index, index + keyword.length).toLowerCase() !== keyword) continue;

    const before = source[index - 1] ?? " ";
    const after = source[index + keyword.length] ?? " ";
    if (!isIdentifierPart(before) && !isIdentifierPart(after)) {
      return { keyword, length: keyword.length };
    }
  }

  return null;
}

function trimLeftOperandEnd(source: string, end: number): number {
  let result = end;
  while (result > 0 && /\s/.test(source[result - 1])) result -= 1;
  return result;
}

function trimRightOperandStart(source: string, start: number): number {
  let result = start;
  while (result < source.length && /\s/.test(source[result])) result += 1;
  return result;
}

function findLeftOperandStart(source: string, end: number): number {
  const previous = source[end - 1];

  if (previous === "}") {
    const start = findMatchingBackward(source, end - 1, "{", "}");
    if (start >= 0) {
      if (source[start - 1] === "_" || source[start - 1] === "^") {
        return findLeftOperandStart(source, start - 1);
      }

      const commandStart = findIdentifierStartBefore(source, start);
      if (commandStart >= 0) return commandStart;

      return start;
    }
  }

  if (previous === ")") {
    const start = findMatchingBackward(source, end - 1, "(", ")");
    if (start >= 0) {
      const commandStart = findIdentifierStartBefore(source, start);
      if (commandStart >= 0) return commandStart;
      return start;
    }
  }

  let start = end;
  while (start > 0 && !/\s/.test(source[start - 1])) start -= 1;
  return start;
}

function findIdentifierStartBefore(source: string, groupStart: number): number {
  let index = groupStart - 1;
  if (index < 0 || !isIdentifierPart(source[index])) return -1;

  while (index > 0 && isIdentifierPart(source[index - 1])) index -= 1;
  if (source[index - 1] === "\\") index -= 1;
  return index;
}

function findRightOperandEnd(source: string, start: number): number {
  const current = source[start];

  if (current === "{") {
    const end = findMatching(source, start, "{", "}");
    if (end >= 0) return end + 1;
  }

  if (current === "(") {
    const end = findMatching(source, start, "(", ")");
    if (end >= 0) return end + 1;
  }

  let end = start;
  while (end < source.length && !/\s/.test(source[end])) end += 1;
  return end;
}

function stripOuterGroup(source: string): string {
  let result = source.trim();

  while (result.startsWith("{") && findMatching(result, 0, "{", "}") === result.length - 1) {
    result = result.slice(1, -1).trim();
  }

  return result;
}

function findMatching(source: string, openIndex: number, open: string, close: string): number {
  let depth = 0;

  for (let index = openIndex; index < source.length; index += 1) {
    if (source[index] === open) depth += 1;
    if (source[index] === close) depth -= 1;
    if (depth === 0) return index;
  }

  return -1;
}

function findMatchingBackward(source: string, closeIndex: number, open: string, close: string): number {
  let depth = 0;

  for (let index = closeIndex; index >= 0; index -= 1) {
    if (source[index] === close) depth += 1;
    if (source[index] === open) depth -= 1;
    if (depth === 0) return index;
  }

  return -1;
}

function isIdentifierStart(char: string | undefined): boolean {
  return !!char && /[A-Za-z]/.test(char);
}

function isIdentifierPart(char: string | undefined): boolean {
  return !!char && /[A-Za-z0-9]/.test(char);
}
