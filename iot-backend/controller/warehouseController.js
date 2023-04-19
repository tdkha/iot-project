const warehouseDB = require('../db/warehouseDB');

const warehouseController = {
   getWareHouseInfo: async(req,res) => {
        const store_id = req.body.store_id;
        try{
            const result = await warehouseDB.viewWareHouse(store_id);
            res.status(200).json(result);
        }catch(err){
            console.log(err)
            res.status(500).send("Failed to get infomation from the warehouse");
        }
        
   }
}

module.exports = warehouseController;