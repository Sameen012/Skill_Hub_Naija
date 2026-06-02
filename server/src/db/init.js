const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

const initDB = async () => {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    const queries = schemaSql.split(';').filter(query => query.trim().length > 0);

    for (const query of queries) {
      await pool.query(query);
    }

    console.log('✅ Database Tables Initialized Successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to Init DB:', err);
    process.exit(1);
  }
};

initDB();