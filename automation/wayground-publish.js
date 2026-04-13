const fs = require('fs');
const path = require('path');
const { connectAndFindPage, ensureOutputDir } = require('./lib/browser');

async function main() {
  const { browser, page } = await connectAndFindPage(/wayground\.com\/admin\/quiz\//);
  await page.bringToFront();
  await page.waitForLoadState('domcontentloaded');

  const publishButton = page.locator('[data-testid="publish-quiz-button"]').first();
  await publishButton.waitFor({ state: 'visible', timeout: 15000 });
  await publishButton.evaluate(el => el.click());

  await page.waitForFunction(() => !location.pathname.endsWith('/edit'), null, { timeout: 30000 });
  await page.waitForTimeout(1500);

  const result = {
    url: page.url(),
    title: await page.title(),
    bodyPreview: (await page.locator('body').innerText()).slice(0, 400)
  };

  const outDir = ensureOutputDir();
  fs.writeFileSync(path.join(outDir, 'wayground-publish.json'), JSON.stringify(result, null, 2), 'utf8');
  await page.screenshot({ path: path.join(outDir, 'wayground-publish.png'), fullPage: true });
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
