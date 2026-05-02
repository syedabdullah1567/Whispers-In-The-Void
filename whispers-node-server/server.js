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
        const locId = parseInt(req.params.locationId);
        let result = await pool.request()
            .input('LocationID', sql.Int, locId)
            .execute('Get_Artifacts_At_Location'); 
        
        // Use result.recordset (singular) for the primary data rows
        const data = result.recordset; 

        console.log("Sending to React:", data);
        res.json(data);
    } catch (err) {
        console.error(err);
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
    const { locationId, hunterId } = req.body;

    try {
        const pool = await poolPromise;
        
        // 2. Use the exact variable 'locationId' we just extracted
        await pool.request()
            .input('locationID', sql.Int, locationId) 
            .input('hunterID', sql.Int, hunterId)
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

app.post("/api/missions/collection", async (req, res) => {
    // 1. Extract locationId (camelCase)
    const { locationId, hunterId } = req.body;

    try {
        const pool = await poolPromise;
        
        // 2. Use the exact variable 'locationId' we just extracted
        await pool.request()
            .input('locationID', sql.Int, locationId) 
            .input('hunterID', sql.Int, hunterId)
            .execute('CollectionMission');

        console.log(`Mission Log: Sector ${locationId} collection initiated. Artifacts collected.`);

        res.status(200).json({
            success: true,
            message: `MISSION_SUCCESS: SECTOR_${locationId} ARTIFACTS_COLLECTED`
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

/* ---------------- ENTITY REGISTRY ---------------- */
app.get('/api/entities', async (req, res) => {
  try {
    console.log("Entered entities")
    const pool = await poolPromise;
    const result = await pool.request().execute('sp_EntityRegistry')
    res.json(result.recordset)
    
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


app.get("/api/dashboard/stats", async (req, res) => {
  try {
    // 1. Get the pool from the promise first
    const pool = await poolPromise; 

    // 2. Use 'pool.request()' instead of calling poolPromise directly
    const result = await pool.request()
      .output("EntityCount", sql.Int)
      .output("ActiveEntity", sql.Int)
      .output("OpCount", sql.Int)
      .output("OpRecorded", sql.Int)
      .output("CountDeployedHunters", sql.Int)
      .output("LocationExplored", sql.Int)
      .output("TotalArtifacts", sql.Int)
      .output("ArtifactsUnlocked", sql.Int)
      .execute("sp_DashBoard_cards");

    // Send the output parameters to the frontend
    res.json(result.output);

  } catch (err) {
    console.error("DASHBOARD_UPLINK_ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});



app.get('/api/hunter-activity', async (req, res) => {
  try {
    const pool = await poolPromise; 
    const result = await pool.request().execute('sp_GetHunterLeaderboard')
    res.json(result.recordset)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


app.get('/api/top-threat', async (req, res) => {
  try {
    const pool = await poolPromise; 
    const result = await pool.request().execute('sp_GettopTerrorEntity')
    res.json(result.recordset)
    
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/operation-log', async(req, res) => {
    try {
    const pool = await poolPromise; 
    const result = await pool.request().query('SELECT * FROM Operations')
    res.json(result.recordset)
    
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})