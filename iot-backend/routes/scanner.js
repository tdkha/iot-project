const router = require("express").Router();
const scannerController = require('../controller/scannerController')
const verifyJWT = require('../middleware/verifyJWT');


//-*------------------------------------------------*-
// Update the state of scanner whether being used or not
//-*------------------------------------------------*-
router.post('/scanner-state-true',verifyJWT,scannerController.selectScanner);
router.post('/scanner-state-false',verifyJWT,scannerController.deselectScanner);

router.post('/getscannerinfo',verifyJWT,scannerController.getScannerInfo);
module.exports = router;