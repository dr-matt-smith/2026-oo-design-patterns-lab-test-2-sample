// Makes the pages that `deno doc --html` writes into docs/ link together when they are opened as plain files
// (for example in Celbridge's HTML preview), not only when a web server serves them.
//
// deno doc links "up" to a folder, e.g. href="../../" for the home page. A web server answers that with the
// folder's index.html, but a file preview cannot - so every such link is rewritten to name the page itself:
// href="../../index.html". Pages still work on a web server too.
//
// "deno task doc" runs this straight after deno doc. You never need to edit this file.

/** Adds "index.html" to an href that points at a folder ("../../", "./", "./Car.ts/#top"), else returns it as is. */
export function fixHref(href: string): string {
  if (/^[a-z]+:/i.test(href)) return href; // http:, https:, file:, mailto: ...
  const decoded = href.replaceAll("&#x2F;", "/");
  const [path, hash] = decoded.split(/#(.*)/s);
  if (path === "" || !(path.endsWith("/") || path === "." || path === "..")) return href;
  const fixed = `${path.endsWith("/") ? path : path + "/"}index.html${hash !== undefined ? "#" + hash : ""}`;
  return href.includes("&#x2F;") ? fixed.replaceAll("/", "&#x2F;") : fixed; // keep deno doc's own escaping
}

/** Fixes every href in one page; returns how many were changed. */
async function fixPage(file: string): Promise<number> {
  const html = await Deno.readTextFile(file);
  let changed = 0;
  const fixed = html.replace(/href="([^"]*)"/g, (whole: string, href: string): string => {
    const after = fixHref(href);
    if (after === href) return whole;
    changed++;
    return `href="${after}"`;
  });
  if (changed > 0) await Deno.writeTextFile(file, fixed);
  return changed;
}

/** All the .html files under a folder. */
async function htmlFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  for await (const entry of Deno.readDir(dir)) {
    const path = `${dir}/${entry.name}`;
    if (entry.isDirectory) files.push(...await htmlFiles(path));
    else if (entry.name.endsWith(".html")) files.push(path);
  }
  return files;
}

if (import.meta.main) {
  const docs = decodeURIComponent(new URL("../docs", import.meta.url).pathname);
  const files = await htmlFiles(docs);
  let links = 0;
  for (const file of files) links += await fixPage(file);
  console.log(`Fixed ${links} folder links in ${files.length} pages, so docs/ works as plain files too.`);
}
