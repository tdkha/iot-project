const {pool, getConnection} = require('./connection');

const refreshToken = {
    //-*------------------------------------------------*-
    // <UPDATE> ID FROM Employee TABLE
    //-*------------------------------------------------*-
    updateRefreshToken : async(employee_id , token) => {
        try{
            const [connection] =  await pool.query(
                `UPDATE refresh_token 
                    SET token = ?
                    WHERE employee_id = ?`
                ,[token,employee_id])
            return connection[0]
        }catch(err){
            throw err
        }       
    },
    //-*------------------------------------------------*-
    // <SELECT> id,username,pwd FROM Employee TABLE
    //-*------------------------------------------------*-
    selectRefreshToken : async(employee_id) => {
        try{
            const [connection] =  await pool.query(`SELECT token FROM refresh_token WHERE employee_id = ?`,[employee_id])
            return connection
        }catch(err){
            throw err
        }       
    },
    //-*------------------------------------------------*-
    // <INSERT> id,username,pwd FROM Employee TABLE
    //-*------------------------------------------------*-
    insertRefreshToken : async(employee_id,token) => {
        try{
            const [connection] =  await pool.query(`INSERT INTO refresh_token(employee_id,token) VALUES(?,?)`,[employee_id,token])
            return connection
        }catch(err){
            throw err
        }       
    },
    deleteRefreshToken : async (employee_id) => {
        try{
            const [connection] = await pool.query(`
                UPDATE refresh_token
                SET token = ' '
                Where employee_id = ?
            `,[employee_id])
            return connection;
        }catch(err){
            throw err
        }
    },
    selectUserIdByToken : async ( token) => {
        try{
            const [connection] =  await pool.query(`SELECT employee_id FROM refresh_token WHERE token = ?`,[token])
            return connection[0]
        }catch(err){
            console.log(err)
        } 
    }
}

module.exports = refreshToken;