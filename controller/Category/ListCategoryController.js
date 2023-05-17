const CategoryCarsModel = require('../../model/CategoryCarModel');

module.exports = async (req, res) => {
	try {
		const listCategory = await CategoryCarsModel.find().sort({
			car_count: -1
		}).lean();
		res.status(200).json({
			message: 'Lấy danh sách thành công',
			data: listCategory,
			status_code: 200,
			status: true
		});
	} catch (error) {
		res.status(500).json({
			message: 'Lỗi máy chủ',
			status_code: 500,
			status: false
		});
	}
};
