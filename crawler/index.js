const { connectToDB } = require('../utils/db');
const crawlCategory = require('./crawlCategory');
const crawlCars = require('./crawlCars');

const startCrawler = async () => {
	try {
		await connectToDB();
		await crawlCategory();
		// await crawlCars();
	} catch (error) {
		console.log(error);
	}
};

startCrawler();