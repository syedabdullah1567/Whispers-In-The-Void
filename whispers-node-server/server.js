const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sql, poolPromise } = require('./connectDB.js');

const app = express();
app.use(bodyParser.json());
app.use(cors());
const PORT = 3000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

app.get("/api/hunters", async(req, res) => {
    try{
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT TOP 10 * FROM Hunters");
        //console.log(result);

        res.status(200).json({
            success:true,
            hunterData:result.recordset
        });
    }
    catch(error){
        console.log('Error in running query: ', error);
        res.status(500).json({
            success:false,
            message:"Server error",
            error:error.message
        });
    }
});

app.post("/api/authorize", async (req, res) => {
    const { hunterId, locationId } = req.body;

    // const hunterId = 1;
    // const locationId = 1;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            // Define input parameters
            .input('HunterID', sql.Int, hunterId)
            .input('LocationID', sql.Int, locationId)
            // Define output parameters (matching your SQL data types)
            .output('IsAuthorized', sql.Bit)
            .output('Message', sql.VarChar(255))
            // Execute the procedure
            .execute('AuthorizeOperation');

        // Accessing the output values from the result object
        const isAuthorized = result.output.IsAuthorized;
        const message = result.output.Message;

        console.log(`System Log: ${message}`);

        res.status(200).json({
            success: true,
            authorized: isAuthorized,
            message: message
        });
    } catch (error) {
        console.error('Administrative Error: ', error);
        res.status(500).json({ success: false, error: error.message });
    }
});