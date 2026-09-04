import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, 'screenshots');

const BASE = 'http://localhost:5173';

const pages = [
  { path: '/', name: 'home' },
  { path: '/shop', name: 'shop' },
  { path: '/product/1', name: 'product-detail' },
  { path: '/cart', name: 'cart' },
  { path: '/about', name: 'about' },
  { path: '/blog', name: 'blog' },
  { path: '/contact', name: 'contact' },
  { path: '/login', name: 'login' },
  { path: '/signup', name: 'signup' },
];

const viewport = [
  { width: 1440, height: 900, label: 'desktop' },
  { width: 390, height: 844, label: 'mobile' },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const fs = await import('fs');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  for (const vp of viewport) {
    const context = await browser.newContext({ viewport: vp });
    const page = await context.newPage({ deviceScaleFactor: 2 });

    for (const { path: route, name } of pages) {
      const url = BASE + route;
      console.log(`  Capturing ${vp.label} ${name}...`);
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
        await page.waitForTimeout(1500);
        const filename = `${name}-${vp.label}.png`;
        await page.screenshot({
          path: path.join(outDir, filename),
          fullPage: false,
          animations: 'disabled',
        });
        console.log(`    Saved: screenshots/${filename}`);
      } catch (e) {
        console.error(`    Failed: ${e.message}`);
      }
    }
    await context.close();
  }

  await browser.close();
  console.log('\nAll screenshots captured.');
})();
