module.exports = text => {
	const pattern = /\d+/;

	const match = text.match(pattern);
	if (match) {
		const number = match[0];
		return number;
	}
	return 0;
};
