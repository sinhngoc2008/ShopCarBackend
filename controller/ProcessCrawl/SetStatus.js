const pm2 = require('pm2');
module.exports = async function (req, res) {
	try {
		const { status } = req.body;
		pm2.connect(function (err) {
			if (err) {
				res.status(500).json({
					message: 'Lỗi máy chủ',
					status_code: 500,
					status: false,
					error_message: error.message
				});
			}
			if (status === 'on') {
				pm2.restart('DAUTOMALL', function (err, apps) {
					if (err) {
						return res.status(500).json({
							message: 'Lỗi máy chủ',
							status_code: 500,
							status: false,
							error_message: err
						});
					}
					res.status(200).json({
						message: 'Đã khởi động thành công',
						status_code: 200,
						status: true
					});
				});
			} else {
				pm2.stop('DAUTOMALL', function (err, apps) {
					if (err) {
						return res.status(500).json({
							message: 'Lỗi máy chủ',
							status_code: 500,
							status: false,
							error_message: err
						});
					}
					res.status(200).json({
						message: 'Đã  dừng thành công',
						status_code: 200,
						status: true
					});
				});
			}
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
