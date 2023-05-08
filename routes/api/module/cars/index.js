const CarListController = require('../../../../controller/CarListController');
const SaveDautomallController = require('../../../../controller/Cars/SaveDautomallController');

const routerCars = require('express').Router();
const requireLogin = require('../../../../middleware/requireLogin');

routerCars.post('/save', CarListController.saveCarCrawl);
routerCars.post('/save-dautomall', SaveDautomallController);
routerCars.post('/list', CarListController.getListCars);
routerCars.get('/list/hotsale', CarListController.getListHotsale);
routerCars.post('/detail', CarListController.getCarDetail);
routerCars.post('/update-price', requireLogin, CarListController.updatePrice);
routerCars.post('/update-hotsale', requireLogin, CarListController.updateHotsale);
routerCars.post('/create', CarListController.create);
routerCars.post('/edit', requireLogin, CarListController.edit);
routerCars.post('/remove', requireLogin, CarListController.delete);

module.exports = routerCars;
