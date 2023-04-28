const puppeteer = require('puppeteer');
const startBrowser = require('./helper/browser');
const { URL_PAGE_CRAWL } = require('./constant/url');
const CategoryCarsModel = require('../model/CategoryCarModel');
module.exports = async () => {
	const browser = await startBrowser();
	try {
		let page = await browser.newPage();

		await page.setViewport({
			width: 1200,
			height: 800
		});

		console.log('=============SET UP TO CÀO DỮ LIỆU NHÃN XE=======================');
		await page.goto(URL_PAGE_CRAWL);
		console.log('=============ĐÃ VÀO TRANG NHÃN XE=======================');
		await page.waitForSelector('#mCSB_8_container');
		console.log('=============ĐÃ CHỜ XONG=======================');
		console.time('crawlCategory');
		const listCategory = await page.evaluate(() => {
			const listCate = [];
			const list = document.querySelectorAll('#mCSB_8_container > li');
			list.forEach(itemCate => {
				const name = itemCate.querySelector('a>span')?.innerText?.trim();
				const image_link = itemCate.querySelector('img').getAttribute('src');
				const modelCars = [];
				itemCate.addEventListener('click', () => {
					const listModel = document.querySelectorAll('#mCSB_9_container > li');
					listModel.forEach(itemModel => {
						const model_name = itemModel.querySelector('span>label')?.innerText?.trim();
						const modelDetail = [];

						itemModel.addEventListener('click', () => {
							const listDetail = document.querySelectorAll('#mCSB_10_container > li');
							listDetail.forEach(itemDetail => {
								const detail_name =
									itemDetail.querySelector('span>label')?.innerText?.trim();
								modelDetail.push(detail_name);
							});
						});

						itemModel.click();

						modelCars.push({
							model_name,
							model_detail: modelDetail
						});
					});
					listCate.push({
						cate_name: name,
						image: image_link,
						model: modelCars
					});
				});
				itemCate.click();
			});
			return listCate;
		});
		console.log('=============ĐÃ LẤY ĐƯỢC DỮ LIỆU CATEGORY=======================');

		const formatListCategory = listCategory.map(item => {
			return {
				category_name: item.cate_name,
				category_detail: item.model,
				image: item.image
			}
		});

		console.timeEnd('crawlCategory');
		await CategoryCarsModel.insertMany(formatListCategory);
		console.log('=============ĐÃ LƯU DỮ LIỆU CATEGORY=======================');
	} catch (error) {
		console.log(error.message);
	}
};
