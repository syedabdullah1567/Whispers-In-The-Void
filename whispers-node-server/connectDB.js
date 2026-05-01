const sql = require('mssql');

const config = {
  user: 'sa',
  password: '3*IdioticIdiots*',
  server: 'localhost',
  database: 'Whispers in the Void',
  port: 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true
  },
};

const poolPromise = new sql.ConnectionPool(config)
.connect()
.then(pool => {
  console.log("✅ Connected to MS SQL in Docker!");
  return pool;
})
.catch(err => {
  console.error("❌ Connection failed:", err.message);
  throw err;
});

module.exports = {
  sql,
  poolPromise
};