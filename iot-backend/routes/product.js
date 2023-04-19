const router = require("express").Router();
const productController = require('../controller/productController')

//-*------------------------------------------------*-
// ADD ONE PRODUCT FROM SCANNER TO SERVER
//-*------------------------------------------------*-
router.post('/addproduct',productController.addProduct);

router.get('/get-product-type',productController.getProductType);
module.exports = router;