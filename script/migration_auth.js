require('dotenv').config();
const { hashPassword } = require('../helper/hash');
const UserModel = require('../model/UserModel');
const { connectToDB } = require('../utils/db');

connectToDB()
	.then(async _ => {
		await MigrationAuth();
	})
	.catch(err => {
		console.log(err);
	});
async function MigrationAuth() {
	console.log('Migration is running');
	try {
		const auth = {
			email: process.env.ADMIN_EMAIL || 'thangld2407@gmail.com',
			password: '123456'
		};
		console.log('Đang tìm kiếm user');
		const hasUser = await UserModel.findOne({ email: auth.email });
		if (!hasUser) {
			console.log('Khởi tạo người dùng mới');
			const newData = new UserModel({
				email: auth.email,
				password: hashPassword(auth.password),
				root_user: true,
				email_notification: process.env.ADMIN_EMAIL || 'thangld2407@gmail.com',
				company_address: '161 Sajik-ro, Sejongno, Jongno-gu, Seoul, Hàn Quốc',
				company_name: 'VT AUTO - Ô TÔ HÀN VIỆT',
				company_map: 'https://goo.gl/maps/zcSQjTcCUSj25PSq8'
			});
			console.log('Đang lưu thông tin người dùng');
			await newData.save();
			console.log('Đã lưu thông tin người dùng');
		} else {
			console.log('Thông tin đã được lưu');
		}
		process.exit(0);
	} catch (error) {
		console.log(error);
	}
}
