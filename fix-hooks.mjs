import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const files = await glob('src/**/*.tsx');

let fixedCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;

  // Find lines with const { t } = useTranslation() and track indentation
  const lines = content.split('\n');
  const hookLines = [];

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('useTranslation()') && lines[i].includes('const {')) {
      const indent = lines[i].match(/^(\s*)/)[1].length;
      hookLines.push({ lineIdx: i, indent, line: lines[i] });
    }
  }

  if (hookLines.length <= 1) continue;

  // Keep only the first occurrence (top-level in component, lowest indent)
  hookLines.sort((a, b) => a.indent - b.indent);
  const topLevel = hookLines[0];
  
  // Remove all hook calls that are NOT the top-level one
  const toRemove = new Set(hookLines.filter(h => h !== topLevel).map(h => h.lineIdx));

  const fixed = lines.filter((_, i) => !toRemove.has(i)).join('\n');

  if (fixed !== original) {
    fs.writeFileSync(file, fixed);
    fixedCount++;
    console.log(`Fixed: ${file} (removed ${toRemove.size} invalid hook call(s))`);
  }
}

console.log(`\nDone. Fixed ${fixedCount} file(s).`);
