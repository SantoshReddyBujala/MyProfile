import { chromium } from "playwright";
import fs from "fs";
import path from "path";

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();
  await page.goto("http://localhost:5174/");
  // wait for the Download PDF button
  await page.waitForSelector("button", { timeout: 10000 });
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.click('button:has-text("Download PDF")'),
  ]);
  const downloadsDir = path.join(process.cwd(), "tmp_downloads");
  if (!fs.existsSync(downloadsDir))
    fs.mkdirSync(downloadsDir, { recursive: true });
  const savePath = path.join(downloadsDir, await download.suggestedFilename());
  await download.saveAs(savePath);
  console.log("Saved download to", savePath);
  await browser.close();
})();
