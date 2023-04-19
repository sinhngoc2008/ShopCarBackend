const SaleController = require('../../../../controller/SaleController');
const requireLogin = require('../../../../middleware/requireLogin');

const router = require('express').Router();

router.post('/settings', requireLogin, SaleController.setSale);
router.post('/status', requireLogin, SaleController.getSale);
router.post('/status-all', requireLogin, SaleController.getListSale);

module.exports = router;
