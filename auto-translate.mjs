import { Project, SyntaxKind, Node } from 'ts-morph';
import slugify from 'slugify';
import fs from 'fs';
import path from 'path';

const project = new Project();
project.addSourceFilesAtPaths(['src/pages/**/*.tsx', 'src/components/**/*.tsx']);

let translations = {};
try {
  translations = JSON.parse(fs.readFileSync('src/locales/fr.json', 'utf8'));
} catch(e) {}

if (!translations.auto) {
  translations.auto = {};
}

function generateKey(text) {
  const t = text.trim();
  let key = slugify(t, { lower: true, strict: true }).substring(0, 30);
  if (!key) key = 'txt_' + Math.random().toString(36).substring(7);
  // Remove trailing dash
  key = key.replace(/-+$/, '');
  return key;
}

const SKIP_TAGS = ['script', 'style'];

for (const sourceFile of project.getSourceFiles()) {
  let fileModified = false;
  const functionsToModify = new Set();

  sourceFile.forEachDescendant(node => {
    if (Node.isJsxText(node)) {
      const text = node.getLiteralText();
      if (text.trim() && /[a-zA-ZÀ-ÿ]/.test(text) && !text.includes('©') && !text.includes('{')) {
        const parent = node.getParent();
        if (Node.isJsxElement(parent)) {
          const tagName = parent.getOpeningElement().getTagNameNode().getText();
          if (SKIP_TAGS.includes(tagName)) return;
        }

        const trimmed = text.trim();
        const key = generateKey(trimmed);
        translations.auto[key] = trimmed;
        
        // Preserve surrounding whitespace
        const leadingWhitespace = text.match(/^\s*/)[0];
        const trailingWhitespace = text.match(/\s*$/)[0];
        
        // find enclosing function or arrow function before replacing
        const func = node.getFirstAncestor(n => Node.isFunctionDeclaration(n) || Node.isArrowFunction(n) || Node.isFunctionExpression(n));
        if (func) functionsToModify.add(func);
        
        node.replaceWithText(`${leadingWhitespace}{t('auto.${key}')}${trailingWhitespace}`);
        fileModified = true;
      }
    } else if (Node.isJsxAttribute(node)) {
      const name = node.getNameNode().getText();
      if (['placeholder', 'title', 'aria-label', 'label'].includes(name)) {
        const init = node.getInitializer();
        if (Node.isStringLiteral(init)) {
          const text = init.getLiteralValue();
          if (text.trim() && /[a-zA-ZÀ-ÿ]/.test(text)) {
            const trimmed = text.trim();
            const key = generateKey(trimmed);
            translations.auto[key] = trimmed;
            
            const func = node.getFirstAncestor(n => Node.isFunctionDeclaration(n) || Node.isArrowFunction(n) || Node.isFunctionExpression(n));
            if (func) functionsToModify.add(func);
            
            node.setInitializer(`{t('auto.${key}')}`);
            fileModified = true;
          }
        }
      }
    }
  });

  if (fileModified) {
    // Inject import
    const imports = sourceFile.getImportDeclarations();
    const hasI18n = imports.some(i => i.getModuleSpecifierValue() === 'react-i18next');
    if (!hasI18n) {
      sourceFile.addImportDeclaration({
        namedImports: ['useTranslation'],
        moduleSpecifier: 'react-i18next'
      });
    }

    // Inject hook
    for (const func of functionsToModify) {
      if (Node.isFunctionDeclaration(func) || Node.isFunctionExpression(func) || Node.isArrowFunction(func)) {
        const body = func.getBody();
        if (Node.isBlock(body)) {
          const statements = body.getStatements();
          const hasHook = statements.some(s => s.getText().includes('useTranslation()'));
          if (!hasHook) {
            body.insertStatements(0, 'const { t } = useTranslation();');
          }
        }
      }
    }
  }
}

project.saveSync();
fs.writeFileSync('src/locales/fr.json', JSON.stringify(translations, null, 2));

// For en and ar, we just merge keys
['en.json', 'ar.json'].forEach(file => {
  const p = path.join('src/locales', file);
  let tr = {};
  try { tr = JSON.parse(fs.readFileSync(p, 'utf8')); } catch(e) {}
  if (!tr.auto) tr.auto = {};
  for (const k in translations.auto) {
    if (!tr.auto[k]) tr.auto[k] = translations.auto[k] + (file.includes('en') ? ' (EN)' : ' (AR)');
  }
  fs.writeFileSync(p, JSON.stringify(tr, null, 2));
});

console.log('Translations extracted and applied!');
