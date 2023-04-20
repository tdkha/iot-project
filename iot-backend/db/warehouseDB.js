const { pool, connection } = require('./connection');

const warehouseDB = {
    viewWareHouse: async(store_id) => {
        const [ connection ]= await  pool.execute(
            `
            SELECT t2.name , (SELECT name FROM supplier WHERE id = t1.supplier_id) AS "supplier_name",t2.price , t1.quantity 
            FROM warehouse t1
            JOIN product t2
            ON t1.product_id = t2.id
            WHERE t1.store_id = ?
            `
        ,[store_id]);
        return connection;
    },
    modifyWareHouse : async(product_id , quantity) => {
        const [connection] = await pool.query(
            `
            UPDATE warehouse
            SET quantity = quantity - ?
            WHERE product_id = ?
            `
        ,[quantity,product_id]);
        return connection[0]
    }

}

module.exports = warehouseDB;