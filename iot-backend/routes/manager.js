const router = require('express').Router();
const warehouseController = require('../controller/warehouseController');
const financeController = require('../controller/financeController');
const verifyJWT = require('../middleware/verifyJWT')

router.post('/warehouseinfo',verifyJWT,warehouseController.getWareHouseInfo);

router.post('/retail-price',financeController.getProfit)

router.post('/get-weekly-profit',financeController.getWeeklyProfit);
module.exports = router;