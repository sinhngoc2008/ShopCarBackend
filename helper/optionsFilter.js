const { SOURCE_CRAWL } = require('../constants/enum');
const { isArray } = require('./validation');

module.exports = (filter, search) => {
	let query = {};
	if (filter) {
		const { from_year, to_year } = filter;

		if (from_year && to_year) {
			query = {
				...query,
				year_manufacture: {
					$gte: from_year,
					$lte: to_year
				}
			};
		}

		const { from_price, to_price } = filter;

		if (typeof from_price === 'number' && typeof to_price === 'number') {
			if (from_price > to_price) {
				return res.status(200).json({
					message: req.__('From price must be less than to price'),
					error_code: 104
				});
			}
			if (from_price || to_price) {
				query = {
					...query,
					price: {
						$gte: from_price || to_price
					}
				};
			}
			query = {
				...query,
				price: {
					$gte: from_price,
					$lte: to_price
				}
			};
		}

		const { from_distance, to_distance } = filter;

		if (typeof from_distance === 'number' && typeof to_distance === 'number') {
			if (from_distance > to_distance) {
				return res.status(200).json({
					message: req.__('From distance must be less than to distance'),
					error_code: 104
				});
			}
			if (from_distance || to_distance) {
				query = {
					...query,
					distance_driven: {
						$gte: from_distance || to_distance
					}
				};
			}

			query = {
				...query,
				distance_driven: {
					$gte: from_distance,
					$lte: to_distance
				}
			};
		}

		const { fuel_type } = filter;

		if (fuel_type) {
			query = {
				...query,
				fuel_type
			};
		}

		const { gearbox } = filter;

		if (gearbox) {
			query = {
				...query,
				gearbox
			};
		}

		const { is_data_crawl } = filter;
		if (typeof is_data_crawl === 'boolean') {
			query = {
				...query,
				is_data_crawl
			};
		}

		const { category } = filter;
		if (category) {
			query = {
				...query,
				category
			};
		}

		const { car_model } = filter;
		if (car_model && isArray(car_model)) {
			query = {
				...query,
				car_model: {
					$in: [...car_model]
				}
			};
		}

		const { color } = filter;
		if (color) {
			query = {
				...query,
				color
			};
		}

		const { is_hotsale } = filter;
		if (typeof is_hotsale === 'boolean') {
			query = {
				...query,
				is_hotsale
			};
		}

		const { source_crawl } = filter;
		if (source_crawl && SOURCE_CRAWL.includes(source_crawl)) {
			let src_crawl = source_crawl;
			if(source_crawl === "https://www.djauto.co.kr") {
				src_crawl = "https://dautomall.com";
			}
			query = {
				...query,
				source_crawl
			};
		}
	}
	if (search) {
		query = {
			...query,
			$or: [
				{ car_name: { $regex: search, $options: 'i' } },
				{ license_plate: { $regex: search, $options: 'i' } }
			]
		};
	}

	if(!filter.source_crawl) {
		query = {
			...query,
			source_crawl: "https://dautomall.com"
		}
	}
	return query;
};
