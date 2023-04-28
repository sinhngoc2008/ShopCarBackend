const puppeteer = require("puppeteer");

async function startBrowser() {
  let browser;
  try {
    console.log("Đang khởi tạo trình duyệt");
    browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', "--disabled-setupid-sandbox"],
      ignoreHTTPSErrors: true,
    });
  } catch (err) {
    console.log("Không thể mở trình duyệt : ", err.message);
  }
  return browser;
}

module.exports = startBrowser;
