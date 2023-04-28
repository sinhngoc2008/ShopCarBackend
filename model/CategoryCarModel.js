const mongoose = require('mongoose');

const CategoryCarsModel = new mongoose.Schema(
	{
		category_name: {
			type: String,
			trim: true
		},
		category_detail: {
			type: Array,
			trim: true,
			default: []
		},
		image: {
			type: String,
			trim: true
		}
	},
);

module.exports = mongoose.model('CategoryCars', CategoryCarsModel);
