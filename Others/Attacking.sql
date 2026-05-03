-----------------------------------------------
--procedure 1
go
CREATE or Alter Procedure sp_starting_attack
    @EntityID INT = NULL, 
    @HunterID INT,
    @LocationID INT,
    @sessionid int output
as 
begin 
    set NOCOUNT ON;
    
    update ATTACKER_GAME_LOG 
    set is_active = 0
    where hunter_id = @HunterID and is_active = 1;

    insert into ATTACKER_GAME_LOG (entity_id, hunter_id, location_id, is_active) 
    values (@EntityID, @HunterID, @LocationID, 1);

    select @sessionid = SCOPE_IDENTITY();
    SELECT @sessionid as SessionID; 
end
----------------------------------------
--procedure 2
GO
CREATE OR ALTER PROCEDURE sp_addingentity_for_attack
@SessionID int,
@EntityID int,
@LocationID INT
AS 
BEGIN 
set nocount on;
 UPDATE ATTACKER_GAME_LOG
 set entity_id = @EntityID, location_id = @LocationID
 where session_id = @SessionID; 
END
-----------------------------------------
--procedure 3
CREATE OR ALTER PROCEDURE Get_Artifacts_At_Location_GamsPlay
    @SessionID INT
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @LocID int;
    Declare @HunID int;
    Declare @entity_id int;
    select @LocID = location_id, @HunID = hunter_id , @entity_id = entity_id
    from ATTACKER_GAME_LOG 
    where session_id = @SessionID;

    
    IF @HunID is NULL
    BEGIN
        RAISERROR('Hunter ID not found in the archives.', 16, 1);
        RETURN;
    END
     
    IF @LocID is NULL
    BEGIN
        RAISERROR('Location ID not found in the archives.', 16, 1);
        RETURN;
    END

        SELECT 
          A.artifact_id AS [ID],
          A.artifact_name AS [Artifact Name],
          A.artifact_type AS [Classification],
          A.origin AS [Origin Point],
          A.status AS [Current Status]
      FROM Artifacts A
      -- Links the artifact to its known effectiveness
      INNER JOIN Weaknesses W ON A.artifact_id = W.artifact_id
      -- Matches the targeted entity's species to the weakness type
      INNER JOIN Entities E ON E.entity_species = W.entity_type
      WHERE E.entity_id = @entity_id -- Filters by the locked target
        AND A.location_id = @LocID   -- Ensures it is physically at the location
        AND A.status = 'Active'      -- Ensures it hasn't been used or lost
      ORDER BY A.artifact_name ASC;
     
END
-----------------------------------------
--procedure 4
GO
CREATE OR ALTER PROCEDURE sp_artifactselection 
@sessionid int,
@artifact_id int,
@riddle_solved bit DEFAULT 1
AS 
BEGIN 
    update ATTACKER_GAME_LOG
    set artifact_id  = @artifact_id,
        riddle_solved = @riddle_solved
    where session_id = @sessionid
END;

---------------------------------------------------------------------

-- Launch attack

CREATE OR ALTER PROCEDURE LaunchAttack
@SessionID int
AS 
BEGIN
    SET NOCOUNT ON;
    DECLARE @LocID int, @HunID int, @entity_id int, @artifact_id int;
    DECLARE @riddle_solved int = 1; 
 
    DECLARE @hunterrank int, @artifact_power int;
    DECLARE @resistance float, @win_ratio float = 0, @attackpower float = 0;

    -- Basic data extraction
    SELECT @LocID = location_id, @HunID = hunter_id, @entity_id = entity_id, 
           @artifact_id = artifact_id, @riddle_solved = riddle_solved
    FROM ATTACKER_GAME_LOG 
    WHERE session_id = @SessionID;

    SELECT @artifact_power = ISNULL(artifact_power, 0) FROM Artifacts WHERE artifact_id = @artifact_id;
    SELECT @hunterrank = ISNULL(rank_level, 0) FROM Hunters WHERE hunter_id = @HunID;
    SELECT @resistance = CAST(ISNULL(terror_index, 0) as FLOAT) * 10 
    FROM Entities WHERE entity_id = @entity_id;
    
    -- Formula computation 
    IF @artifact_id IS NULL
    BEGIN
        SET @attackpower = 30.0; 
        IF @hunterrank < 5 SET @resistance = @resistance * 2.5;
    END 
    ELSE 
    BEGIN
        SET @attackpower = CAST(@artifact_power as float) + (@hunterrank * 2);           
    END

    -- Riddle check
    IF @riddle_solved = 1 SET @attackpower = @attackpower * 1.5;

    -- Probability calculation
    SET @win_ratio = ISNULL(@attackpower / NULLIF(@attackpower + @resistance, 0), 0);

    -- REMOVED: SELECT @win_ratio AS Prob (This was creating recordsets[0])

    -- Decision logic
    IF @win_ratio > 0.8
    BEGIN 
        UPDATE Artifacts SET status = 'Used' WHERE artifact_id = @artifact_id;
        UPDATE Hunters SET rank_level = rank_level + 1 WHERE hunter_id = @HunID;
        UPDATE Entities SET existence_state = 'neutralized' WHERE entity_id = @entity_id
        
        INSERT INTO Operations (hunter_id, entity_id, location_id, artifact_id, operation_date, outcome)
        VALUES (@HunID, @entity_id, @LocID, @artifact_id, GETDATE(), 'neutralized');

        SELECT '[SUCCESSFUL MISSION]' as Result, ROUND(@win_ratio, 3) as Win_Probability, 'Hunter Promoted' as Message;
    END 
    ELSE
    BEGIN
        -- 1. LOG THE OUTCOME FIRST
        INSERT INTO Operations (hunter_id, entity_id, location_id, artifact_id, operation_date, outcome)
        VALUES (NULL, @entity_id, @LocID, @artifact_id, GETDATE(), 'archived');

        -- 2. CLEAR THE GAME LOG (Fixes the Foreign Key conflict)
        -- We delete the log entry so nothing points to the hunter anymore
        DELETE FROM ATTACKER_GAME_LOG WHERE hunter_id = @HunID;

        -- 3. REMOVE THE HUNTER
        DELETE FROM Hunters WHERE hunter_id = @HunID;

        SELECT 'FAILURE' as Result, ROUND(@win_ratio, 3) as Win_Probability, 'Hunter has been eliminated' as Message;
     END
END

SELECT * FROM "Operations"


--- test

-- Step A: Set the Artifact as 'Active' and give it power
UPDATE Artifacts 
SET status = 'Active', artifact_power = 80 
WHERE artifact_id = 1; -- Sun-Forged Blade

-- Step B: Ensure our Hunter (Kaelen Highwind) is at a high enough rank
UPDATE Hunters 
SET rank_level = 10 
WHERE hunter_id = 3; 

-- Step C: Double check the Entity's Terror Index (Valerius is 8)
SELECT true_name, terror_index FROM Entities WHERE entity_id = 3;


DECLARE @SessionID int;

-- 1. Start the session (Hunter 3 at Location 1)
EXEC sp_starting_attack 
    @EntityID = NULL, 
    @HunterID = 3, 
    @LocationID = 1, 
    @sessionid = @SessionID OUTPUT;

-- 2. Scout identifies the Entity (Valerius the Cruel, ID 3)
EXEC sp_addingentity_for_attack 
    @SessionID = @SessionID, 
    @EntityID = 3, 
    @LocationID = 1;

-- 3. Look for effective artifacts at this location
-- (This should return the Sun-Forged Blade because it matches the 'Vampire' species weakness)
EXEC Get_Artifacts_At_Location_GamsPlay @SessionID = @SessionID;

-- 4. Select the artifact found (ID 1)
EXEC sp_artifactselection 
    @sessionid = @SessionID, 
    @artifact_id = 1;

-- 5. THE FINALE: Launch the Attack
EXEC LaunchAttack @SessionID = @SessionID;


-- Check if the Hunter was promoted (should now be level 11)
SELECT hunter_name, rank_level FROM Hunters WHERE hunter_id = 3;

-- Check if the Artifact is now 'Used'
SELECT artifact_name, status FROM Artifacts WHERE artifact_id = 1;

-- Check the Operation Log
SELECT * FROM Operations WHERE hunter_id = 3;

-- Check the Game Log session status
SELECT * FROM ATTACKER_GAME_LOG WHERE session_id = @SessionID;



