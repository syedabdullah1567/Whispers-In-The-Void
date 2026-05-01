const sql = require('mssql');

const config = {
  user: 'sa',
  password: 'SqlPass123!',
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

// async function runTest() {
//   try {
//     // With 'mssql' installed, this function now exists
//     let pool = await sql.connect(config);
//     console.log("✅ Connected to MS SQL in Docker!");

//     let result = await pool.request().query("SELECT TOP 1 * FROM Entities");
//     console.dir(result.recordset); // .recordset gives you the actual data rows

//     await sql.close();
//   } catch (err) {
//     console.error("❌ Connection failed:", err.message);
//   }
// }

//runTest();
