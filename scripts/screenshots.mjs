// Captures README screenshots from the local preview build at 1440x900, light mode.
// Usage: npm run build && npx vite preview --port 4173, then node scripts/screenshots.mjs
import { mkdirSync, statSync } from 'node:fs';
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL ?? 'http://localhost:4173';
const SHOTS = [
  { file: 'dashboard.png', path: '/' },
  { file: 'suppliers-filtered.png', path: '/suppliers?reg=Southeast%20Asia&risk=High,Critical' },
  { file: 'supplier-detail.png', path: '/suppliers/sup-001' },
];

mkdirSync('docs/screenshots', { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  colorScheme: 'light',
});

for (const { file, path } of SHOTS) {
  const page = await context.newPage();
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const out = `docs/screenshots/${file}`;
  await page.screenshot({ path: out });
  const size = statSync(out).size;
  if (size === 0) throw new Error(`${out} is empty`);
  console.log(`${out}: ${size} bytes`);
  await page.close();
}

await browser.close();
