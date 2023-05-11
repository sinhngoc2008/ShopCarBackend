const CategoryCarsModel = require('../../model/CategoryCarModel');
module.exports = async function (req, res) {
	try {
		const { category_id } = req.body;
		if (!category_id)
			return res.status(200).json({
				message: req.__('Category not found'),
				status_code: 101,
				status: false
			});
		const category = await CategoryCarsModel.findOne({
			category_id
		});
		if (!category) {
			return res.status(200).json({
				message: req.__('Category not found'),
				status_code: 101,
				status: false
			});
		}

		res.status(200).json({
			message: 'Lấy chi tiết thành công',
			data: category,
			status_code: 200,
			status: true
		});
	} catch (error) {
		res.status(500).json({
			message: 'Lỗi máy chủ',
			status_code: 500,
			status: false,
			error_message: error.message
		});
	}
};
