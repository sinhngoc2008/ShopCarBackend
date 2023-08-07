const { SOURCE_CRAWL } = require('../constants/enum');
const translateText = require('./translator');
const { isArray } = require('./validation');

module.exports = async (filter, search) => {
	let query = {};
	if (filter) {
		const { from_year, to_year } = filter;

		if (from_year || to_year) {

			if (from_year && to_year) {
				query = {
					...query,
					year_manufacture: {
						$gte: from_year,
						$lte: to_year
					}
				};
			}

			if (from_year && !to_year) {
				query = {
					...query,
					year_manufacture: {
						$gte: from_year
					}
				};
			} else if (!from_year && to_year) {
				query = {
					...query,
					year_manufacture: {
						$lte: to_year
					}
				};
			}

		}

		const { from_price, to_price } = filter;
		if (from_price || to_price) {

			if (from_price && to_price) {
				query = {
					...query,
					price: {
						$gte: from_price,
						$lte: to_price
					}
				};
			}

			if (from_price && !to_price) {
				query = {
					...query,
					price: {
						$gte: from_price
					}
				};
			}

			if (!from_price && to_price) {
				query = {
					...query,
					price: {
						$lte: to_price
					}
				};
			}
		}

		const { from_distance, to_distance } = filter;

		if (from_distance || to_distance) {
			if (from_distance && to_distance) {
				query = {
					...query,
					distance_driven: {
						$gte: from_distance,
						$lte: to_distance
					}
				};
			}

			if (from_distance && !to_distance) {
				query = {
					...query,
					distance_driven: {
						$gte: from_distance
					}
				};
			}

			if (!from_distance && to_distance) {
				query = {
					...query,
					distance_driven: {
						$lte: to_distance
					}
				};
			}
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
				color: color
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
			if (source_crawl === 'https://www.djauto.co.kr') {
				src_crawl = 'https://dautomall.com';
			}
			query = {
				...query,
				source_crawl
			};
		}

		const { category_name, model_name, car_details, rating } = filter;
		if (category_name) {
			query = {
				...query,
				$and: [
					{ category_name: category_name },
				]
			};
			if (model_name) {
				query = {
					...query,
					$and: [
						...query.$and,
						{ model_name: model_name }
					]
				};

				if (car_details) {
					query = {
						...query,
						$and: [
							...query.$and,
							{ detail_name: car_details }
						]
					};
					if (rating && rating.length > 0) {
						query = {
							...query,
							$and: [
								...query.$and,
								{ rating: { $in: rating } }
							]
						};
					}
				}
			}
		}

		const { created_at, created_cond, updated_at, updated_cond } = filter;
		if (created_at) {
			if (created_cond == "eq") {
				query = {
					...query,
					created_at: {
						$eq: [new Date(created_at)]
					}
				};
			}
			else if (created_cond == "lt") {
				query = {
					...query,
					created_at: {
						$lt: [new Date(created_at)]
					}
				};
			}
			else if (created_cond == "gt") {
				query = {
					...query,
					created_at: {
						$gt: [new Date(created_at)]
					}
				};
			}
		}
		if (updated_at) {
			if (updated_cond == "eq") {
				query = {
					...query,
					updated_at: {
						$eq: [new Date(updated_at)]
					}
				};
			}
			else if (updated_cond == "lt") {
				query = {
					...query,
					updated_at: {
						$lt: [new Date(updated_at)]
					}
				};
			}
			else if (updated_cond == "gt") {
				query = {
					...query,
					updated_at: {
						$gt: [new Date(updated_at)]
					}
				};
			}
		}

	}
	if (search) {
		const key_search = await translateText(search);
		query = {
			...query,
			$or: [
				{ car_name: { $regex: key_search, $options: 'i' } },
				{ license_plate: { $regex: search, $options: 'i' } }
			]
		};
	}

	return query;
};
