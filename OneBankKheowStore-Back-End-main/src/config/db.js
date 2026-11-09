const mySQL = require('mysql2');
require('dotenv').config();

// Create connection pool with retry resilience
const pool = mySQL.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'itcs223_store',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection and retry if DB is still starting up
function checkConnection(retries = 15, delayMs = 3000) {
    pool.getConnection((err, conn) => {
        if (err) {
            console.log(`Waiting for database connection... (${err.message})`);
            if (retries > 0) {
                setTimeout(() => checkConnection(retries - 1, delayMs), delayMs);
            } else {
                console.error("Could not connect to database after retries. Check DB credentials or container status.");
            }
        } else {
            console.log(`Connected DB: ${process.env.DB_NAME || 'itcs223_store'}`);
            conn.release();
        }
    });
}

checkConnection();

module.exports = pool;
