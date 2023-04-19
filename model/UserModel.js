const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true
		},
		password: {
			type: String,
			required: true,
			trim: true
		},
		name: {
			type: String,
			trim: true,
			default: 'Adminstrator'
		},
		dob: {
			type: String,
			trim: true,
			default: new Date().toLocaleDateString()
		},
		phone_number: {
			type: String,
			trim: true,
			default: ''
		},
		root_user: {
			type: Boolean,
			default: false
		},
		gender: {
			type: String,
			trim: true,
			enum: ['male', 'female'],
			default: 'male'
		},
		email_notification: {
			type: String,
			trim: true,
			default: process.env.ADMIN_EMAIL || 'thangld2407@gmail.com'
		},
		company_name: {
			type: String,
			trim: true,
			default: ''
		},
		company_address: {
			type: String,
			trim: true,
			default: ''
		},
		company_map: {
			type: String,
			trim: true,
			default: ''
		},
		link_facebook: {
			type: String,
			trim: true,
			default: ''
		},
		link_kakao: {
			type: String,
			trim: true,
			default: ''
		},
		link_linkedin: {
			type: String,
			trim: true,
			default: ''
		},
		link_zalo: {
			type: String,
			trim: true,
			default: ''
		},
		link_messenger: {
			type: String,
			trim: true,
			default: ''
		}
	},
	{
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at'
		}
	}
);

module.exports = mongoose.model('User', UserSchema);
