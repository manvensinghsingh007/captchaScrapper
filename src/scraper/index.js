const fs = require("fs").promises;
const path = require("path");
const logger = require("../utils/logger");

const URL =
  "https://passbook.epfindia.gov.in/MemberPassBook/login?error=session-exception";

async function scrapeCaptcha(count, page) {
  try {
    if (count > 1) {
      await page.reload({ waitUntil: "networkidle0", timeout: 30000 });
    } else {
      await page.goto(URL, { waitUntil: "networkidle0", timeout: 30000 });
    }

    const captchaElement = await page.waitForSelector("#captcha_id", {
      timeout: 10000,
    });

    if (!captchaElement) {
      throw new Error("Captcha element not found");
    }

    const imageSrc = await captchaElement.evaluate((el) =>
      el.getAttribute("src")
    );

    const outputDir = path.join(__dirname, "../../scrappedData");
    await fs.mkdir(outputDir, { recursive: true });

    // Save image
    const base64Data = imageSrc.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, "base64");
    await fs.writeFile(
      path.join(outputDir, `captcha_${count}.png`),
      imageBuffer
    );
    console.log(
      `Captcha image saved as captcha_${count}.png in scrappedData directory`
    );
    logger.info(
      `Captcha image saved as captcha_${count}.png in scrappedData directory`
    );
  } catch (error) {
    throw error;
  }
}

module.exports = {
  scrapeCaptcha,
};
