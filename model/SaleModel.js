const mongoose = require('mongoose');
const { SOURCE_CRAWL } = require('../constants/enum');

const SaleSchema = new mongoose.Schema(
	{
		is_sale: {
			type: Boolean,
			default: false
		},
		sale_price: {
			type: Number,
			default: 0
		},
		source_crawl: {
			type: String,
			enum: SOURCE_CRAWL
		}
	},
	{
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at'
		}
	}
);

module.exports = mongoose.model('Sale', SaleSchema);
