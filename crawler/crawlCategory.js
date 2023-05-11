const startBrowser = require('./helper/browser');
const { URL_PAGE_CRAWL } = require('./constant/url');
const CategoryCarsModel = require('../model/CategoryCarModel');
const convertImageToLinkServer = require('../helper/dowloadImage');

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
			list.length > 0 &&
				list.forEach(itemCate => {
					const name = itemCate.querySelector('a>span')?.innerText?.trim();
					const image_link = itemCate.querySelector('img').getAttribute('src');
					const modelCars = [];
					itemCate.addEventListener('click', () => {
						const listModel = document.querySelectorAll('#mCSB_9_container > li');
						listModel.length > 0 &&
							listModel.forEach(itemModel => {
								const model_name = itemModel
									.querySelector('span>label')
									?.innerText?.trim();
								const modelDetail = [];

								itemModel.addEventListener('click', () => {
									const listDetail =
										document.querySelectorAll('#mCSB_10_container > li');
									listDetail.length > 0 &&
										listDetail.forEach(itemDetail => {
											const model_rating = [];
											const detail_name = itemDetail
												.querySelector('span>label')
												?.innerText?.trim();

											itemDetail.addEventListener('click', () => {
												const listRating =
													document.querySelectorAll(
														'#mCSB_11_container > li'
													);
												listRating.length > 0 &&
													listRating.forEach(itemRating => {
														const rating_name = itemRating
															.querySelector('span>label')
															?.innerText?.trim();
														model_rating.push(rating_name);
													});
												modelDetail.push({
													detail_name,
													rating: model_rating
												});
											});
											itemDetail.click();
										});
								});

								itemModel.click();

								modelCars.push({
									model_name,
									model_detail: modelDetail || []
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
			};
		});

		for (let i = 0; i < formatListCategory.length; i++) {
			const item = formatListCategory[i];
			const checkExist = await CategoryCarsModel.findOne({
				category_name: item.category_name
			});
			if (checkExist) {
				await CategoryCarsModel.findOneAndUpdate(
					{
						category_name: item.category_name
					},
					{
						$set: {
							category_detail: item.category_detail,
							image: item.image
						}
					}
				);
			} else {
				item.image = convertImageToLinkServer(item.image);
				await CategoryCarsModel.create(item);
			}
		}

		console.log('=============ĐÃ LƯU DỮ LIỆU CATEGORY=======================');
		await browser.close();
	} catch (error) {
		console.log(error.message);
	}
};
