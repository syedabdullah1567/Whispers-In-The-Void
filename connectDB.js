//const sql = require("msnodesqlv8");
//const connectionString = "server=localhost;Database={Whispers of the Void};Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}"
//const query = "SELECT * FROM Entities"

//sql.query(connectionString, query, (err, rows) => {
//  console.log(rows);
//});

// Change this line:
const sql = require('mssql');

const config = {
  user: 'sa',
  password: 'Sa*3008*05',
  server: 'localhost',
  database: 'Whispers of the Void',
  port: 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true // This is often required for modern MSSQL drivers
  },
};

async function runTest() {
  try {
    // With 'mssql' installed, this function now exists
    let pool = await sql.connect(config);
    console.log("✅ Connected to MS SQL in Docker!");

    let result = await pool.request().query("SELECT TOP 1 * FROM Entities");
    console.dir(result.recordset); // .recordset gives you the actual data rows

    await sql.close();
  } catch (err) {
    console.error("❌ Connection failed:", err.message);
  }
}

runTest();
