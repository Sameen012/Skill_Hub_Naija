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
    // Some hosts may already have parts of the schema (indexes/constraints).
    // If the error is a duplicate-key/index type, treat init as successful.
    const msg = (err && err.message) || '';
    if (msg.includes('Duplicate key name') || msg.includes('ER_DUP_KEYNAME') || msg.includes('Duplicate entry')) {
      console.warn('⚠️ DB Init warning (non-fatal):', msg);
      process.exit(0);
    }

    console.error('❌ DB Init Failed:', err.message);
    process.exit(1);
  }
};

initDB();