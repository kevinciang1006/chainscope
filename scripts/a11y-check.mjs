// Runs axe-core against the local preview build and prints violations by impact.
// Usage: npm run build && npx vite preview --port 4173, then node scripts/a11y-check.mjs
import { AxeBuilder } from '@axe-core/playwright';
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL ?? 'http://localhost:4173';
const PAGES = [
  { name: 'dashboard', path: '/' },
  { name: 'suppliers list', path: '/suppliers' },
  { name: 'supplier detail', path: '/suppliers/sup-001' },
];
const IMPACTS = ['critical', 'serious', 'moderate', 'minor'];

const browser = await chromium.launch();
let total = 0;

for (const { name, path } of PAGES) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const { violations } = await new AxeBuilder({ page }).analyze();
  total += violations.length;

  console.log(`\n${name} (${path}): ${violations.length} violation(s)`);
  for (const impact of IMPACTS) {
    const group = violations.filter((v) => v.impact === impact);
    if (!group.length) continue;
    console.log(`  ${impact}: ${group.length}`);
    for (const v of group) {
      console.log(`    - ${v.id}: ${v.help} (${v.nodes.length} node(s))`);
      for (const n of v.nodes.slice(0, 3)) console.log(`        ${n.target.join(' ')}`);
    }
  }
  await context.close();
}

await browser.close();
process.exit(total ? 1 : 0);
