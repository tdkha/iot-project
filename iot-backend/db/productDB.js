const {pool, getConnection} = require('./connection');

const Product = {
    //-*------------------------------------------------*-
    // <SELECT> ID FROM Product TABLE
    //-*------------------------------------------------*-
    selectProduct : async(qr_code) => {
        try{
            const [connection] =  await pool.query(`SELECT id,name,price FROM product WHERE qr_code = ?`,[qr_code])
            return connection[0]
        }catch(err){
            throw err
        }       
    },

    //-*------------------------------------------------*-
    // <SELECT> PRICE FROM Product TABLE
    //-*------------------------------------------------*-
    selectProductPrice : async(product_id) => {
        try{
            // this query is going to return Number type
            const [price] =  await pool.query(`SELECT price FROM product WHERE id = ?`,[product_id])
            return Number(price[0].price)
        }catch(err){
            throw err
        }       
    },
    selectProductType : async() =>{
        try{
            // this query is going to return Number type
            const [connection] =  await pool.execute(`select type from product
            group by type`)
            return connection
        }catch(err){
            throw err
        }      
    }
}

module.exports = Product;