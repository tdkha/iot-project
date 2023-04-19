const {pool, getConnection} = require('./connection');

const purchaseDB = {
    getRetailPrice : async (product_id,store_id) => {
        try{
            const [connection] =  await pool.query(`
                SELECT product_id , 
                    (select name from product where id = ?) as 'product_name' , 
                    (purchase.price/purchase.quantity) as 'retail_price', product.price AS 'market_price'
                    FROM purchase 
                    JOIN product ON purchase.product_id = product.id
                    WHERE product_id = ?
                    AND store_id = ?
            `,[product_id,product_id,store_id])
            return connection[0]
        }catch(err){
            throw err
        }   
    },
    getProfitPerProduct : async(product_id,store_id) => {
        try{
            const {market_price,retail_price} = await purchaseDB.getRetailPrice(product_id,store_id);
            const profit = Number(market_price) - Number(retail_price);
            return profit
        }catch(err){
            throw err
        }  
    }
}
module.exports = purchaseDB;