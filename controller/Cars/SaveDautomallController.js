const convertImageToLinkServer = require('../../helper/dowloadImage');
const take_decimal_number = require('../../helper/floatNumberTwoCharacter');
const generateUUID = require('../../helper/generateUUID');
const htmlToImageDautomall = require('../../helper/htmlToImageDautomall');
const CarModel = require('../../model/CarModel');
const SaleModel = require('../../model/SaleModel');

module.exports = async (req, res) => {
	let uuid = generateUUID();
	try {
		const { data } = req.body;
		let list_image_converted = [];

		const hasCarInDb = await CarModel.findOne({
			car_code: data.car_code.trim()
		});

		let isSaleOn = await SaleModel.find();
		let priceSale = 0;
		if (isSaleOn.length === 0) {
			priceSale = 0;
		} else {
			if (isSaleOn[0].is_sale) {
				priceSale = isSaleOn[0].sale_price / 100;
			} else {
				priceSale = 0;
			}
		}

		if (!hasCarInDb) {
			data?.listImage?.forEach(item => {
				let img = convertImageToLinkServer(item);
				list_image_converted.push(img);
			});
			let performance_check = await htmlToImageDautomall(data.performance_check);
			const car = new CarModel({
				car_name: data.car_name.trim(),
				car_model: data.car_model.trim(),
				images: list_image_converted || [],
				price: data.price,
				car_code: data.car_code.trim(),
				license_plate: data.basic_infr.plate_number.trim(),
				year_manufacture: data.basic_infr.year_manufacture,
				distance_driven: data.basic_infr.distance_driven,
				fuel_type: data.basic_infr.fuel_type,
				gearbox: data.basic_infr.transmission,
				color: data.basic_infr.color,
				presentation_number: data.basic_infr.presentation_number,
				category: data.car_name.trim().split(' ')[0],
				primary_image: list_image_converted.length > 0 ? list_image_converted[0] : '',
				price_display: take_decimal_number(data.price + priceSale * data.price),
				exterior: [],
				guts: [],
				safety: [],
				convenience: data.convenience_infr,

				performance_check: [performance_check],

				is_data_crawl: true,
				source_crawl: data.source_crawl || 'https://dautomall.com'
			});

			await car.save();
			res.status(200).json({
				message: 'Lưu thành công',
				status_code: 200
			});
		} else {
			await CarModel.updateOne(
				{
					car_code: data.car_code.trim()
				},
				{
					$set: {
						car_name: data.car_name.trim(),
						car_model: data.car_model.trim(),
						price: data.price,
						license_plate: data.basic_infr.plate_number.trim(),
						year_manufacture: data.basic_infr.year_manufacture,
						distance_driven: data.basic_infr.distance_driven,
						fuel_type: data.basic_infr.fuel_type,
						gearbox: data.basic_infr.transmission,
						color: data.basic_infr.color,
						presentation_number: data.basic_infr.presentation_number,
						category: data.car_name.trim().split(' ')[0],
						price_display: take_decimal_number(data.price + priceSale * data.price),
						exterior: [],
						guts: [],
						safety: [],
						convenience: data.convenience_infr
					}
				}
			);

			res.status(200).json({
				message: 'Cập nhật dữ liệu thành công'
			});
		}
	} catch (error) {
		res.status(500).json({
			message: error.message,
			status_code: 500,
			error_message: req.__('Server error')
		});
	}
};
