const { connectToDB } = require('../utils/db');
const crawlCategory = require('./crawlCategory');

connectToDB()
	.then(async _ => {
		console.log('Mongo is running');
    await crawlCategory();
	})
	.catch(err => {
		console.log(err);
	});
