const puppeteer = require('puppeteer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

function htmlToPdf(url) {
	return new Promise(async (resolve, reject) => {
		const browser = await puppeteer.launch({
			headless: true,
			args: ['--no-sandbox', '--disabled-setupid-sandbox'],
			ignoreHTTPSErrors: true
		});
		const page = await browser.newPage();
		try {
			page.on('dialog', dialog => {
				dialog.accept();
			});

			await page.goto(url, { waitUntil: 'networkidle2' });
			try {
				await page.waitForSelector('#idPrint');
			} catch (error) {
				return resolve(null);
			}
			try {
				await page.waitForSelector('.pageAfter');
			} catch (error) {
				return resolve(null);
			}
			let pathname = `/uploads/performance-check-${uuidv4()}.webp`;

			await page.screenshot({
				path: path.join(__dirname, `../public/${pathname}`),
				fullPage: true
			});
			resolve(pathname);
		} catch (error) {
			reject(error);
		}
		finally {
			await page.close();
			await browser.close();
		}
	});
}

module.exports = htmlToPdf;
