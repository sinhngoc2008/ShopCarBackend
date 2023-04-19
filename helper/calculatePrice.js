const SaleModel = require('../model/SaleModel');
const take_decimal_number = require('./floatNumberTwoCharacter');

module.exports = {
	calPriceBySale(sale_price = 0, price_origin = 0) {
		let total = price_origin + sale_price * price_origin;
		return take_decimal_number(total) || 0;
	},

	calculatePriceSpecific(sale_price = 0, price_origin = 0, price_specific = 0) {
		let total = price_origin + sale_price * price_origin + price_specific;
		return take_decimal_number(total) || 0;
	},

	calPercentageSpecific(sale_price = 0, price_origin = 0, percentage_specific = 0) {
		let total =
			price_origin +
			(sale_price * price_origin) / 100 +
			(price_origin * percentage_specific) / 100;
		return take_decimal_number(total) || 0;
	},

	async calPriceBySaleProgram(type, price_origin = 0) {
		const _sale = await SaleModel.findOne({ source_crawl: type });
		let salePrice = _sale ? _sale.sale_price : 0;
		let total = salePrice * price_origin;
		return take_decimal_number(total) || 0;
	}
};
