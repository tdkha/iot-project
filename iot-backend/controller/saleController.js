const saleDB = require('../db/saleDB');
const warehouseDB = require('../db/warehouseDB');

const saleController = {
    addProduct : async(req, res) => {
        // variables for inserting data into Sale DB
        const bankCardNumber = req.body.card_number;
        const productInfo = req.body.product_info;
        const employee_id = req.body.employee_id;
        const store_name =req.body.store_name;

        // variables for ypdating data to Warehouse DB
        const product_id = productInfo.product_id;
        const quantity = productInfo.quantity;

        try{
            const sale_query = await saleDB.addSale(bankCardNumber,productInfo,employee_id,store_name);
            const warehouse_quey = await warehouseDB.modifyWareHouse(product_id,quantity);
            res.status(200).send("Successfully Paid");    
        }catch(err){
            console.log("Error in sale controller")
            console.log(err)
            res.status(500).send("Failed to pay");
        }       
    },
}

module.exports = saleController;