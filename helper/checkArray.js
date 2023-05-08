module.exports = array => {
	if (Array.isArray(array) && array.length) {
		return true;
	}
	return false;
};
