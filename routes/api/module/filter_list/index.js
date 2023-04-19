const FilterListController = require('../../../../controller/FilterListController');

const router = require('express').Router();

router.get('/driven-distance', FilterListController.get_distance_driven);
router.get('/fuel-type', FilterListController.get_fuel_type);
router.get('/gearbox', FilterListController.get_gear_box);
router.get('/color', FilterListController.get_color);
router.get('/category', FilterListController.get_category);
router.get('/cartype', FilterListController.get_car_type);
router.get('/price', FilterListController.get_price);
router.get('/model', FilterListController.get_model);

module.exports = router;
