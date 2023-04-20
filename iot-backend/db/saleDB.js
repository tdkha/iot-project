const {pool, getConnection} = require('./connection')

const saleDB = {
    addSale : async(bankCardNumber,productInfo,employee_id,store_name) => {
        const product_id = productInfo.product_id;
        const quantity = productInfo.quantity;
        const price = productInfo.price;
        const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        try{
            const [connection] = await pool.query(`
                INSERT INTO sale (
                    bank_id,
                    product_id,
                    quantity,
                    price,
                    employee_id,
                    store_id,
                    date
                )
                VALUES ((SELECT id FROM bank_card WHERE card_number = ?),?,?,?,?,(SELECT id from store where name = ?),?)

            `,[bankCardNumber,product_id,quantity,price,employee_id,store_name,date]);
            return connection[0];
        }catch(err){
            console.log("Error in SaleDB");
            throw err;
        }
    },
    getWeeklySale : async(store_id,type) => {
        
        const currentDate = new Date();
        const weekStartDate = new Date(currentDate);
        weekStartDate.setDate(currentDate.getDate() - 7);

        const currentDateString = currentDate.toISOString().slice(0, 19).replace('T', ' ');
        const weekStartDateString = weekStartDate.toISOString().slice(0, 19).replace('T', ' '); 
        try{
            if(type == 'All'){
                const [connection] = await pool.execute( `
                SELECT product_id , (select name from product where id = product_id)as 'product_name', sum(quantity)as 'quantity' ,product.type,sale.date 
                    FROM sale
                    JOIN product ON product.id = sale.product_id
                    WHERE (date between ? and ?) 
                    AND store_id = ?
                    GROUP BY product_id
                    ORDER BY date asc;
            `,[weekStartDateString,currentDateString,store_id]);
                return connection;
            }else{
                const [connection] = await pool.execute( `
                SELECT product_id , (select name from product where id = product_id)as 'product_name', sum(quantity)as 'quantity' ,product.type, sale.date 
                    FROM sale
                    JOIN product ON product.id = sale.product_id
                    WHERE (date between ? and ?) 
                    AND store_id = ?
                    AND product.type = ?
                    GROUP BY product_id
                    ORDER BY date asc;
            `,[ weekStartDateString, currentDateString, store_id, type]);
            return connection;
            }
            
        }catch(err){
            console.log("Error in SaleDB");
            throw err;
        }
    }

};

module.exports = saleDB;