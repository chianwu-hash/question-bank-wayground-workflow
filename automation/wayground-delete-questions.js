const fs = require('fs');
const path = require('path');
const { connectAndFindPage, ensureOutputDir } = require('./lib/browser');

function parseQuestionNumbers(argv) {
  const raw = argv.join(',');
  const nums = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => Number(s))
    .filter((n) => Number.isInteger(n) && n > 0);

  return [...new Set(nums)].sort((a, b) => b - a);
}

async function clickQuestionTrash(page, questionNumber) {
  const index = questionNumber - 1;
  const card = page.getByTestId(`question-details-card-${index}`);
  await card.waitFor({ state: 'visible', timeout: 10000 });

  const trashButton = card.locator('button[aria-label="trash"]').first();
  await trashButton.waitFor({ state: 'visible', timeout: 10000 });
  await trashButton.click();
  await page.waitForTimeout(700);

  const confirmCandidates = [
    page.getByRole('button', { name: '刪除' }),
    page.getByRole('button', { name: 'Delete' }),
    page.locator('button').filter({ hasText: '刪除' }),
    page.locator('button').filter({ hasText: 'Delete' }),
  ];

  for (const locator of confirmCandidates) {
    if (await locator.count()) {
      const btn = locator.first();
      if (await btn.isVisible().catch(() => false)) {
        await btn.click();
        await page.waitForTimeout(1200);
        return true;
      }
    }
  }

  return false;
}

async function main() {
  const questionNumbers = parseQuestionNumbers(process.argv.slice(2));
  if (!questionNumbers.length) {
    throw new Error('Usage: node automation/wayground-delete-questions.js 19,18');
  }

  const { browser, page } = await connectAndFindPage(/\/admin\/quiz\/.*\/edit/);

  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1000);

  const deleted = [];
  const warnings = [];

  for (const qn of questionNumbers) {
    try {
      const confirmed = await clickQuestionTrash(page, qn);
      deleted.push({ questionNumber: qn, confirmed });
      if (!confirmed) {
        warnings.push(`Question ${qn}: trash clicked but no visible confirm button was found.`);
      }
    } catch (err) {
      warnings.push(`Question ${qn}: ${err.message}`);
    }
  }

  const summary = await page.evaluate(() => {
    const text = document.querySelector('[data-testid="header-main-row"]')?.textContent || '';
    const m = text.match(/(\d+)\s*個問題/);
    return {
      url: location.href,
      title: document.title,
      header: text.trim(),
      displayedQuestionCount: m ? Number(m[1]) : null,
    };
  });

  const outDir = ensureOutputDir();
  await page.screenshot({
    path: path.join(outDir, 'wayground-after-delete.png'),
    fullPage: true,
  });

  const result = {
    requestedDeletion: questionNumbers,
    deleted,
    warnings,
    summary,
  };

  fs.writeFileSync(
    path.join(outDir, 'wayground-after-delete.json'),
    JSON.stringify(result, null, 2),
    'utf8'
  );

  console.log(JSON.stringify(result, null, 2));
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
