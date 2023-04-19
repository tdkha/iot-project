const saleController = require('../controller/saleController');
const router = require("express").Router();
const verifyJWT = require('../middleware/verifyJWT');

router.post('/addsale',verifyJWT,saleController.addProduct);

module.exports= router
