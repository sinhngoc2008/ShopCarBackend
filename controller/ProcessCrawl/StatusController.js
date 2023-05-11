const pm2 = require('pm2');

module.exports = async function (req, res) {
	try {
		pm2.connect(function (err) {
			if (err) {
				return res.status(500).json({
					message: 'Lỗi máy chủ',
					status_code: 500,
					status: false,
					error_message: err
				});
			}

			pm2.list(function (err, list) {
				if (err) {
					return res.status(500).json({
						message: 'Lỗi máy chủ',
						status_code: 500,
						status: false,
						error_message: err
					});
				}
        let ls = list.filter(item => item.name === 'DAUTOMALL');
        ls = ls.map(item => {
          return {
            name: item.name,
            pid: item.pid,
            status: item.pm2_env.status,
          }
        });
				res.status(200).json({
					message: 'Lấy danh sách thành công',
					data: ls,
					status_code: 200,
					status: true
				});
			});
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
