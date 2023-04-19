// get the client
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'KhaGa123',
    database: 'supermarket',
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