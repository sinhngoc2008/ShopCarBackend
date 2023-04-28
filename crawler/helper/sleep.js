function sleep(seconds) {
	return new Promise((resolve, reject) => setTimeout(resolve, seconds));
}

module.exports = sleep;
