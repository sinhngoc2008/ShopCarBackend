const SetStatus = require('../../controller/ProcessCrawl/SetStatus');
const StatusController = require('../../controller/ProcessCrawl/StatusController');
const requireLogin = require('../../middleware/requireLogin');

const routerApi = require('express').Router();

routerApi.get('/', (req, res) => {
	res.json({
		message: req.__('API_WORKING')
	});
});
routerApi.use('/cars', require('./module/cars'));
routerApi.use('/upload', require('./module/uploads'));
routerApi.use('/staff', require('./module/staff'));
routerApi.use('/category', require('./module/category'));
routerApi.use('/review', require('./module/review'));
routerApi.use('/auth', require('./module/auth'));
routerApi.use('/support', require('./module/support'));
routerApi.use('/filter', require('./module/filter_list'));
routerApi.use('/home', require('./module/home'));
routerApi.use('/file', requireLogin, require('./module/file'));
routerApi.use('/policy', require('./module/policy'));
routerApi.use('/insurance', require('./module/insurance'));
routerApi.use('/sale', require('./module/sale'));
routerApi.get('/process/status', StatusController);
routerApi.post('/process/set-status', SetStatus);

module.exports = routerApi;
