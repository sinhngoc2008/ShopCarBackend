const checkArray = require('../../helper/checkArray');
const CarModel = require('../../model/CarModel');
const CategoryCarsModel = require('../../model/CategoryCarModel');
const fs = require('fs');
const path = require('path');
module.exports = async (req, res) => {
	const { category_id } = req.body;
	try {
		const category = await CategoryCarsModel.findOne({
			_id: category_id
		});
		if (!category) {
			return res.status(200).json({
				message: req.__('Category not found'),
				status_code: 101,
				status: false
			});
		}

		const hasCarInCategory = await CarModel.find({
			category_name: category.category_name
		});

		if (hasCarInCategory.length > 0) {
			return res.status(200).json({
				message: req.__('Category has car'),
				status_code: 101,
				status: false
			});
		}

		await CategoryCarsModel.deleteOne({ _id: category_id });

		const file = path.join(__dirname, '/public/uploads', category.image);
		if (category.image !== '/assets/images/noimage.png') {
			fs.unlinkSync(file);
		}

		res.status(200).json({
			message: req.__('Delete category success'),
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
