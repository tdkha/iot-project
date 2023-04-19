const authController = require('../controller/authController');
const router = require("express").Router();

// LOG IN 
//-*------------------------------------------------*-
router.post('/login',authController.loginUser);
//-*------------------------------------------------*-

// REFRESH TOKEN
//-*------------------------------------------------*-
router.get('/refreshtoken',authController.requestRefreshToken)
//-*------------------------------------------------*-
module.exports = router;