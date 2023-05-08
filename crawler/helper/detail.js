async function detailCars(car_code, page) {
	try {
		await page.setViewport({ width: 1920, height: 1080 });
		await page.goto(`${url}/BuyCar/BuyCarView.do?sCarProductCode=${car_code}`, {
			waitUntil: 'load',
			timeout: 1000000
		});

		const listImage = await page.evaluate(() => {
			let lists = [];
			const ellistImage = document.querySelectorAll('.slide.slick-slide.slick-cloned');
			ellistImage.forEach(elImage => {
				let src = elImage?.getAttribute('style')?.trim();
				src = src?.replace('background-image: url(', '');
				src = src?.replace(`)`, '');
				src = src?.replace(`'`, '');
				src = src?.split(';')[0];
				src = src?.replace(`'`, '');
				src = src?.replace(`"`, '');
				src = src?.replace(`"`, '');
				if (src) {
					lists.push(src);
				}
			});
			return lists || [];
		});
		const car_name = await page.evaluate(() => {
			let name = document.querySelector('.infoWp .secTop h3').innerText;
			return name;
		});

		const price = await page.evaluate(() => {
			let _price = document.querySelector('.infoWp .price h1').innerText;
			return Number(_price.replace(/[^0-9]/g, '')) || 0;
		});

		const basic_infr = await page.evaluate(() => {
			let obj = {};
			let elBasicInfr = document.querySelector('#basic_infr .tb02');
			let year_manufacture = elBasicInfr.querySelector(
				'tr:nth-child(1) td:nth-child(2)'
			).innerText;
			let color = elBasicInfr.querySelector('tr:nth-child(1) td:nth-child(4)').innerText;
			let fuel_type = elBasicInfr.querySelector('tr:nth-child(2) td:nth-child(2)').innerText;
			let distance_driven = elBasicInfr.querySelector(
				'tr:nth-child(2) td:nth-child(4)'
			).innerText;
			let plate_number = elBasicInfr.querySelector(
				'tr:nth-child(3) td:nth-child(2)'
			).innerText;
			let transmission = elBasicInfr.querySelector(
				'tr:nth-child(3) td:nth-child(4)'
			).innerText;
			let presentation_number = elBasicInfr.querySelector(
				'tr:nth-child(4) td:nth-child(2)'
			).innerText;
			obj = {
				...obj,
				year_manufacture: Number(year_manufacture.replace(/[^0-9]/g, '').slice(0, 4)) || 0,
				color,
				fuel_type,
				distance_driven: Number(distance_driven.replace(/[^0-9]/g, '')) || 0,
				plate_number,
				transmission,
				presentation_number
			};

			return obj;
		});

		const convenience_infr = await page.evaluate(() => {
			let listConvenience = [];
			let elBasicInfr = document.querySelector('#BuyCarPopup_Option');
			elBasicInfr.style.display = 'block';
			let elTr = elBasicInfr.querySelectorAll('.tb03 tr');
			elTr.forEach(el => {
				let elTd = el.querySelectorAll('td');
				elTd.forEach(_el_td => {
					let text = _el_td?.innerText?.trim();
					if (text) {
						listConvenience.push(text);
					}
				});
			});

			return listConvenience;
		});

		const car_model = await page.evaluate(() => {
			let carModelEl = document.querySelector('.wd50p.price_wp h5').innerText;
			return carModelEl || '';
		});

		const other_infor = await page.evaluate(() => {
			const other_inforEl = document.querySelector('.infoWp .detailType');
			return other_inforEl?.innerText || '';
		});

		// Lấy hiệu suất xe
		let performance_check = await page.evaluate(() => {
			const el_popup = document.getElementById('BuyCarPopup_Inspect');
			const el_frame = el_popup.getElementsByTagName('iframe')[0];
			let src = el_frame.getAttribute('src');

			return src;
		});

		let primary_image = await page.evaluate(() => {
			const elImage = document.querySelector(
				'.slick-track .slide.slick-slide.slick-current.slick-active'
			);
			let src = elImage?.getAttribute('style')?.trim();
			src = src?.replace('background-image: url(', '');
			src = src?.replace(`)`, '');
			src = src?.replace(`'`, '');
			src = src?.split(';')[0];
			src = src?.replace(`'`, '');
			src = src?.replace(`"`, '');
			src = src?.replace(`"`, '');
			return src || '';
		});

		await page.close();
		return {
			car_code,
			performance_check: performance_check || '',
			car_model,
			listImage,
			car_name,
			price,
			basic_infr,
			convenience_infr,
			primary_image,
			other_infor
		};
	} catch (error) {
		await sendEmail({
			subject: 'Lỗi detailCars',
			html: `Lỗi detailCars - ${error}
        Mã xe bị lỗi: ${car_code},
        Link xe bị lỗi: ${page}
      `,
			email: 'thangld2407@gmail.com'
		});
		console.log('Lỗi ', error);
	}
}
