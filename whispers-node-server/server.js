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

// ATTACKING SEQUENCE

// NEW: INITIALIZE COMBAT SESSION
app.post('/api/combat/start-session', async (req, res) => {
    const { hunterId, locationId } = req.body;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('EntityID', sql.Int, null) // Explicitly null as per your SP
            .input('HunterID', sql.Int, hunterId)
            .input('LocationID', sql.Int, locationId)
            .output('sessionid', sql.Int) // Registers the output parameter
            .execute('sp_starting_attack');
        
        // Grab the ID from the SELECT statement or the output param
        const sessionId = result.recordset[0].SessionID;

        console.log(`Combat Log Initialized: ID ${sessionId}`);
        
        res.status(200).json({
            success: true,
            sessionId: sessionId
        });
    } catch (err) {
        console.error("SESSION_START_ERROR:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/locations/:locationId/entities', async (req, res) => {
    try {
        const pool = await poolPromise; // Assumes global pool is configured
        const result = await pool.request()
            .input('locationId', sql.Int, req.params.locationId)
            .query(`
                SELECT entity_id, true_name as entity_name, terror_index as threat_level, entity_species
                FROM Entities 
                WHERE current_lair_id = @locationId AND existence_state != 'neutralized'
            `);
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send("Database error");
    }
});

// 2. ASSIGN ENTITY TO SESSION (Lock Target)
app.post('/api/combat/assign-entity', async (req, res) => {
    const { sessionId, entityId, locationId } = req.body; // Check these match your axios.post names
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('SessionID', sql.Int, sessionId)
            .input('EntityID', sql.Int, entityId)
            .input('LocationID', sql.Int, locationId) // Ensure this matches @LocationID in SP
            .execute('sp_addingentity_for_attack');
            
        res.status(200).send("Target Registered");
    } catch (err) {
        console.error("ASSIGN_ENTITY_ERROR:", err.message);
        res.status(500).send(err.message);
    }
});

// 3. GET ARTIFACTS (Artifact Loadout)
app.get('/api/gameplay/artifacts/:sessionId', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('SessionID', sql.Int, req.params.sessionId)
            .execute('Get_Artifacts_At_Location_GamsPlay'); // <--- Matches Procedure 3
            
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// 4. CONFIRM LOADOUT (Initialize Engagement)
app.post('/api/combat/confirm-loadout', async (req, res) => {
    const { sessionId, artifactId, riddleSolved } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('sessionid', sql.Int, sessionId)
            .input('artifact_id', sql.Int, artifactId)
            .input('riddle_solved', sql.Bit, riddleSolved) // Sending the explicit 1
            .execute('sp_artifactselection');
            
        res.status(200).send({ message: "Loadout confirmed." });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error confirming loadout");
    }
});

// 5. LAUNCH ATTACK (You will need this for your /combat-resolution screen!)
app.post('/api/combat/launch', async (req, res) => {
    const { sessionId } = req.body;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('SessionID', sql.Int, sessionId)
            .execute('LaunchAttack');
            
        // Now that the extra SELECT is gone, the data is in recordset (singular)
        // We use result.recordset[0] which is the first row of the first table
        const combatData = result.recordset[0];
        
        console.log("Mission Outcome:", combatData.Result);
        res.json(combatData); 
        
    } catch (err) {
        console.error("COMBAT_EXECUTION_ERROR:", err);
        res.status(500).send("Error launching attack");
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

app.get('/api/weaknesses/decrypted', async (req, res) => {
  try {
    const pool = await poolPromise
    const result = await pool.request()
      .query(`
        SELECT W.*, A.artifact_name, A.status AS artifact_status
        FROM Weaknesses W
        LEFT JOIN Artifacts A ON W.artifact_id = A.artifact_id
        WHERE W.is_decrypted = 1
      `)
    res.json(result.recordset)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})