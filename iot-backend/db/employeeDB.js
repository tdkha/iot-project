const {pool, getConnection} = require('./connection');

const Employee = {
    //-*------------------------------------------------*-
    // <SELECT> ID FROM Employee TABLE
    //-*------------------------------------------------*-
    selectUserID : async(username) => {
        try{
            const [connection] =  await pool.query(`SELECT id FROM employee WHERE username = ?`,[username])
            return connection[0]
        }catch(err){
            throw err
        }     
    },
    //-*------------------------------------------------*-
    // <SELECT> ID FROM Employee TABLE
    //-*------------------------------------------------*-
    selectUserPWD : async(username) => {
        try{
            const [connection] =  await pool.query(`SELECT password FROM employee WHERE username = ?`,[username])
            return connection[0]
        }catch(err){
            throw err
        }    
    },
    //-*------------------------------------------------*-
    // <SELECT> id,username,pwd FROM Employee TABLE
    //-*------------------------------------------------*-
    selectUser : async(username ) => {
        try{
            const [connection] =  await pool.query(`SELECT id,username,first_name, last_name,work_at_store_id FROM employee WHERE username = ?`,[username])
            return connection[0]
        }catch(err){
            throw err
        }  
    },
}

module.exports = Employee;