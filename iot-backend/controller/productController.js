const scannerDB = require('../db/scannerDB');
const productDB = require('../db/productDB');
const productController = {
    addProduct : async(req, res) => {
        const qr_code = req.body.qr_code;
        const scanner_id = req.body.scanner_id;
        const {name} = await scannerDB.selectScannerName(scanner_id);
        const io = req.app.get('io'); // The req.app property holds the reference to the instance of the Express application that is using the middleware. 
        try{
            const result =  await productDB.selectProduct(qr_code)
            if(result){
                //console.log(`cashier_${name}`)
                let reformattedResult = {...result,"price":Number(result.price),quantity:1}
                await io.to(`cashier_${name}`).emit('product_added', {name,"product":reformattedResult});
                res.status(200).json(reformattedResult);
            }
            
        }catch(err){
            console.log("Error in product controller")
            console.log(err)
            res.status(500).send("Failed to add this product");
        }       
    },
    getProductType : async( req , res ) => {
        try{
            const response = await productDB.selectProductType();
            const product_types = response.map( element => element.type)
            res.status(200).json(product_types)
        }catch(err){
            console.log("Error in product controller")
            console.log(err)
            res.status(500).send("Failed to fetch product types");
        }
    }
}

module.exports = productController;