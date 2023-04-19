const puppeteer = require('puppeteer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

function htmlToImageDautomall(url) {
	return new Promise(async (resolve, reject) => {
		try {
			const browser = await puppeteer.launch({
				headless: true,
				args: ['--no-sandbox', '--disabled-setupid-sandbox'],
				ignoreHTTPSErrors: true
			});
			if (!url) {
				return resolve('/null');
			}
			if (!url.includes('pc.dautomall.com')) {
				return resolve('/null');
			}

			const page = await browser.newPage();
			await page.goto(url, { waitUntil: 'load', timeout: 0 });
			await page.waitForSelector('#form1');
			await page.addStyleTag({
				content: `
					#wrap {
						height: 100% !important;
						padding: 0 40px;
					}
				`
			});

			let pathname = `/uploads/performance-check-${uuidv4()}.webp`;

			await page.screenshot({
				path: path.join(__dirname, `../public/${pathname}`),
				fullPage: true
			});
			resolve(pathname);
			await browser.close();
		} catch (error) {
			resolve('/null');
		}
	});
}

module.exports = htmlToImageDautomall;
