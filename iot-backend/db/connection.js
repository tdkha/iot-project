// get the client
const mysql = require('mysql2/promise');
const fs = require('fs');

const pool = mysql.createPool({
    host: 'lab-supermarket.mysql.database.azure.com',
    user: 'tdkha',
    password: 'KhaGa123',
    database: 'supermarket',
    port:3306,
    ssl: {ca: fs.readFileSync("DigiCertGlobalRootCA.crt.pem")},
    waitForConnections: true,
    connectionLimit: 10,
    dateStrings: true
});

async function getConnection() {
    const connection = await pool.getConnection();
    return connection;
}
async function closeConnection() {
    const end = pool.end();
    return end;
}

module.exports = { pool, getConnection , closeConnection};