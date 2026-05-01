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
        SET @Message = 'Authorization Granted: Asset type confirmed for ' + @OperationType + ' at ' + @LocationName + '. Godspeed.';
    END
END;

-------------------------------------------------------------------------------------------------------------------------------------------------------

CREATE PROCEDURE ScoutingMission
    @locationID INT
AS
BEGIN
    SET NOCOUNT ON; -- Prevents extra 'rows affected' messages from slowing down the API

    UPDATE Artifacts
    SET status = 'Active'
    WHERE location_id = @locationID 
    AND status <> 'Active';
END

--------------------------------------------------------------------------------------------------------------------------------------------------------
  
GO
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
            WHEN status = 'Unlocated' THEN 'Dormant'
              WHEN status = 'Discovered' THEN 'Available in Field'
            WHEN status = 'Active' THEN 'Ready to be used'
            WHEN status = 'Used' THEN 'Can no longer be used'
        END AS lifecycleState

    FROM Artifacts
    WHERE location_id = @LocationID
    ORDER BY artifact_name ASC;
END;

----------------------------------------------------------------------------------------------------------------

-- Procedure For Collecting Artifact ANd updating Hunters Ability
CREATE PROCEDURE sp_CollectArtifact
    @Artifact_ID INT,
    @Hunter_ID INT,
    @Returning_Message VARCHAR(50) OUTPUT
AS 
BEGIN
    DECLARE @ART_Name VARCHAR(50) = ''

    UPDATE Artifacts 
    SET status =  'Active', @ART_Name = artifact_name
    WHERE artifact_id = @Artifact_ID

    BEGIN TRANSACTION
    
    INSERT INTO Hunter_Abilities (hunter_id, ability_id, unlock_date)
    SELECT @Hunter_ID,ability_id,GETDATE()
    FROM Abilities
    WHERE artifact_id = @Artifact_ID
    and not EXISTS (
        select * from Hunter_Abilities as ha 
        where @Hunter_ID = ha.hunter_id and ability_id = ha.ability_id 
    )

    if @ART_NAME != ''
        set @Returning_Message =  @ART_Name + ' IS DISCOVERED AND NEW ABILITY UNLOCKED'
    else
        set @Returning_Message = 'NO Artifact IS DISCOVERED'


    COMMIT



END;

----------------------------------------------------------------------------------------------------------------------------------------

DECLARE @msg VARCHAR(50)

EXEC sp_CollectArtifact 
    @Artifact_ID = 3, 
    @Hunter_ID = 2, 
    @Returning_Message = @msg OUTPUT

SELECT @msg AS Result


Select * from Hunter_Abilities
  

SELECT * FROM "Artifacts"