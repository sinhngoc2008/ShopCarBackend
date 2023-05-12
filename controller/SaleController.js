const { SOURCE_CRAWL } = require('../constants/enum');
const take_decimal_number = require('../helper/floatNumberTwoCharacter');
const CarModel = require('../model/CarModel');
const SaleModel = require('../model/SaleModel');
async function updateCar(car, sale_price) {
	let priceDif = car.price;
	if (car.difference_price > 0) {
		priceDif = car.price + car.difference_price;
	}

	if (car.percentage > 0) {
		priceDif = car.price + car.price * (car.percentage / 100);
	}
	let priceSale = car.price * (sale_price / 100) || 0;

	let priceDisplayOnCar = take_decimal_number(priceDif + priceSale);

	await CarModel.findOneAndUpdate({ _id: car._id }, { price_display: priceDisplayOnCar });
}
class SaleController {
	async setSale(req, res) {
		const { is_sale, sale_price, source } = req.body;
		if (typeof is_sale !== 'boolean') {
			return res.status(200).json({
				error_code: 101,
				error_message: req.__('is_sale must be boolean'),
				status: false
			});
		}

		if (!SOURCE_CRAWL.includes(source)) {
			return res.status(200).json({
				error_code: 101,
				error_message: req.__('source is invalid'),
				status: false
			});
		}

		if (is_sale === true) {
			if (sale_price === undefined || sale_price === null || sale_price === NaN) {
				return res.status(200).json({
					status: false,
					error_code: 101,
					error_message: req.__('sale_price must be required')
				});
			}

			if (typeof sale_price !== 'number') {
				return res.status(200).json({
					status: false,
					error_code: 101,
					error_message: req.__('sale_price must be number')
				});
			}
		}

		try {
			const cars = await CarModel.find({ source_crawl: source });

			if (cars.length === 0) {
				return res.status(200).json({
					status: false,
					error_code: 105,
					error_message: req.__('Cars not found')
				});
			}

			const isSaleOn = await SaleModel.findOne({
				source_crawl: source
			});

			if (!isSaleOn) {
				const saleCreate = new SaleModel({
					is_sale,
					sale_price,
					source_crawl: source
				});
				await saleCreate.save();

				if (saleCreate.is_sale === true) {
					cars.forEach(async car => await updateCar(car, saleCreate.sale_price));
				}
			} else {
				if (is_sale === true) {
					await SaleModel.findByIdAndUpdate(isSaleOn._id, {
						sale_price,
						is_sale: true
					});
					cars.forEach(async car => await updateCar(car, sale_price));
				} else {
					await SaleModel.findByIdAndUpdate(isSaleOn._id, {
						sale_price: 0,
						is_sale: false
					});

					cars.forEach(async car => await updateCar(car, 0));
				}
			}
			res.status(200).json({
				status: true,
				status_code: 200,
				message: req.__('Set sale successfully')
			});
		} catch (error) {
			res.status(500).json({
				message: 'Server error',
				error: error.message,
				status_code: 500
			});
		}
	}

	async getSale(req, res) {
		try {
			const { source } = req.body;
			const sale = await SaleModel.findOne({
				source_crawl: source
			});
			if (sale) {
				res.status(200).json({
					status: true,
					status_code: 200,
					data: sale,
					message: req.__('Get sale successfully')
				});
			} else {
				res.status(200).json({
					status: true,
					status_code: 200,
					data: {
						is_sale: false,
						sale_price: 0
					},
					message: req.__('Get sale successfully')
				});
			}
		} catch (error) {
			res.status(500).json({
				message: 'Server error',
				error: error.message,
				status_code: 500
			});
		}
	}

	async getListSale(req, res) {
		try {
			const sales = await SaleModel.findOne({
				source_crawl: 'https://dautomall.com'
			});

			if (!sales) {
				return res.status(200).json([
					{
						is_sale: false,
						sale_price: 0,
						source_crawl: 'https://dautomall.com'
					}
				]);
			} else {
				return res.status(200).json([
					{
						is_sale: sales.is_sale,
						sale_price: sales.sale_price,
						source_crawl: 'https://dautomall.com'
					}
				]);
			}
		} catch (error) {
			res.status(500).json({
				message: 'Server error',
				error: error.message,
				status_code: 500
			});
		}
	}
}

module.exports = new SaleController();
