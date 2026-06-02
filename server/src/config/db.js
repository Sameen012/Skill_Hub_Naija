const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const parseDatabaseUrl = (databaseUrl) => {
    if (!databaseUrl) {
        return null;
    }

    try {
        const parsedUrl = new URL(databaseUrl);

        return {
            host: parsedUrl.hostname,
            port: parsedUrl.port ? Number(parsedUrl.port) : 3306,
            user: decodeURIComponent(parsedUrl.username),
            password: decodeURIComponent(parsedUrl.password),
            database: parsedUrl.pathname.replace(/^\//, ''),
        };
    } catch (error) {
        console.warn('⚠️ Invalid DATABASE_URL provided, falling back to legacy DB_* env vars');
        return null;
    }
};

const databaseConfig = parseDatabaseUrl(process.env.DATABASE_URL) || {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'skillhub_db',
};

const pool = mysql.createPool({
    ...databaseConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true,
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
        console.log(`✅ Connected to MySQL Database at ${databaseConfig.host}`);
        conn.release();
    })
    .catch(err => {
        console.error('❌ MySQL Connection Failed:', err.message);
    });

module.exports = pool;