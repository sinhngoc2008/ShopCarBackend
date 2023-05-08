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
			default: [
				{
					model_name: '',
					model_detail: [
						{
							detail_name: '',
							rating: []
						}
					]
				}
			]
		},
		image: {
			type: String,
			trim: true,
			default: `/assets/images/noimage.png`
		}
	},
	{
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at'
		}
	}
);

module.exports = mongoose.model('CategoryCars', CategoryCarsModel);
