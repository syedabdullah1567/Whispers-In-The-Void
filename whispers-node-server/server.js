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
        const result = await pool.request().query("SELECT * FROM Hunters");
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

app.get("/api/locations", async(req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT * FROM Locations");
        res.status(200).json({
            success: true,
            locationData: result.recordset
        });
    } catch(error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
app.get('/api/artifacts/:locationId', async (req, res) => {
    try {
        const pool = await poolPromise; 
        let result = await pool.request()
            .input('LocationID', sql.Int, req.params.locationId)
            .execute('Get_Artifacts_At_Location'); 
        
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

app.get("/api/bloodlines", async(req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT * FROM Bloodlines");
        res.status(200).json({
            success: true,
            bloodlineData: result.recordset
        });
    } catch(error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post("/api/authorize", async (req, res) => {
    const { hunterId, locationId } = req.body;

    // const hunterId = 1;
    // const locationId = 1;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('HunterID', sql.Int, hunterId)
            .input('LocationID', sql.Int, locationId)
            .input('OperationType', sql.VarChar, req.body.operationType)
            .output('IsAuthorized', sql.Bit)
            .output('Message', sql.VarChar(255))
            .execute('AuthorizeOperation');

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

app.post("/api/missions/scout", async (req, res) => {
    // 1. Extract locationId (camelCase)
    const { locationId } = req.body; 

    try {
        const pool = await poolPromise;
        
        // 2. Use the exact variable 'locationId' we just extracted
        await pool.request()
            .input('locationID', sql.Int, locationId) 
            .execute('ScoutingMission');

        console.log(`Mission Log: Sector ${locationId} scanning initiated. Artifacts active.`);

        res.status(200).json({
            success: true,
            message: `MISSION_SUCCESS: SECTOR_${locationId} ARTIFACTS_ACTIVATED`
        });
    } catch (error) {
        console.error('Field Operational Error: ', error);
        res.status(500).json({ 
            success: false, 
            message: "UPLINK_FAILURE", 
            error: error.message 
        });
    }
});