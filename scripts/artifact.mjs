// Turns the single-file build into a bare page fragment: title, style, root, script.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const html = readFileSync('dist-single/index.html', 'utf8');
const styles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n');
const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]).join('\n');
if (!styles || !scripts) throw new Error('single-file build is missing its style or script');

const out = `<title>Vignelli Canon Workbook</title>
<style>${styles}</style>
<div id="root"></div>
<script type="module">${scripts}</script>
`;
mkdirSync('dist-single', { recursive: true });
writeFileSync('dist-single/canon-workbook.html', out);
console.log(`canon-workbook.html ${(out.length / 1024).toFixed(0)} kB`);
