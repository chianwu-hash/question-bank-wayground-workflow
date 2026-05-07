const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const CDP_URL = process.env.CDP_URL || 'http://127.0.0.1:9222';

async function connectAndFindPage(urlPattern) {
  const browser = await chromium.connectOverCDP(CDP_URL);
  const context = browser.contexts()[0];
  if (!context) throw new Error('No browser context found via CDP.');
  const page = urlPattern
    ? context.pages().find((p) => urlPattern.test(p.url())) || context.pages()[0]
    : context.pages()[0];
  if (!page) throw new Error('No Wayground page found.');
  return { browser, context, page };
}

function ensureOutputDir() {
  const outDir = path.join(process.cwd(), 'automation', 'output');
  fs.mkdirSync(outDir, { recursive: true });
  return outDir;
}

module.exports = { connectAndFindPage, ensureOutputDir };
