const startBrowser = require('./helper/browser');
const { URL_PAGE_CRAWL } = require('./constant/url');
const CategoryCarsModel = require('../model/CategoryCarModel');
const convertImageToLinkServer = require('../helper/dowloadImage');
const sleep = require('./helper/sleep');
const toNumber = require('./helper/toNumber');

module.exports = async () => {
	try {
		const browser = await startBrowser();
		console.log('=============SET UP TO CÀO DỮ LIỆU XE======================');
		let page = await browser.newPage();

		await page.goto(URL_PAGE_CRAWL, {
			timeout: 0,
			waitUntil: 'networkidle2'
		});
		await page.waitForSelector('#mCSB_8_container');

		const elementCategory = await page.$$('#mCSB_8_container > li');
		let indexCategory = 0;
		let listCategory = [];
		console.time('time');
		while (indexCategory < elementCategory.length) {
			await page.evaluate(
				elIndex => document.querySelectorAll('#mCSB_8_container > li')[elIndex].click(),
				indexCategory
			);
			let category_name = await page.evaluate(
				elIndex =>
					document
						.querySelectorAll('#mCSB_8_container > li')
						[elIndex].querySelector('span')
						.innerText.trim(),
				indexCategory
			);
			let image = await page.evaluate(
				elIndex =>
					document
						.querySelectorAll('#mCSB_8_container > li')
						[elIndex].querySelector('img').src,
				indexCategory
			);
			await sleep(2000);
			const car_count = await page.evaluate(
				() => document.querySelector('#SearchCount').innerText
			);

			let model = [];
			const elementModel = await page.$$('#mCSB_9_container > li');
			let indexModel = 0;

			while (indexModel < elementModel.length) {
				let detail_model = [];
				await page.evaluate(
					elIndex => document.querySelectorAll('#mCSB_9_container > li')[elIndex].click(),
					indexModel
				);
				let model_name = await page.evaluate(
					elIndex =>
						document
							.querySelectorAll('#mCSB_9_container > li')
							[elIndex].querySelector('span.checkbox-box label')
							.innerText.trim(),
					indexModel
				);
				await sleep(2000);
				let indexDetail = 0;
				const elementDetail = await page.$$('#mCSB_10_container > li');
				while (indexDetail < elementDetail.length) {
					await page.evaluate(
						elIndex =>
							document.querySelectorAll('#mCSB_10_container > li')[elIndex].click(),
						indexDetail
					);
					await sleep(2000);
					let detail_name = await page.evaluate(
						elIndex =>
							document
								.querySelectorAll('#mCSB_10_container > li')
								[elIndex].querySelector('span.checkbox-box label')
								.innerText.trim(),
						indexDetail
					);

					let rating = [];
					const elementRating = await page.$$('#mCSB_11_container > li');
					let indexRating = 0;

					while (indexRating < elementRating.length) {
						const liRating = await page.evaluate(
							elIndex =>
								document.querySelectorAll('#mCSB_11_container > li')[elIndex],
							indexRating
						);

						if (liRating) {
							await page.evaluate(
								elIndex =>
									document
										.querySelectorAll('#mCSB_11_container > li')
										[elIndex].click(),
								indexRating
							);
							await sleep(2000);
							let rating_name = await page.evaluate(
								elIndex =>
									document
										.querySelectorAll('#mCSB_11_container > li')
										[elIndex].querySelector('span.checkbox-box label')
										.innerText.trim(),
								indexRating
							);

							if (rating_name) {
								rating.push(rating_name);
							}
						}
						indexRating++;
					}

					detail_model.push({
						detail_name: detail_name,
						rating: rating
					});
					indexDetail++;
				}
				model.push({
					model_name: model_name,
					model_detail: detail_model
				});
				indexModel++;
			}

			listCategory.push({
				category_name: category_name,
				image: image,
				category_detail: model,
				car_count: toNumber(car_count)
			});

			indexCategory++;
		}
		console.timeEnd('time');
		let indexSave = 0;
		while (indexSave < listCategory.length) {
			const category = listCategory[indexSave];
			const data_save = {
				category_name: category.category_name,
				category_detail: category.category_detail,
				car_count: parseInt(category.car_count) || 0
			};
			if (category.image) data_save.image = convertImageToLinkServer(category.image);

			const hasCategory = await CategoryCarsModel.findOne({
				category_name: category.category_name
			});
			if (hasCategory) {
				await CategoryCarsModel.findOneAndUpdate(
					{
						category_name: category.category_name
					},
					data_save
				);
			} else {
				await CategoryCarsModel.create(data_save);
			}
			indexSave++;
		}
		console.log("DONE");
		browser.close();
	} catch (error) {
		console.log(error.message);
	}
};
