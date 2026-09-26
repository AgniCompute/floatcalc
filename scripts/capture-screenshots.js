const { chromium } = require("playwright");
const path = require("node:path");
const fs = require("node:fs");

async function captureRealStoreScreenshots() {
  console.log("Launching Chromium to capture authentic FloatCalc screenshots...");
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1366, height: 768 },
    deviceScaleFactor: 2
  });
  
  const page = await context.newPage();
  const filePath = "file://" + path.resolve(__dirname, "../src/index.html").replace(/\\/g, "/");
  await page.goto(filePath);
  await page.waitForLoadState("networkidle");

  const outDir = "c:/Users/patel/OneDrive/Desktop/FloatCalc_Store_Assets";
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // Set dark theme for crisp contrast
  await page.evaluate(() => {
    document.body.dataset.theme = "dark";
  });

  // Perform some authentic calculations: 1,250 * 8 = 10,000
  await page.click('button[data-number="1"]');
  await page.click('button[data-number="2"]');
  await page.click('button[data-number="5"]');
  await page.click('button[data-number="0"]');
  await page.click('button[data-operator="*"]');
  await page.click('button[data-number="8"]');
  await page.click('button[data-action="equals"]');

  // Second calculation: + 450 = 10,450
  await page.click('button[data-operator="+"]');
  await page.click('button[data-number="4"]');
  await page.click('button[data-number="5"]');
  await page.click('button[data-number="0"]');
  await page.click('button[data-action="equals"]');

  // Open the history drawer to showcase calculation history in action!
  await page.click('#historyButton');
  await page.waitForTimeout(300);

  // 1. Capture 1366x768 Store Showcase Screenshot
  await page.screenshot({
    path: path.join(outDir, "screenshot_main.png"),
    fullPage: false
  });
  console.log("✔ Captured authentic screenshot_main.png (1366x768 with live calculations & history drawer)");

  // 2. Capture Light Mode Screenshot
  await page.click('#historyButton'); // Close history
  await page.evaluate(() => {
    document.body.dataset.theme = "light";
  });
  await page.click('button[data-action="clear"]');
  await page.click('button[data-number="9"]');
  await page.click('button[data-number="9"]');
  await page.click('button[data-operator="/"]');
  await page.click('button[data-number="3"]');
  await page.click('button[data-action="equals"]');
  await page.screenshot({
    path: path.join(outDir, "screenshot_light.png"),
    fullPage: false
  });
  console.log("✔ Captured authentic screenshot_light.png (1366x768 light mode)");

  // 3. Capture 1080x1080 Box Art focused on the calculator interface
  await page.setViewportSize({ width: 1080, height: 1080 });
  await page.evaluate(() => {
    document.body.dataset.theme = "dark";
  });
  await page.screenshot({
    path: path.join(outDir, "box_art_1080x1080.png")
  });
  console.log("✔ Captured authentic box_art_1080x1080.png (1080x1080)");

  // 4. Capture 300x300 App Tile Icon
  await page.setViewportSize({ width: 300, height: 300 });
  await page.screenshot({
    path: path.join(outDir, "app_tile_300x300.png")
  });
  console.log("✔ Captured authentic app_tile_300x300.png (300x300)");

  await browser.close();
  console.log("\nAll authentic store visual assets generated successfully!");
}

captureRealStoreScreenshots().catch((err) => {
  console.error("Screenshot capture error:", err);
  process.exit(1);
});
