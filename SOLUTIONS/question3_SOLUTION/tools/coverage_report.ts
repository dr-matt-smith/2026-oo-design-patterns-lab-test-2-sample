// Runs the tests while recording which lines of src/ they run, and writes an easy-to-read coverage report:
//
//   test_coverage_output/index.html   the report as a web page (open it in Celbridge, or any browser)
//   test_coverage_output/lcov.info    the same data in lcov format, for other tools
//   test_coverage_output/raw/         Deno's raw coverage data (and Deno's own HTML report, in raw/html/)
//
// On its own:  deno task coverage
//
// This is step (7) in README_TypeScript_correctness.md: it fails (exit code 1) unless the tests pass AND they run
// 100% of the lines, functions and branches in src/. Anything not covered is listed in the console.
//
// You never need to edit this file. (Written to match tools/test_report.ts.)

export interface FileCoverage {
  file: string; // relative to the project, e.g. src/Car.ts
  lines: Map<number, number>; // line number -> how many times it ran (only lines that contain code)
  branches: Map<number, { hit: number; total: number }>; // line number -> branches taken / branches there
  linesFound: number;
  linesHit: number;
  functionsFound: number;
  functionsHit: number;
  branchesFound: number;
  branchesHit: number;
}

// ---------------------------------------------------------------------------------------------
// Running the tools
// ---------------------------------------------------------------------------------------------

async function denoOutput(
  root: URL,
  args: string[],
  env: Record<string, string> = {},
): Promise<{ ok: boolean; out: string; err: string }> {
  const result = await new Deno.Command(Deno.execPath(), {
    args,
    cwd: root,
    stdout: "piped",
    stderr: "piped",
    env: { NO_COLOR: "1", ...env },
  }).output();
  const decoder = new TextDecoder();
  return { ok: result.success, out: decoder.decode(result.stdout), err: decoder.decode(result.stderr) };
}

// ---------------------------------------------------------------------------------------------
// Reading lcov
// ---------------------------------------------------------------------------------------------

/** Turns lcov text into one FileCoverage per file in src/. */
export function parseLcov(root: URL, lcov: string): FileCoverage[] {
  const rootPath = decodeURIComponent(root.pathname);
  const files: FileCoverage[] = [];
  let current: FileCoverage | undefined;

  for (const line of lcov.split("\n")) {
    const [key, value = ""] = line.split(/:(.*)/s);
    if (key === "SF") {
      current = {
        file: value.replace(rootPath, ""),
        lines: new Map(),
        branches: new Map(),
        linesFound: 0,
        linesHit: 0,
        functionsFound: 0,
        functionsHit: 0,
        branchesFound: 0,
        branchesHit: 0,
      };
    } else if (!current) {
      continue;
    } else if (key === "DA") {
      const [n, count] = value.split(",").map(Number);
      current.lines.set(n, count);
    } else if (key === "BRDA") {
      const [n, , , taken] = value.split(",");
      const b = current.branches.get(Number(n)) ?? { hit: 0, total: 0 };
      b.total++;
      if (taken !== "-" && Number(taken) > 0) b.hit++;
      current.branches.set(Number(n), b);
    } else if (key === "LF") current.linesFound = Number(value);
    else if (key === "LH") current.linesHit = Number(value);
    else if (key === "FNF") current.functionsFound = Number(value);
    else if (key === "FNH") current.functionsHit = Number(value);
    else if (key === "BRF") current.branchesFound = Number(value);
    else if (key === "BRH") current.branchesHit = Number(value);
    else if (key === "end_of_record") {
      if (current.file.startsWith("src/")) files.push(current);
      current = undefined;
    }
  }
  return files.sort((a, b) => a.file.localeCompare(b.file));
}

// ---------------------------------------------------------------------------------------------
// Writing the report
// ---------------------------------------------------------------------------------------------

/** A percentage, or 100 when there is nothing to cover (e.g. a file with no branches). */
function percent(hit: number, found: number): number {
  return found === 0 ? 100 : (hit / found) * 100;
}

function grade(p: number): "good" | "warn" | "bad" {
  return p >= 90 ? "good" : p >= 60 ? "warn" : "bad";
}

function escapeHtml(s: string): string {
  return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function totals(files: FileCoverage[]): { lines: number; functions: number; branches: number } {
  const sum = (f: (c: FileCoverage) => number): number => files.reduce((n, c) => n + f(c), 0);
  return {
    lines: percent(sum((c) => c.linesHit), sum((c) => c.linesFound)),
    functions: percent(sum((c) => c.functionsHit), sum((c) => c.functionsFound)),
    branches: percent(sum((c) => c.branchesHit), sum((c) => c.branchesFound)),
  };
}

function bar(p: number, detail: string): string {
  return `<td class="pc"><div class="bar"><div class="fill ${grade(p)}" style="width:${p.toFixed(1)}%"></div></div>` +
    `<span class="num ${grade(p)}">${p.toFixed(1)}%</span><span class="detail">${detail}</span></td>`;
}

/** The source of one file, each line coloured by whether the tests ran it. */
function sourceView(c: FileCoverage, source: string): string {
  const rows = source.replace(/\n$/, "").split("\n").map((text, i) => {
    const n = i + 1;
    const count = c.lines.get(n);
    const branch = c.branches.get(n);
    const kind = count === undefined ? "" : count === 0 ? "miss" : branch && branch.hit < branch.total ? "part" : "hit";
    const title = count === undefined
      ? ""
      : count === 0
      ? "never run by the tests"
      : `run ${count} time${count === 1 ? "" : "s"}` +
        (branch ? `, ${branch.hit} of ${branch.total} branches taken` : "");
    return `<tr class="${kind}"${title ? ` title="${title}"` : ""}><td class="ln">${n}</td>` +
      `<td class="count">${count === undefined ? "" : count === 0 ? "✗" : `${count}×`}</td>` +
      `<td class="src">${escapeHtml(text) || " "}</td></tr>`;
  }).join("");
  return `<table class="source">${rows}</table>`;
}

export function toHtml(project: string, when: string, files: FileCoverage[], sources: Map<string, string>): string {
  const t = totals(files);
  const overall = Math.min(t.lines, t.functions, t.branches);
  const state = files.length === 0 ? "none" : overall >= 90 ? "good" : overall >= 60 ? "warn" : "bad";
  const headline = files.length === 0 ? "No coverage data" : `${t.lines.toFixed(1)}% of lines covered`;
  const tile = (p: number, label: string): string =>
    `<div class="tile"><b class="${grade(p)}">${p.toFixed(1)}%</b><span>${label}</span></div>`;

  const table = files.map((c) => {
    const lp = percent(c.linesHit, c.linesFound);
    const fp = percent(c.functionsHit, c.functionsFound);
    const bp = percent(c.branchesHit, c.branchesFound);
    return `<tr><td class="file"><a href="#${encodeURIComponent(c.file)}">${escapeHtml(c.file)}</a></td>` +
      bar(lp, `${c.linesHit}/${c.linesFound}`) + bar(fp, `${c.functionsHit}/${c.functionsFound}`) +
      bar(bp, `${c.branchesHit}/${c.branchesFound}`) + "</tr>";
  }).join("");

  const details = files.map((c) => {
    const missed = c.linesFound - c.linesHit;
    return `<details id="${encodeURIComponent(c.file)}"${missed > 0 ? " open" : ""}>
      <summary><code>${escapeHtml(c.file)}</code>
        <span class="num ${grade(percent(c.linesHit, c.linesFound))}">${
      percent(c.linesHit, c.linesFound).toFixed(1)
    }%</span>
        <span class="detail">${missed === 0 ? "every line run" : `${missed} line${missed === 1 ? "" : "s"} never run`}</span>
      </summary>
      ${sourceView(c, sources.get(c.file) ?? "")}
    </details>`;
  }).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Coverage report - ${escapeHtml(project)}</title>
<style>
  :root { --bg:#f6f7f9; --card:#fff; --text:#1b1f2a; --muted:#5b6472; --line:#dde1e7;
          --good:#2a9d8f; --bad:#e63946; --warn:#f4a261; --none:#457b9d; --pre:#f1f3f6;
          --hit-bg:#e3f4f1; --miss-bg:#fde4e6; --part-bg:#fdf0e3; }
  @media (prefers-color-scheme: dark) {
    :root { --bg:#16191f; --card:#1f232b; --text:#e8eaed; --muted:#9aa3ad; --line:#333a45; --pre:#14171c;
            --hit-bg:#1b3330; --miss-bg:#3d1f24; --part-bg:#3a2d1f; }
  }
  * { box-sizing: border-box; }
  body { margin:0; background:var(--bg); color:var(--text); font:15px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; }
  main { max-width: 900px; margin: 0 auto; padding: 16px; }
  header.banner { border-radius: 10px; padding: 16px 20px; color: #fff; margin-bottom: 16px; }
  header.good { background: var(--good); } header.bad { background: var(--bad); }
  header.warn { background: var(--warn); } header.none { background: var(--none); }
  header h1 { margin: 0; font-size: 24px; } header p { margin: 4px 0 0; opacity: .9; }
  .tiles { display:grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 8px; margin-bottom: 16px; }
  .tile { background:var(--card); border:1px solid var(--line); border-radius:8px; padding:10px; text-align:center; }
  .tile b { display:block; font-size: 26px; } .tile span { color: var(--muted); font-size: 13px; }
  .good { color: var(--good); } .bad { color: var(--bad); } .warn { color: var(--warn); }
  section { background:var(--card); border:1px solid var(--line); border-radius:10px; padding: 4px 16px 12px; margin-bottom: 16px; }
  h2 { font-size: 18px; }
  code, .source { font-family: ui-monospace, Menlo, Consolas, monospace; font-size: 13px; }
  .scroll { overflow-x: auto; }
  table.files { width: 100%; border-collapse: collapse; }
  table.files th { text-align: left; color: var(--muted); font-weight: normal; font-size: 13px; padding: 4px 8px; }
  table.files td { padding: 6px 8px; border-top: 1px solid var(--line); white-space: nowrap; }
  td.file a { color: var(--text); font-family: ui-monospace, Menlo, monospace; font-size: 13px; }
  .bar { display:inline-block; width: 70px; height: 8px; background: var(--line); border-radius: 4px;
         vertical-align: middle; margin-right: 8px; overflow: hidden; }
  .fill { height: 100%; } .fill.good { background: var(--good); } .fill.warn { background: var(--warn); }
  .fill.bad { background: var(--bad); }
  .num { font-weight: bold; margin-right: 6px; } .detail { color: var(--muted); font-size: 13px; }
  details { border-top: 1px solid var(--line); padding: 8px 0; }
  details:first-of-type { border-top: none; }
  summary { cursor: pointer; } summary code { margin-right: 10px; }
  table.source { border-collapse: collapse; width: 100%; margin-top: 8px; background: var(--pre);
                 border: 1px solid var(--line); border-radius: 6px; }
  table.source td { padding: 0 8px; white-space: pre; vertical-align: top; }
  td.ln { color: var(--muted); text-align: right; user-select: none; width: 1%; }
  td.count { color: var(--muted); text-align: right; user-select: none; width: 1%; font-size: 12px; }
  tr.hit td.src { background: var(--hit-bg); } tr.miss td.src { background: var(--miss-bg); }
  tr.part td.src { background: var(--part-bg); }
  tr.miss td.count { color: var(--bad); font-weight: bold; }
  .key { color: var(--muted); font-size: 13px; }
  .key span { display:inline-block; padding: 0 6px; border-radius: 4px; margin-right: 6px; }
  footer { color: var(--muted); font-size: 13px; text-align: center; }
  footer a { color: var(--muted); }
</style>
</head>
<body>
<main>
  <header class="banner ${state}">
    <h1>${escapeHtml(headline)}</h1>
    <p>${escapeHtml(project)} &middot; ${escapeHtml(when)}</p>
  </header>
  <div class="tiles">
    ${tile(t.lines, "lines")}
    ${tile(t.functions, "functions")}
    ${tile(t.branches, "branches")}
  </div>
  <section>
    <h2>Files in src/</h2>
    ${
    files.length
      ? `<div class="scroll"><table class="files"><tr><th>File</th><th>Lines</th><th>Functions</th><th>Branches</th></tr>${table}</table></div>`
      : "<p><em>No coverage data - did the tests run?</em></p>"
  }
  </section>
  <section>
    <h2>Source</h2>
    <p class="key"><span style="background:var(--hit-bg)">run by the tests</span><span style="background:var(--miss-bg)">never run</span><span style="background:var(--part-bg)">some branches never taken</span>
      Hover over a line to see how many times it ran.</p>
    <div class="scroll">${details}</div>
  </section>
  <footer>Made by tools/coverage_report.ts &middot; <a href="raw/html/index.html">Deno's own coverage report</a> &middot; lcov data: lcov.info</footer>
</main>
</body>
</html>
`;
}

/** Line numbers as short ranges: [3, 4, 5, 9] -> "3-5, 9". */
function ranges(lines: number[]): string {
  const parts: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const start = lines[i];
    while (i + 1 < lines.length && lines[i + 1] === lines[i] + 1) i++;
    parts.push(start === lines[i] ? `${start}` : `${start}-${lines[i]}`);
  }
  return parts.join(", ");
}

/** One line per file that is not fully covered, e.g. "src/Car.ts: never run - lines 21-23". */
export function describeMissed(files: FileCoverage[]): string[] {
  return files.flatMap((c) => {
    const neverRun = [...c.lines].filter(([, count]) => count === 0).map(([n]) => n).sort((a, b) => a - b);
    const partBranches = [...c.branches].filter(([, b]) => b.hit < b.total).map(([n]) => n).sort((a, b) => a - b);
    const missedFunctions = c.functionsFound - c.functionsHit;
    const what: string[] = [];
    if (neverRun.length > 0) what.push(`never run - line${neverRun.length === 1 ? "" : "s"} ${ranges(neverRun)}`);
    if (partBranches.length > 0) {
      what.push(`some branches never taken - line${partBranches.length === 1 ? "" : "s"} ${ranges(partBranches)}`);
    }
    if (missedFunctions > 0 && neverRun.length === 0) {
      what.push(`${missedFunctions} function${missedFunctions === 1 ? "" : "s"} never called`);
    }
    return what.length > 0 ? [`  ${c.file}: ${what.join("; ")}`] : [];
  });
}

// ---------------------------------------------------------------------------------------------
// The whole thing
// ---------------------------------------------------------------------------------------------

/** Runs the tests with coverage on, prints a summary, and writes test_coverage_output/. */
export async function runCoverage(
  root: URL,
): Promise<{ testsPassed: boolean; complete: boolean; files: FileCoverage[] }> {
  const outDir = new URL("./test_coverage_output/", root);
  const rawDir = new URL("./raw/", outDir);
  await Deno.remove(rawDir, { recursive: true }).catch(() => {}); // old data would be added to the new
  await Deno.mkdir(rawDir, { recursive: true });
  const rawPath = decodeURIComponent(rawDir.pathname);

  // DENO_COVERAGE_DIR: programs the tests start themselves (e.g. deno run src/main.ts) record coverage too.
  const test = await denoOutput(
    root,
    ["test", "--no-check", "--allow-run=deno", `--coverage=${rawPath}`, "tests/"],
    { DENO_COVERAGE_DIR: rawPath },
  );
  const lcovPath = decodeURIComponent(new URL("lcov.info", outDir).pathname);
  await denoOutput(root, ["coverage", rawPath, "--lcov", `--output=${lcovPath}`]);

  const lcov = await Deno.readTextFile(lcovPath).catch(() => "");
  const files = parseLcov(root, lcov);
  const sources = new Map<string, string>();
  for (const c of files) sources.set(c.file, await Deno.readTextFile(new URL(c.file, root)).catch(() => ""));

  const project = decodeURIComponent(root.pathname).split("/").filter(Boolean).pop() ?? "project";
  await Deno.writeTextFile(
    new URL("index.html", outDir),
    toHtml(project, new Date().toLocaleString(), files, sources),
  );

  // The console: Deno's own table, then one line that says how things stand.
  const table = await denoOutput(root, ["coverage", rawPath]);
  console.log("\n" + table.out.trim());
  const t = totals(files);
  const testNote = test.ok ? "" : "  (some tests failed - run deno task test to see why)";
  console.log(
    `\nCoverage: ${t.lines.toFixed(1)}% lines, ${t.functions.toFixed(1)}% functions, ` +
      `${t.branches.toFixed(1)}% branches  ->  test_coverage_output/index.html${testNote}`,
  );

  // Step (7): everything in src/ must be run by the tests.
  const complete = files.length > 0 && t.lines === 100 && t.functions === 100 && t.branches === 100;
  const missed = describeMissed(files);
  if (missed.length > 0) console.log("\nNot covered by the tests:\n" + missed.join("\n"));
  if (complete && test.ok) console.log("\nStep 7 passed: the tests run 100% of src/.");
  else if (!test.ok) console.log("\nStep 7 failed: some tests failed (run deno task test first).");
  else {
    console.log(
      "\nStep 7 failed: coverage must be 100% - the tests never run the code above." +
        "\nRemove it if the UML diagram does not ask for it.",
    );
  }
  return { testsPassed: test.ok, complete, files };
}

// "deno task coverage" runs this file on its own.
if (import.meta.main) {
  const { testsPassed, complete } = await runCoverage(new URL("../", import.meta.url));
  Deno.exit(testsPassed && complete ? 0 : 1);
}
