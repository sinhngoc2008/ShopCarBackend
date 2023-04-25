require('dotenv').config();
const CarModel = require('../model/CarModel');
const { connectToDB } = require('../utils/db');
const fs = require('fs');
const path = require('path');

connectToDB()
	.then(async _ => {
		// await unlinkFileInServer();
	})
	.catch(err => {
		console.log(err);
	});

unlinkFileInServer = async () => {
	try {
		console.log("====================================");
		console.log("Đang lấy danh sách xe");
		const listCarDjauto = await CarModel.find({
			source_crawl: 'https://www.djauto.co.kr'
		});
		console.log(listCarDjauto.length);
		console.log("====================================");
		console.log("Đang xóa danh sách xe", listCarDjauto.length);

		if (listCarDjauto.length > 0) {
			for (let car of listCarDjauto) {
				if (car.images && car.images.length > 0) {
					for (let image of car.images) {
						await unlinkFile(image);
					}
				}
			}
		}

    await CarModel.deleteMany({
      source_crawl: 'https://www.djauto.co.kr'
    });

    console.log('====================================');
    console.log('Xóa thành công');
    console.log('====================================');
	} catch (error) {
		console.log('====================================');
		console.log('Lỗi unlink file', error.message);
		console.log('====================================');
	}
};


async function unlinkFile(filename) {
	const file = path.join(__dirname, '../public/uploads', filename);

	new Promise((resolve, reject) => {
		fs.unlink(file, err => {
			if (err) {
				reject(err);
			} else {
				resolve('success');
			}
		});
	});
}
