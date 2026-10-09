// Build the static site and publish it to the gh-pages branch, which GitHub Pages
// serves directly. Works without GitHub Actions. Usage: npm run deploy
import { execSync } from "node:child_process";
import { cpSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";

const run = (cmd, opts = {}) => execSync(cmd, { stdio: "inherit", ...opts });
const origin = execSync("git remote get-url origin").toString().trim();
const repo = basename(origin).replace(/\.git$/, "");

console.log(`Building for https://<user>.github.io/${repo}/ …`);
run("npx next build", { env: { ...process.env, PAGES_BASE_PATH: `/${repo}` } });

const dir = mkdtempSync(join(tmpdir(), "gh-pages-"));
try {
  cpSync("out", dir, { recursive: true });
  writeFileSync(join(dir, ".nojekyll"), ""); // serve _next/ as-is, no Jekyll
  run("git init -q -b gh-pages", { cwd: dir });
  run("git add -A", { cwd: dir });
  run(`git commit -q -m "Deploy ${new Date().toISOString()}"`, { cwd: dir });
  run(`git push -f "${origin}" gh-pages`, { cwd: dir });
  console.log("Published to gh-pages.");
} finally {
  rmSync(dir, { recursive: true, force: true });
}
