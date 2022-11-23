const CarListController = require('../../../../controller/CarListController');

const routerCars = require('express').Router();
const requireLogin = require('../../../../middleware/requireLogin');

routerCars.post('/save', CarListController.saveCarCrawl);
routerCars.post('/list', CarListController.getListCars);
routerCars.get('/list/hotsale', CarListController.getListHotsale);
routerCars.post('/detail', CarListController.getCarDetail);
routerCars.post('/update-price', requireLogin, CarListController.updatePrice);
routerCars.post('/update-hotsale', requireLogin, CarListController.updateHotsale);
routerCars.post('/create', requireLogin, CarListController.create);
routerCars.post('/edit', requireLogin, CarListController.edit);

module.exports = routerCars;
