const scannerDB = require('../db/scannerDB')

const scannerController = {
    selectScanner : async(req, res) => {
        const scanner_name = req.body.scanner_name;
        const store_name= req.body.store_name
        try{
            const state =  await scannerDB.selectStateScanner(scanner_name,store_name)
            if(state.isUsed !== 0){
                throw err
            }else{
                const result = await scannerDB.selectScanner(scanner_name,store_name)
                res.status(200).send(result);
            }
        }catch(err){
            console.log("Error in scanner controller while retrieving from DB")
            res.status(500).send("This scanner is used by your colleague. Please use another one");
        }       
    },
    deselectScanner: async(req, res) => {
        const scanner_name = req.body.scanner_name;
        const store_name= req.body.store_name;
        try{
            const state =  await scannerDB.selectStateScanner(scanner_name,store_name)
            if(state.isUsed !== 1){
                throw err
            }else{
                const result = await scannerDB.deselectScanner(scanner_name,store_name)
                res.status(200).send(result);
            } 
        }catch(err){
            console.log(err)
            res.status(500).send("Failed")
        }       
    },
    getScannerInfo: async(req, res) => {
        const store_id = req.body.store_id;
        try{
            const data = await scannerDB.getScannerInfo(store_id);
            res.status(200).json(data)
        }catch(err){
            console.log(err);
            res.status(500).send("Failed to get info of all scanner")
        }
    },
}

module.exports = scannerController;