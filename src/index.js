const scraper = require("./scraper/index");
const puppeteer = require("puppeteer");
const logger = require("./utils/logger");
const fs = require("fs").promises;
const path = require("path");

async function main() {
  let successCount = 0;
  const totalAttempts = 100;

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    const scrappedDataPath = path.join(__dirname, "../scrappedData");
    await fs.rm(scrappedDataPath, { recursive: true, force: true });

    for (let i = 1; i <= totalAttempts; i++) {
      try {
        await scraper.scrapeCaptcha(i, page);
        successCount++;
      } catch (error) {
        logger.error(`Failed to scrape captcha ${i}: ${error.message}`);
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  } catch (error) {
    console.log(error);
    logger.error("Error in page:", error.message);
  }
  // Close the browser after all attempts
  await browser.close();
  // Log the total number of successful attempts
  logger.info(
    `Scraping completed. Total success: ${successCount}/${totalAttempts}`
  );
}

main().catch((error) => {
  logger.error("Main process failed:", error);
});
