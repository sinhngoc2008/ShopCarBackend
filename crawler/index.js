const { connectToDB } = require('../utils/db');
const crawlCategory = require('./crawlCategory');
const crawlCars = require('./crawlCars');
const cron = require('node-cron');
const startCrawler = async () => {
	try {
		await connectToDB();
		await crawlCategory();
		// await crawlCars();
	} catch (error) {
		console.log(error);
	}
};

/*
* 0 0 0 * * *  Everyday at 00:00:00

*/

startCrawler();

cron.schedule('0 0 0 * * *', async () => {
	try {
		await startCrawler();
	} catch (error) {
		console.log(error.message);
	}
});
