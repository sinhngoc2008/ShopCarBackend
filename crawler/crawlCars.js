const startBrowser = require('./helper/browser');
const { URL_PAGE_CRAWL } = require('./constant/url');
const sleep = require('./helper/sleep');
const detailCars = require('./helper/detail');
const fs = require('fs');
function totalPage() {}

module.exports = async () => {
	try {
		const browser = await startBrowser();
		console.log('=============SET UP TO CÀO DỮ LIỆU XE======================');
		let page = await browser.newPage();

		await page.goto(URL_PAGE_CRAWL);
		await sleep(5000);
		console.log('=============ĐÃ VÀO TRANG XE======================');

		await page.waitForSelector('#mCSB_8_container');
		console.log('=============ĐÃ CHỜ NHÃN XE LOAD XONG======================');

		console.log('=============THỰC HIỆN LẤY DANH SÁCH XE THEO NHÃN XE======================');
		console.time('crawlCars');
		const listCarByCategory = await page.evaluate(() => {
			let list = [];
			var iframe = document.getElementById('body_IFrame');
			var innerDoc = iframe.contentDocument || iframe.contentWindow.document;

			const elementCategories = document.querySelectorAll('#mCSB_8_container > li');
			let indexCategory = 0;
			while (indexCategory < elementCategories.length) {
				const elemenPagination = innerDoc.body.querySelector('.pagination .NextNext');
				let pageNumber = 1;
				const positionClick = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
				let position = 0;
				if(indexCategory < 2) {
					elementCategories[indexCategory].click();
					const totalPage = elemenPagination.getAttribute('onclick').match(/\d+/)[0];
					list.push(totalPage);
				}
				// while (pageNumber <= totalPage) {
				// 	if (position >= 10) {
				// 		position = 0;
				// 	}

				// 	const elCarList = innerDoc.body.querySelectorAll(
				// 		'.secMdle .tb01 tr:not(:first-child)'
				// 	);

				// 	const listCarCode = [];
				// 	elCarList.forEach(car => {
				// 		const car_code = car.getAttribute('onclick');
				// 		const reGetCode = /(?<=\().+?(?=\))/;
				// 		let _car_code = car_code.match(reGetCode);
				// 		_car_code = _car_code[0].split("'");

				// 		if (Array.isArray(_car_code)) {
				// 			if (_car_code.length >= 2) {
				// 				_car_code = _car_code[1];
				// 			}
				// 		}
				// 		listCarCode.push(_car_code);
				// 	});
				// 	list = [...list, ...listCarCode];
				// 	position = position + 1;

				// 	if (position > 0 && pageNumber < totalPage) {
				// 		innerDoc.body
				// 			.querySelector(
				// 				`.secMdle .pagination a:nth-child(${positionClick[position]})`
				// 			)
				// 			.click();
				// 	}

				// 	pageNumber = pageNumber + 1;
				// }
				// indexCategory = indexCategory + 1;
			}
			return list;
		});
		console.timeEnd('crawlCars');

		// remove duplicate

		fs.writeFileSync('./crawler/listCarByCategory.json', JSON.stringify(listCarByCategory));
		browser.close();
	} catch (err) {
		console.log('Không thể mở trình duyệt : ', err.message);
	}
};
