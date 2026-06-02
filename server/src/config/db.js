const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'skillhub_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    typeCast(field, next) {
        if (field.type === 'JSON') {
            try {
                return JSON.parse(field.string());
            } catch (error) {
                return field.string();
            }
        }
        return next();
    }
});

pool.getConnection()
    .then(conn => {
        console.log('✅ Connected to XAMPP MySQL Database');
        conn.release();
    })
    .catch(err => {
        console.error('❌ XAMPP Connection Failed:', err.message);
    });

module.exports = pool;