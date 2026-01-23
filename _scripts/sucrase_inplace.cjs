const fs = require("fs");
const path = require("path");
const sucrase = require("sucrase");

function walk(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "node_modules" || ent.name === "dist" || ent.name === "build") continue;
      out.push(...walk(p));
    } else {
      out.push(p);
    }
  }
  return out;
}

function isJsLike(p) {
  return p.endsWith(".js") || p.endsWith(".jsx") || p.endsWith(".mjs") || p.endsWith(".cjs");
}

const root = process.argv[2];
if (!root) {
  console.error("Usage: node sucrase_inplace.cjs <dir>");
  process.exit(2);
}

const files = walk(root).filter(isJsLike);
let changed = 0;

for (const file of files) {
  const input = fs.readFileSync(file, "utf8");

  // Quick skip: if no obvious TS tokens, avoid rewriting
  const maybeTs =
    /\binterface\b/.test(input) ||
    /\btype\s+[A-Za-z_$]/.test(input) ||
    /\bimport\s+type\b/.test(input) ||
    /\bas\s+[A-Za-z_$]/.test(input) ||
    /:\s*[A-Za-z_$][\w$<>]*/.test(input);

  if (!maybeTs) continue;

  let out;
  try {
    out = sucrase.transform(input, { transforms: ["typescript", "jsx"] }).code;
  } catch (e) {
    console.error("Sucrase failed:", file);
    console.error(String(e && e.stack ? e.stack : e));
    process.exit(1);
  }

  if (out !== input) {
    fs.writeFileSync(file, out, "utf8");
    changed++;
  }
}

console.log("Sucrase transformed files:", changed);
