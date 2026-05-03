--------------------------------------------------------------
CREATE OR ALTER PROCEDURE AuthorizeOperation
    @HunterID INT,
    @LocationID INT,
    @OperationType VARCHAR(50),
    @IsAuthorized BIT OUTPUT,
    @Message VARCHAR(255) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @ActualHunterType VARCHAR(20);
    DECLARE @LocationName VARCHAR(100);

    SELECT @ActualHunterType = [type] 
    FROM Hunters 
    WHERE hunter_id = @HunterID;

    IF @ActualHunterType IS NULL
    BEGIN
        SET @IsAuthorized = 0;
        SET @Message = 'CRITICAL ERROR: Hunter ID not found in central database.';
        RETURN;
    END

    SELECT @LocationName = location_name 
    FROM Locations 
    WHERE location_id = @LocationID;

    IF @LocationName IS NULL
    BEGIN
        SET @IsAuthorized = 0;
        SET @Message = 'CRITICAL ERROR: Location ID does not exist.';
        RETURN;
    END

    IF (@OperationType = 'Scouting' AND @ActualHunterType <> 'Scout')
    BEGIN
        SET @IsAuthorized = 0;
        SET @Message = 'Authorization Denied: Personnel mismatch. Scouting requires a specialized Scout.';
    END
    ELSE IF (@OperationType = 'Recovery' AND @ActualHunterType <> 'Collector')
    BEGIN
        SET @IsAuthorized = 0;
        SET @Message = 'Authorization Denied: Personnel mismatch. Recovery operations require a Collector.';
    END
    ELSE IF (@OperationType = 'Combat' AND @ActualHunterType <> 'Attacker')
    BEGIN
        SET @IsAuthorized = 0;
        SET @Message = 'Authorization Denied: Personnel mismatch. High-intensity Combat requires an Attacker.';
    END
    ELSE
    BEGIN
        SET @IsAuthorized = 1;
        SET @Message = 'Authorization Granted: Asset type confirmed for ' + @OperationType + ' at ' + @LocationName + '. Godspeed soldier.';
    END
END;

-------------------------------------------------------------------------------------------------------------------------------------------------------

CREATE OR ALTER PROCEDURE ScoutingMission
    @locationID INT,
    @hunterID INT
AS
BEGIN
    SET NOCOUNT ON; -- Prevents extra 'rows affected' messages from slowing down the API

    UPDATE Artifacts
    SET status = 'Discovered'
    WHERE location_id = @locationID -- Ensure this ID matches exactly
    AND status <> 'Discovered' 
    AND status <> 'Used';

    UPDATE "Entities"
    SET existence_state = 'active'
    WHERE current_lair_id = @locationID -- Ensure this ID matches exactly
    AND existence_state = 'unlocated'

    -- Logging the operation
    IF @@ROWCOUNT > 0
    BEGIN
        INSERT INTO Operations (
            hunter_id, 
            location_id, 
            operation_date, 
            outcome, 
            entity_id, 
            artifact_id
        )
        VALUES (
            @hunterID, 
            @locationID, 
            GETDATE(), 
            'Scouting', -- We use 'recorded' for scouting data
            NULL,       -- No specific entity targeted in a scout sweep
            NULL        -- All artifacts updated, so we don't pin one specific ID
        );
    END    
END

---------------------------------------------------------------------------------------------------------------

CREATE OR ALTER PROCEDURE CollectionMission
    @locationID INT,
    @hunterID INT
AS
BEGIN
    SET NOCOUNT ON; -- Prevents extra 'rows affected' messages from slowing down the API

    UPDATE Artifacts
    SET status = 'Active'
    WHERE location_id = @locationID
    AND status = 'Discovered' 

    -- Logging the operation
    IF @@ROWCOUNT > 0
    BEGIN
        INSERT INTO Operations (
            hunter_id, 
            location_id, 
            operation_date, 
            outcome, 
            entity_id, 
            artifact_id
        )
        VALUES (
            @hunterID, 
            @locationID, 
            GETDATE(), 
            'Collection',
            NULL,       
            NULL        
        );
    END    
END

--------------------------------------------------------------------------------------------------------------------------------------------------------
  
CREATE OR ALTER PROCEDURE Get_Artifacts_At_Location
    @LocationID INT
AS
BEGIN
    SET NOCOUNT ON;
    IF NOT EXISTS (SELECT 1 FROM Locations WHERE location_id = @LocationID)
    BEGIN
        RAISERROR('Location ID not found in the archives.', 16, 1);
        RETURN;
    END
    SELECT 
        artifact_id AS [ID],
        artifact_name AS [Artifact Name],
        artifact_type AS [Classification],
        origin AS [Origin Point],
        [status] AS [Current Status],
        CASE 
            WHEN status = 'Discovered' THEN 'Available in Field'
            WHEN status = 'Active' THEN 'Ready to be used'
            WHEN status = 'Used' THEN 'Can no longer be used'
        END AS lifecycleState

    FROM Artifacts
    WHERE location_id = @LocationID AND status <> 'Unlocated'
    ORDER BY artifact_name ASC;
END;
  

----------------------------------------------------------------------------------------------------------------------------------------

CREATE OR ALTER PROCEDURE sp_DashBoard_cards
    @EntityCount INT OUTPUT,
    @ActiveEntity INT OUTPUT,
    @OpCount INT OUTPUT,
    @OpRecorded INT OUTPUT,
    @CountDeployedHunters INT OUTPUT,
    @LocationExplored INT OUTPUT,
    @TotalArtifacts INT OUTPUT,
    @ArtifactsUnlocked INT OUTPUT
AS 
BEGIN
    
    -- Total Entity Count
    SELECT @EntityCount = count(*)
    FROM Entities

    -- Active Entity Count
    SELECT @ActiveEntity = count(*)
    FROM Entities E
    WHERE E.existence_state = 'active';

    -- Ops Count
    Select @OpCount = count( * ) from Operations

    -- Recorded OPs Count
    Select @OpRecorded = count( * ) 
    From Operations O
    WHERE O.outcome = 'recorded';

    -- Deployed Hunters
    Select @CountDeployedHunters = COUNT(DISTINCT(hunter_id))
    From Operations O

    -- Locations Explored
    Select @LocationExplored = COUNT(DISTINCT(O.location_id))
    From Operations O


    -- Total Artifacts
    SELECT @TotalArtifacts =  COUNT(*)
    FROM Artifacts;


    -- Artifacts Unlocked

    SELECT @ArtifactsUnlocked = COUNT(*)
    FROM Artifacts
    Where status = 'Discovered'

END

------------------------------------------------------------------------------------------------------------------------------------------

CREATE OR ALTER PROCEDURE sp_EntityRegistry
AS 
BEGIN

    Select E.true_name,E.entity_species,E.terror_index,E.existence_state,L.location_name,B.bloodline_name from Entities As E
    left join Locations as L on L.location_id = E.current_lair_id
    left join Bloodlines as B on B.bloodline_id = E.bloodline_id
    WHERE E.existence_state <> 'unlocated'

END

---------------------------------------------------------------------------------------------------------------------------------------------

CREATE OR ALTER PROCEDURE sp_GettopTerrorEntity
AS 
BEGIN

    Select E.true_name,E.entity_species,E.terror_index,E.existence_state,L.location_name,B.bloodline_name from Entities AS E
    join Locations AS L on L.location_id = E.current_lair_id
    join Bloodlines As B on B.bloodline_id = E.bloodline_id

    where E.entity_id = (
    
        Select top 1 e.entity_id
        from Entities as e
        order by terror_index DESC

    )

END

--------------------------------------------------------------------------------------------------------------------------------------------

-- For Displaying hunter info history for Each hunter
CREATE OR ALTER PROCEDURE sp_GetHunterLeaderboard

AS 
BEGIN
    SELECT 
        h.hunter_name, h.rank, h.faction,
        COUNT(CASE WHEN o.outcome = 'neutralized' THEN 1 END) AS neutralized_count,
        COUNT(CASE WHEN o.outcome = 'archived'    THEN 1 END) AS archived_count,
        COUNT(CASE WHEN o.outcome = 'recorded'    THEN 1 END) AS recorded_count,
        COUNT(o.operation_id) AS total_operations

    FROM Hunters as h
    LEFT JOIN Operations as o ON h.hunter_id = o.hunter_id
    GROUP BY h.hunter_id, h.hunter_name, h.rank, h.faction
    ORDER BY neutralized_count DESC

END;

-----------------------------------------------------------------------------------------------------------------------------------------------
