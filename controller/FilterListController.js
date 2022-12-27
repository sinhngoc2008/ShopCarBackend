const CarModel = require('../model/CarModel');
class FilterListController {
	async get_distance_driven(req, res) {
		try {
			const list = await CarModel.find()
				.select('distance_driven')
				.sort({ distance_driven: 1 });
			let list_distance_driven = [];

			list_distance_driven = list && list.map(item => item.distance_driven);

			list_distance_driven =
				list_distance_driven &&
				list_distance_driven.filter((item, index) => {
					return list_distance_driven.indexOf(item) === index;
				});

			res.status(200).json({
				message: 'Get list distance driven success',
				data: list_distance_driven,
				status_code: 200,
				status: true
			});
		} catch (error) {
			res.status(500).json({
				error: error.message,
				status_code: 500,
				message: req.__('Server error')
			});
		}
	}

	async get_fuel_type(req, res) {
		try {
			const list = await CarModel.find().select('fuel_type').sort({ fuel_type: 1 });
			let list_fuel_type = [];
			list.forEach(item => {
				list_fuel_type.push(item.fuel_type);
			});

			list_fuel_type = list_fuel_type.filter((item, index) => {
				return list_fuel_type.indexOf(item) === index;
			});

			res.status(200).json({
				message: 'Get list fuel type success',
				data: list_fuel_type,
				status_code: 200,
				status: true
			});
		} catch (error) {
			res.status(500).json({
				error: error.message,
				status_code: 500,
				message: req.__('Server error')
			});
		}
	}

	async get_gear_box(req, res) {
		try {
			const list = await CarModel.find().select('gearbox').sort({ gearbox: 1 });
			let list_gear_box = [];
			list.forEach(item => {
				list_gear_box.push(item.gearbox);
			});

			list_gear_box = list_gear_box.filter((item, index) => {
				return list_gear_box.indexOf(item) === index;
			});

			res.status(200).json({
				message: 'Get list gear box success',
				data: list_gear_box,
				status_code: 200,
				status: true
			});
		} catch (error) {
			res.status(500).json({
				error: error.message,
				status_code: 500,
				message: req.__('Server error')
			});
		}
	}

	async get_color(req, res) {
		try {
			const list = await CarModel.find().select('color').sort({ color: 1 });
			let list_color = [];
			list.forEach(item => {
				if (item.color && item.color !== '') {
					list_color.push(item.color);
				}
			});

			list_color = list_color.filter((item, index) => {
				return list_color.indexOf(item) === index;
			});

			res.status(200).json({
				message: 'Get list color success',
				data: list_color,
				status_code: 200,
				status: true
			});
		} catch (error) {
			res.status(500).json({
				error: error.message,
				status_code: 500,
				message: req.__('Server error')
			});
		}
	}

	async get_category(req, res) {
		try {
			const list = await CarModel.find().select('category').sort({ category: 1 });
			let list_category = [];
			list.forEach(item => {
				if (item.category && item.category !== '') {
					list_category.push(item.category);
				}
			});

			list_category =
				list_category &&
				list_category.filter((item, index) => {
					return list_category.indexOf(item) === index;
				});

			let list_sort = await CarModel.aggregate([
				{
					$match: {
						category: { $in: list_category }
					}
				},
				{
					$addFields: {
						placement: {
							$indexOfArray: [list_category, '$category']
						}
					}
				},
				{
					$sort: {
						placement: -1
					}
				}
			]);

			list_sort = list_sort && list_sort.map(item => item.category);
			list_sort =
				list_sort &&
				list_sort.filter((item, index) => item !== '' && list_sort.indexOf(item) === index);

			res.status(200).json({
				message: req.__('Get list category success'),
				data: list_sort,
				status_code: 200,
				status: true
			});
		} catch (error) {
			res.status(500).json({
				error: error.message,
				status_code: 500,
				message: req.__('Server error')
			});
		}
	}

	async get_car_type(req, res) {
		try {
			const list = await CarModel.find().select('car_type').sort({ car_type: 1 });
			let list_car_type = [];
			list.forEach(item => {
				if (item.car_type && item.car_type !== '') {
					list_car_type.push(item.car_type);
				}
			});

			list_car_type = list_car_type.filter((item, index) => {
				return list_car_type.indexOf(item) === index;
			});

			res.status(200).json({
				message: req.__('Get list car type success'),
				data: list_car_type,
				status_code: 200,
				status: true
			});
		} catch (error) {
			res.status(500).json({
				error: error.message,
				status_code: 500,
				message: req.__('Server error')
			});
		}
	}

	async get_price(req, res) {
		try {
			const list = await CarModel.find().select('price').sort({ price: 1 });
			let list_price = [];
			list.forEach(item => {
				if (item.price && item.price !== '') {
					list_price.push(item.price);
				}
			});

			list_price = list_price.filter((item, index) => {
				return list_price.indexOf(item) === index;
			});

			res.status(200).json({
				message: req.__('Get list price success'),
				data: list_price,
				status_code: 200,
				status: true
			});
		} catch (error) {
			res.status(500).json({
				error: error.message,
				status_code: 500,
				message: req.__('Server error')
			});
		}
	}

	async get_model(req, res) {
		try {
			const list = await CarModel.find().select('category');
			let list_category = [];
			list.forEach(item => {
				if (item.category && item.category !== '') {
					list_category.push(item.category);
				}
			});

			list_category = list_category.filter((item, index) => {
				return list_category.indexOf(item) === index;
			});

			let listModelData = {};

			for (let i = 0; i < list_category.length; i++) {
				const list_model = await CarModel.find({ category: list_category[i] }).select(
					'car_model'
				);
				let list_model_data = [];
				list_model.forEach(item => {
					if (item.car_model && item.car_model !== '') {
						list_model_data.push(item.car_model);
					}
				});

				list_model_data = list_model_data.filter((item, index) => {
					return list_model_data.indexOf(item) === index;
				});

				listModelData = {
					...listModelData,
					[list_category[i]]: list_model_data.sort()
				};
			}

			res.status(200).json({
				message: req.__('Get list model success'),
				data: listModelData,
				status_code: 200
			});
		} catch (error) {
			res.status(500).json({
				error: error.message,
				status_code: 500,
				message: req.__('Server error')
			});
		}
	}
}

// Path: routes\api\module\filter_list\index.js

module.exports = new FilterListController();
