const { translate } = require('@vitalets/google-translate-api');

const translateText = async (text, lang) => {
	try {
		const result = await translate(text, { to: 'ko' });
		return result.text;
	} catch (error) {
		console.log(error);
	}
};

module.exports = translateText;