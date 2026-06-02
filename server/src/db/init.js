const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

const initDB = async () => {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    await pool.query(schemaSql);

    console.log('✅ Database Initialized Successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ DB Init Failed:', err.message);
    process.exit(1);
  }
};

initDB();