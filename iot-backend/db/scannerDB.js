const {pool, getConnection} = require('./connection');

const Scanner = {
    selectStateScanner : async(scanner_name,store_name) => {
        try{
            const [connection] =  await pool.query(
                `SELECT isUsed FROM scanners 
                    WHERE name = ?
                    AND store_id = (SELECT id from store where name = ?)
                    `,[scanner_name,store_name])
            return connection[0]
        }catch(err){
            console.log("Error in DB while retrieving 'isUsed' data from SCANNER table")
            throw err
        }       
    },
    selectScanner : async(scanner_name,store_name) => {
        try{
            const [connection] =  await pool.query(`
            UPDATE scanners 
                SET isUsed= true 
                WHERE name = ?
                AND   store_id = (SELECT id from store where name = ?)  
            `,[scanner_name,store_name])
            return connection[0]
        }catch(err){
            console.log("Error in DB while updating 'isUsed' to true from SCANNER table")
            throw err
        }       
    },
    deselectScanner : async(scanner_name,store_name) => {
        try{
            const [connection] =  await pool.query(`UPDATE scanners 
            SET isUsed= false 
            WHERE name = ?
            AND   store_id = (SELECT id from store where name = ?) `,[scanner_name,store_name])
            return connection[0]
        }catch(err){
            console.log("Error in DB while updating 'isUsed' to false from SCANNER table")
            throw err
        }       
    },
    selectScannerName : async(scanner_id) =>{
        try{
            const [connection] =  await pool.query(`
            SELECT name FROM scanners 
            WHERE id = ?
           `,[scanner_id])
            return connection[0]
        }catch(err){
            console.log("Error in DB while selecting 'name' from SCANNER table")
            throw err
        }    
    },
    getScannerInfo : async(store_id) => {
        try{
            const [connection] =  await pool.execute(`
            SELECT name,isUsed,(SELECT name FROM store WHERE id = ?)as store_name  FROM scanners 
           `,[store_id])
            return connection
        }catch(err){
            console.log("Error in DB while selecting 'name' from SCANNER table")
            throw err
        }   
    }

}

module.exports = Scanner;