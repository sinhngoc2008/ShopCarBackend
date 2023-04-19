const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema(
	{
		// Thông tin cơ bản
		car_name: {
			type: String,
			trim: true,
			default: ''
		},
		price: {
			type: Number,
			trim: true
		},
		car_code: {
			type: String,
			trim: true,
			default: ''
		},
		car_model: {
			type: String,
			trim: true,
			default: ''
		},
		license_plate: {
			type: String,
			trim: true,
			default: ''
		},
		year_manufacture: {
			type: String,
			trim: true,
			default: ''
		},
		distance_driven: {
			type: Number,
			trim: true,
			default: 0
		},
		fuel_type: {
			type: String,
			trim: true,
			default: ''
		},
		gearbox: {
			type: String,
			trim: true,
			default: ''
		},
		cylinder_capacity: {
			type: String,
			trim: true,
			default: ''
		},
		color: {
			type: String,
			trim: true,
			default: ''
		},
		car_type: {
			type: String,
			trim: true,
			default: ''
		},
		seizure: {
			type: String,
			trim: true,
			default: ''
		},
		mortgage: {
			type: String,
			trim: true,
			default: ''
		},
		presentation_number: {
			type: String,
			trim: true,
			default: ''
		},
		storage_location: {
			type: String,
			trim: true,
			default: ''
		},
		primary_image: {
			type: String,
			trim: true,
			default: `/assets/images/noimage.png`
		},
		is_hotsale: {
			type: Boolean,
			default: false
		},
		images: {
			type: Array,
			default: []
		},
		category: {
			type: String,
			trim: true,
			default: ''
		},
		// Detail Vehicle

		exterior: {
			type: Array,
			default: []
		},
		guts: {
			type: Array,
			default: []
		},
		safety: {
			type: Array,
			default: []
		},
		convenience: {
			type: Array,
			default: []
		},

		// Seller

		phone_contact: {
			type: String,
			trim: true,
			default: ''
		},
		seller_name: {
			type: String,
			trim: true,
			default: ''
		},
		employee_number: {
			type: String,
			trim: true,
			default: ''
		},
		affiliated_company: {
			type: String,
			trim: true,
			default: ''
		},
		business_address: {
			type: String,
			trim: true,
			default: ''
		},
		parking_location: {
			type: String,
			trim: true,
			default: ''
		},

		performance_check: {
			type: Array,
			default: []
		},

		is_deleted: {
			type: Boolean,
			default: false
		},

		price_display: {
			type: Number,
			trim: true,
			default: 0
		},

		percentage: {
			type: Number,
			trim: true,
			default: 0
		},

		difference_price: {
			type: Number,
			trim: true,
			default: 0
		},

		is_data_crawl: {
			type: Boolean,
			default: false
		},

		source_crawl: {
			type: String,
			trim: true,
			default: 'manual',
			enum: ['https://dautomall.com', 'https://www.djauto.co.kr', 'manual']
		}
	},
	{
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at'
		}
	}
);

module.exports = mongoose.model('Car', CarSchema);
