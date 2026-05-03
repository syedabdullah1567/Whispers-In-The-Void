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
    const result = await pool.request()
    .execute('sp_GettopTerrorEntity')
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
// Updated to match your Get_Artifacts_At_Location_GamsPlay procedure
app.get('/api/gameplay/artifacts/:sessionId', async (req, res) => {
    const { sessionId } = req.params; // Using URL param for SessionID
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('SessionID', sql.Int, sessionId)
            .execute('Get_Artifacts_At_Location_GamsPlay');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error("ARTIFACT_FETCH_ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
});


app.post('/api/combat/confirm-loadout', async (req, res) => {
    const { sessionId, artifactId } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('sessionid', sql.Int, sessionId)
            .input('artifact_id', sql.Int, artifactId)
            .execute('sp_artifactselection'); // Executes your stored procedure

        res.status(200).json({ success: true, message: "Loadout confirmed" });
    } catch (err) {
        console.error("LOADOUT_ERROR:", err);
        res.status(500).json({ success: false, message: "Failed to update game log" });
    }
});

app.post('/api/combat/start', async (req, res) => {
    const { hunterId, locationId, entityId } = req.body; // Added locationId
    try {

        const pool = await poolPromise;

        const result = await pool.request()
            .input('HunterID', sql.Int, hunterId)
            .input('LocationID', sql.Int, locationId) // Pass location to the session
            .input('EntityID', sql.Int, entityId || null) // Can be null now
            .output('sessionid', sql.Int)
            .execute('sp_starting_attack');
        const sessionId = result.output.sessionid;
        res.status(200).json({
            success: true,
            sessionId: sessionId,
            message: "COMBAT_SESSION_INITIALIZED_PENDING_TARGET"
        });

    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }

});

app.post('/api/combat/assign-entity', async (req, res) => {
    const { sessionId, entityId, locationId } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('SessionID', sql.Int, sessionId)
            .input('EntityID', sql.Int, entityId)
            .input('LocationID', sql.Int, locationId) // Pass it to the procedure
            .execute('sp_addingentity_for_attack');
            res.status(200).json({
            success: true,
            message: "TARGET_LOCKED_IN_DATABASE"
        });

    } catch (err) {
        console.error("TARGET_LOCK_ERROR:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }

});

app.get('/api/locations/:locationId/entities', async (req, res) => {
    const { locationId } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('LocID', sql.Int, locationId)
            // MUST use current_lair_id as defined in your CREATE TABLE
            .query(`

                SELECT
                    entity_id,
                    true_name AS entity_name,
                    terror_index AS threat_level
                FROM Entities
                WHERE current_lair_id = @LocID
                AND existence_state = 'active'
            `);

        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// WEAKNESS INTEL

app.get('/api/weaknesses', async (req, res) => {
  try {
    const pool = await poolPromise
    const result = await pool.request().query('SELECT * FROM Weaknesses')
    res.json(result.recordset)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/penalties', async (req, res) => {
  try {
    const pool = await poolPromise
    const result = await pool.request().query(`
      SELECT P.*, H.hunter_name 
      FROM Penalties P
      JOIN Hunters H ON P.hunter_id = H.hunter_id
      ORDER BY P.penalty_date DESC
    `)
    res.json(result.recordset)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/weaknesses/generate', async (req, res) => {
  try {
    const { hunter_id, entity_species } = req.body
    const pool = await poolPromise
    const result = await pool.request()
      .input('hunter_id', sql.Int, hunter_id)
      .input('Entity_species', sql.VarChar(50), entity_species)
      .execute('sp_GenerateShift')
      
    let data = {};
    if (result.recordsets) {
        result.recordsets.forEach(rs => {
            if (rs && rs.length > 0) {
                data = { ...data, ...rs[0] };
            }
        });
    } else if (result.recordset && result.recordset.length > 0) {
        data = { ...result.recordset[0] };
    }
    
    // Also include any output parameters
    if (result.output) {
        data = { ...data, ...result.output };
    }
    
    // If the procedure didn't return the shift, fetch it from the table
    if (data.current_shift === undefined && data.shift === undefined && data.Shift === undefined && data.message === undefined) {
      const shiftQuery = await pool.request()
        .input('hunter_id', sql.Int, hunter_id)
        .query('SELECT current_shift FROM Decryption_Attempts WHERE hunter_id = @hunter_id');
      
      if (shiftQuery.recordset && shiftQuery.recordset.length > 0) {
        data.current_shift = shiftQuery.recordset[0].current_shift;
      }
    }
    
    console.log("Generate Shift Output Data:", data); // Helpful for debugging if user looks at terminal
    res.json(data)
  } catch (err) {
    console.error("Error in generate:", err);
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/weaknesses/decrypt', async (req, res) => {
  try {
    const { hunter_id, guess, entity_species } = req.body
    const pool = await poolPromise
    const result = await pool.request()
      .input('hunter_id', sql.Int, hunter_id)
      .input('UserGuess', sql.VarChar(50), guess)
      .input('Entity_species', sql.VarChar(50), entity_species)
      .execute('sp_CheckDecryption')
    res.json(result.recordset[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})
