const purchaseDB = require('../db/purchaseDB');
const saleDB = require('../db/saleDB');
const financeController = {
    getProfit : async( req, res) =>{
        try{
            const product_id = req.body.product_id;
            const store_id = req.body.store_id;
            const profit = await purchaseDB.getProfitPerProduct(product_id,store_id);
            res.status(200).json({"profit":profit})
        }catch(err){
            res.status(500).send("Failed to get finance information")
            console.log("Error in finance controller")
            console.log(err);
        }
    },
    getWeeklyProfit : async ( req , res ) => {
        try{
            const store_id = req.body.store_id;
            const type = req.body.type;
            const weekly_sale = await saleDB.getWeeklySale(store_id,type);
            
            const response = await Promise.all(
                weekly_sale.map( async (element) => {
                    const profitPerProduct = await purchaseDB.getProfitPerProduct(element.product_id,store_id);
                    const quantity = element. quantity;
                    const profit  = (profitPerProduct * quantity).toFixed(2);
                    return {
                        ...element,
                        profit,
                      };
                }));
            res.status(200).json(response)

        }catch(err){
            res.status(500).send("Failed to get finance information")
            console.log("Error in finance controller")
            console.log(err);
        }
    }
}

module.exports = financeController
