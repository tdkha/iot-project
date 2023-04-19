const {pool, getConnection} = require('./connection');

const Role = {
    //-*------------------------------------------------*-
    // <SELECT> ID FROM Employee TABLE
    //-*------------------------------------------------*-
    selectRole : async(employee_id) => {
        try{
            const [connection] =  await pool.query(`SELECT role FROM role WHERE employee_id = ?`,[employee_id])
            return connection[0]
        }catch(err){
            throw err
        }     
    },
    executeSelectRole : async(employee_id) => {
        try{
            const [rows, fields] =  await pool.execute(`SELECT role FROM role WHERE employee_id = ?`,[employee_id])
            return rows
        }catch(err){
            throw err
        }     
    }
}

module.exports = Role;