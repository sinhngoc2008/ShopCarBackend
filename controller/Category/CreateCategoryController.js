const checkArray = require('../../helper/checkArray');
const CategoryCarsModel = require('../../model/CategoryCarModel');

module.exports = async (req, res) => {
	const { category_name, category_detail, image } = req.body;
	try {
		const category = await CategoryCarsModel.findOne({
			category_name
		});
		if (category) {
			return res.status(200).json({
				message: req.__('Category already exists'),
				status_code: 101,
				status: false
			});
		}

		const newCategory = new CategoryCarsModel({
			category_name,
			category_detail,
			image
		});

		await newCategory.save();
		res.status(200).json({
			message: req.__('Create category success'),
			data: newCategory,
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
