# Visual Math InputM

Obsidian plugin for writing and editing math formulas with Korean/HWP-style equation input, LaTeX preview, and exam-paper helpers.

## 한국어

### 소개

Visual Math InputM은 Obsidian에서 수학 수식을 더 쉽게 입력하기 위한 플러그인입니다.

한글 수식 편집기처럼 `sqrt{20}`, `{a+b} over {c+d}`, `x sub i sup 2` 같은 입력어를 쓰면 LaTeX 수식으로 변환합니다. 빈 줄에서는 블록 수식 `$$...$$`, 문장이나 표 안에서는 인라인 수식 `$...$`으로 자동 삽입합니다.

시험문제를 만들 때 필요한 `<보기>` 박스, 2단 시험지 템플릿, 수식 크기 조절, 선택한 수식 재편집 기능도 포함되어 있습니다.

### 주요 기능

- 한글 수식 편집기식 입력어를 LaTeX로 변환
- 빈 줄에서는 블록 수식 `$$...$$` 삽입
- 문장/표 안에서는 인라인 수식 `$...$` 삽입
- 기존 `$...$`, `$$...$$` 수식 선택 후 다시 편집
- 커서를 수식 안에 둔 상태에서 수식 다시 열기
- 수식 크기 선택: 작게, 보통, 크게, 아주 크게
- 수학 예제 107개 제공
- 시험지 템플릿 삽입
- 선택 영역을 `<보기>` 박스로 감싸고 가운데 정렬
- Obsidian Live Preview의 수식 블록 폭을 수식 크기에 맞게 표시

### 설치 방법

#### 방법 1. BRAT으로 설치

1. Obsidian에서 BRAT 플러그인을 설치합니다.
2. BRAT 설정에서 `Add Beta plugin`을 누릅니다.
3. 아래 저장소 주소를 입력합니다.

```text
https://github.com/hyunsdaddy-moon/visual-math-inputm
```

4. 설치 후 `설정 > 커뮤니티 플러그인`에서 `Visual Math InputM`을 활성화합니다.

#### 방법 2. 수동 설치

1. GitHub Releases에서 최신 버전을 내려받습니다.
2. 아래 3개 파일을 복사합니다.

```text
main.js
manifest.json
styles.css
```

3. Obsidian vault 안에 아래 폴더를 만듭니다.

```text
.obsidian/plugins/visual-math-input/
```

4. 위 3개 파일을 그 폴더에 넣습니다.
5. Obsidian을 재시작하거나 플러그인을 새로고침합니다.
6. `설정 > 커뮤니티 플러그인`에서 `Visual Math InputM`을 활성화합니다.

#### 방법 3. Codex 또는 Antigravity로 설치

Codex나 Antigravity가 로컬 파일과 Obsidian vault에 접근할 수 있다면 아래처럼 요청할 수 있습니다.

```text
https://github.com/hyunsdaddy-moon/visual-math-inputm

이 플러그인을 내 Obsidian vault에 설치하고 활성화해줘.
```

Codex/Antigravity는 GitHub 저장소에서 플러그인 파일을 받아 `.obsidian/plugins/visual-math-input/` 폴더에 설치하고, 필요하면 Obsidian에서 플러그인을 활성화합니다.

이 방법은 로컬 파일 접근 권한이 있는 AI 작업 환경에서 사용하는 방법입니다. 일반 사용자는 BRAT 설치나 수동 설치 방법을 사용하면 됩니다.

### 사용 방법

#### 수식 입력

1. `Command + P`를 누릅니다.
2. `Visual Math InputM: 열기 / Open`을 실행합니다.
3. 입력창에 한글 수식 편집기식 수식을 입력합니다.
4. 미리보기를 확인한 뒤 `넣기`를 누릅니다.

예:

```text
x = {-b +- sqrt{b^2-4ac}} over {2a}
```

빈 줄에서 삽입하면:

```markdown
$$x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$$
```

문장이나 표 안에서 삽입하면:

```markdown
$x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$
```

#### 기존 수식 수정

이미 작성된 수식을 선택한 뒤 `Visual Math InputM: 열기 / Open`을 실행하면 같은 팝업에서 수정할 수 있습니다.

```markdown
$\sqrt{20}$
```

위 수식을 선택하고 열면 입력창에는 `\sqrt{20}`이 들어가고, 미리보기에는 루트 수식으로 표시됩니다.

선택하지 않아도 커서를 수식 안에 둔 상태에서 `Visual Math InputM: 열기 / Open`을 실행하면 해당 수식을 찾아서 엽니다.

#### 수식 크기 조절

팝업 오른쪽 위의 `크기`에서 선택합니다.

- 작게: `\small`
- 보통: 기본 크기
- 크게: `\Large`
- 아주 크게: `\Huge`

예:

```markdown
$\Huge x^2 + 2ax + a^2 = \left(x+a\right)^2$
```

#### 시험지 템플릿

새 노트에서 `Visual Math InputM: 시험지 템플릿 삽입 / Insert exam template`을 실행하면 시험지 기본 구조가 들어갑니다.

시험지 스타일은 노트 맨 위의 CSS class로 적용됩니다.

```yaml
---
cssclasses:
  - math-exam
---
```

읽기 화면이나 인쇄 화면에서는 2단 시험지, 상단 제목줄, 파란 구분선, 보기 박스가 표시됩니다.

#### 보기 박스

보기 박스는 Obsidian callout을 사용합니다.

```markdown
> [!exam-view] 보기
> ㄱ. 유리수는 모두 유한소수이다.
> ㄴ. $\sqrt{5}$와 $\sqrt{20}$ 사이의 정수는 2개 있다.
```

선택한 내용을 보기 박스로 감싸려면:

1. 내용을 선택합니다.
2. `Command + P`를 누릅니다.
3. `Visual Math InputM: 박스에 넣기 / Put in box`를 실행합니다.

결과:

```markdown
> [!exam-view] 보기
> <span class="exam-center"></span>
> ① 1개　　　② 2개　　　③ 3개　　　④ 4개　　　⑤ 5개
```

`exam-center` 표시는 화면에 보이지 않고, 박스 안 내용을 가운데 정렬하기 위해 사용됩니다.

### 지원 입력 예시

```text
A over B
sqrt{A}
root{n} of {A}
x sub i
x sup 2
sum from {k=1} to n k^2
int from 0 to 1 x^2 dx
lim from {x -> 0} {sin x} over x
matrix{a&b#c&d}
cases{a&b#c&d}
```

### 개발

```bash
npm install
npm run build
```

개발 중에는 빌드 결과인 `main.js`, `manifest.json`, `styles.css`를 테스트 vault의 `.obsidian/plugins/visual-math-input/`에 복사해서 확인합니다.

## English

### Overview

Visual Math InputM is an Obsidian plugin for writing math formulas with a Korean/HWP-style equation input workflow.

It converts expressions such as `sqrt{20}`, `{a+b} over {c+d}`, and `x sub i sup 2` into LaTeX. It inserts block math `$$...$$` on empty lines and inline math `$...$` inside sentences or tables.

It also includes helpers for creating math exam papers: exam templates, view boxes, centered answer boxes, formula resizing, and formula re-editing.

### Features

- Convert Korean/HWP-style equation syntax to LaTeX
- Insert block math `$$...$$` on empty lines
- Insert inline math `$...$` inside sentences and tables
- Reopen and edit existing `$...$` or `$$...$$` formulas
- Reopen a formula by placing the cursor inside it
- Select formula size: small, normal, large, extra large
- 107 built-in math examples
- Insert a math exam template
- Wrap selected content in a centered `<View>` box
- Fit rendered math block width to the formula size in Live Preview

### Installation

#### Option 1. Install with BRAT

1. Install the BRAT plugin in Obsidian.
2. Open BRAT settings and choose `Add Beta plugin`.
3. Enter this repository URL:

```text
https://github.com/hyunsdaddy-moon/visual-math-inputm
```

4. Enable `Visual Math InputM` in `Settings > Community plugins`.

#### Option 2. Manual installation

1. Download the latest release from GitHub Releases.
2. Copy these files:

```text
main.js
manifest.json
styles.css
```

3. Create this folder inside your Obsidian vault:

```text
.obsidian/plugins/visual-math-input/
```

4. Place the 3 files in that folder.
5. Restart Obsidian or reload plugins.
6. Enable `Visual Math InputM` in `Settings > Community plugins`.

#### Option 3. Install with Codex or Antigravity

If Codex or Antigravity can access your local files and Obsidian vault, you can ask it to install the plugin for you.

```text
https://github.com/hyunsdaddy-moon/visual-math-inputm

Install this plugin in my Obsidian vault and enable it.
```

Codex/Antigravity can download the plugin files from GitHub, place them in `.obsidian/plugins/visual-math-input/`, and enable the plugin in Obsidian when possible.

This method is for AI coding environments with local filesystem access. Regular users should use BRAT or manual installation.

### Usage

#### Insert a formula

1. Press `Command + P`.
2. Run `Visual Math InputM: 열기 / Open`.
3. Type an equation in the input box.
4. Check the preview and click `Insert`.

Example:

```text
x = {-b +- sqrt{b^2-4ac}} over {2a}
```

Inserted on an empty line:

```markdown
$$x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$$
```

Inserted inside a sentence or table:

```markdown
$x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$
```

#### Edit an existing formula

Select an existing formula and run `Visual Math InputM: 열기 / Open`.

```markdown
$\sqrt{20}$
```

The editor opens with `\sqrt{20}` in the input box and renders it as a square-root formula in the preview.

You can also place the cursor inside a formula and run the same command.

#### Change formula size

Use the `Size` dropdown in the popup.

- Small: `\small`
- Normal: default
- Large: `\Large`
- Extra large: `\Huge`

Example:

```markdown
$\Huge x^2 + 2ax + a^2 = \left(x+a\right)^2$
```

#### Exam template

Run `Visual Math InputM: 시험지 템플릿 삽입 / Insert exam template` in a new note.

The exam layout uses this CSS class:

```yaml
---
cssclasses:
  - math-exam
---
```

In Reading View or print/PDF output, the note is styled as a two-column exam paper with a header, divider lines, and view boxes.

#### View boxes

Use an Obsidian callout:

```markdown
> [!exam-view] View
> A. Every rational number is a finite decimal.
> B. There are two integers between $\sqrt{5}$ and $\sqrt{20}$.
```

To wrap selected text in a centered view box:

1. Select the content.
2. Press `Command + P`.
3. Run `Visual Math InputM: 박스에 넣기 / Put in box`.

Result:

```markdown
> [!exam-view] View
> <span class="exam-center"></span>
> ① 1　　　② 2　　　③ 3　　　④ 4　　　⑤ 5
```

The `exam-center` marker is hidden visually and only controls centering.

### Supported input examples

```text
A over B
sqrt{A}
root{n} of {A}
x sub i
x sup 2
sum from {k=1} to n k^2
int from 0 to 1 x^2 dx
lim from {x -> 0} {sin x} over x
matrix{a&b#c&d}
cases{a&b#c&d}
```

### Development

```bash
npm install
npm run build
```

During development, copy `main.js`, `manifest.json`, and `styles.css` to `.obsidian/plugins/visual-math-input/` in a test vault.

## Credits

- [MathLive](https://github.com/arnog/mathlive)
- [Obsidian sample plugin](https://github.com/obsidianmd/obsidian-sample-plugin)
- [obsidian-mathlive](https://github.com/danzilberdan/obsidian-mathlive)
- [obsidian-latex-suite](https://github.com/artisticat1/obsidian-latex-suite)

## License

MIT
