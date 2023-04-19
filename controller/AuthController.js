const { jwt_conf } = require('../config');
const config = require('../config');
const { comparePassword, hashPassword } = require('../helper/hash');
const TokenModel = require('../model/TokenModel');
const UserModel = require('../model/UserModel');
const { generateAccessToken, generateRefreshToken, verifyToken } = require('../utils/jwt');

class AuthController {
	async login(req, res) {
		try {
			const { email, password } = req.body;
			const user = await UserModel.findOne({ email }).lean();
			if (!user) {
				return res.status(200).json({
					message: req.__('User not found'),
					status_code: 105
				});
			}
			const isMatch = comparePassword(password, user.password);
			if (!isMatch) {
				return res.status(200).json({
					message: req.__('Password is incorrect'),
					status_code: 106
				});
			}
			const token = generateAccessToken({ user });
			const refresh_token = generateRefreshToken({ user });

			const newToken = new TokenModel({
				token: refresh_token
			});

			await newToken.save();

			const userFind = await UserModel.findOne({ _id: user._id }, '-password').lean();

			res.status(200).json({
				message: req.__('Logged in successfully'),
				access_token: token,
				access_token_expires_in: `${config.jwt_conf.tokenLife / 60}m`,
				refresh_token,
				status_code: 200,
				user: userFind
			});
		} catch (error) {
			res.status(500).json({ message: error.message, status_code: 500 });
		}
	}

	async relogin(req, res) {
		try {
			const { refresh_token } = req.body;
			if (!refresh_token) {
				return res.status(200).json({
					message: req.__('Refresh token is required'),
					status_code: 101,
					status: false
				});
			}
			const token = await TokenModel.findOne({ token: refresh_token });
			if (!token) {
				return res.status(200).json({
					message: req.__('Refresh token is invalid'),
					status_code: 106,
					status: false
				});
			}
			const isVerifyToken = verifyToken(refresh_token, jwt_conf.refreshTokenSecret);
			if (!isVerifyToken) {
				return res.status(200).json({
					message: req.__('Refresh token is invalid'),
					status_code: 106,
					status: false
				});
			}

			const newToken = generateAccessToken({ user: isVerifyToken.user });
			const newRefreshToken = generateRefreshToken({ user: isVerifyToken.user });

			const newRefreshTokenSave = new TokenModel({
				token: newRefreshToken
			});
			await TokenModel.findOneAndRemove({ token: token.token });
			await newRefreshTokenSave.save();

			res.status(200).json({
				message: req.__('Relogin in successfully'),
				access_token: newToken,
				access_token_expires_in: `${config.jwt_conf.tokenLife / 60}m`,
				refresh_token: newRefreshToken,
				status: true,
				status_code: 200
			});
		} catch (error) {
			res.status(500).json({
				error_message: req.__('Server error'),
				message: error.message,
				status_code: 500
			});
		}
	}

	async infor(req, res) {
		try {
			let token = req.headers.authorization.split(' ')[1];
			const isVerifyToken = verifyToken(token, jwt_conf.secret);
			if (!isVerifyToken) {
				return res.status(200).json({
					message: req.__('Token is invalid'),
					status_code: 106,
					status: false
				});
			}
			const user = await UserModel.findOne(
				{ email: isVerifyToken.user.email },
				'-password'
			).lean();
			if (!user) {
				return res.status(200).json({
					message: req.__('User not found'),
					status_code: 105,
					status: false
				});
			}

			res.status(200).json({
				message: req.__('Get user infor successfully'),
				data: user,
				status: true,
				status_code: 200
			});
		} catch (error) {
			res.status(500).json({
				message: req.__('Server error'),
				error_message: error.message,
				status_code: 500
			});
		}
	}

	async update(req, res) {
		try {
			const {
				phone,
				address,
				fullname,
				dob,
				gender,
				email_noti,
				link_zalo,
				link_kakao,
				link_facebook,
				link_linkedin,
				company_address,
				company_name,
				company_map,
				link_messenger
			} = req.body;

			let token = req.headers.authorization.split(' ')[1];
			const isVerifyToken = verifyToken(token, jwt_conf.secret);
			if (!isVerifyToken) {
				return res.status(200).json({
					message: req.__('Token is invalid'),
					status_code: 106,
					status: false
				});
			}

			const user = await UserModel.findOne({ email: isVerifyToken.user.email }).lean();
			if (!user) {
				return res.status(200).json({
					message: req.__('User not found'),
					status_code: 105,
					status: false
				});
			}

			await UserModel.findByIdAndUpdate(user._id, {
				phone_number: phone,
				address,
				name: fullname,
				dob,
				email_notification: email_noti,
				gender,
				link_zalo,
				link_kakao,
				link_facebook,
				link_linkedin,
				company_address,
				company_name,
				company_map,
				link_messenger
			});

			res.status(200).json({
				message: req.__('Update user infor successfully'),
				status: true,
				status_code: 200
			});
		} catch (error) {
			res.status(500).json({
				message: req.__('Server error'),
				error_message: error.message,
				status_code: 500
			});
		}
	}

	async changePassword(req, res) {
		try {
			const { old_password, new_password } = req.body;

			let token = req.headers.authorization.split(' ')[1];
			const isVerifyToken = verifyToken(token, jwt_conf.secret);
			if (!isVerifyToken) {
				return res.status(200).json({
					message: req.__('Token is invalid'),
					status_code: 106,
					status: false
				});
			}

			const user = await UserModel.findOne({ email: isVerifyToken.user.email }).lean();
			if (!user) {
				return res.status(200).json({
					message: req.__('User not found'),
					status_code: 105,
					status: false
				});
			}

			if (new_password && new_password.length < 6) {
				return res.status(200).json({
					message: req.__('Password must be at least 6 characters'),
					status_code: 101,
					status: false
				});
			}

			const isMatch = comparePassword(old_password, user.password);
			if (!isMatch) {
				return res.status(200).json({
					message: req.__('Old password is incorrect'),
					status_code: 107,
					status: false
				});
			}

			const hash = hashPassword(new_password);

			await UserModel.findByIdAndUpdate(user._id, {
				password: hash
			});

			res.status(200).json({
				message: req.__('Change password successfully'),
				status: true,
				status_code: 200
			});
		} catch (error) {
			res.status(500).json({
				message: req.__('Server error'),
				error_message: error.message,
				status_code: 500
			});
		}
	}

	async infoPublic(req, res) {
		try {
			const user = await UserModel.findOne({ root_user: true }, '-password').lean();
			if (!user) {
				return res.status(200).json({
					message: req.__('User not found'),
					status_code: 105,
					status: false
				});
			}

			res.status(200).json({
				message: req.__('Get user infor successfully'),
				data: user,
				status: true,
				status_code: 200
			});
		} catch (error) {
			res.status(500).json({
				message: req.__('Server error'),
				error_message: error.message,
				status_code: 500
			});
		}
	}
}

module.exports = new AuthController();
