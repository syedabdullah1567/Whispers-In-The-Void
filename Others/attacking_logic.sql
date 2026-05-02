------------------------------
drop table ATTACKER_GAME_LOG
drop procedure sp_starting_attack
drop procedure sp_addingentity_for_attack
drop procedure Get_Artifacts_At_Location_GamsPlay
-------------------------------------------
CREATE TABLE ATTACKER_GAME_LOG (
session_id int identity(1,1) primary key,
entity_id int,
hunter_id int,
location_id int,
artifact_id int, 
riddle_solved bit default 0,
pre_combat_penalty int default 0,
post_combat_penalty int default 0,
is_active int default 0,
Foreign Key (hunter_id)
references Hunters(hunter_id),
Foreign Key (entity_id)
references Entities(entity_id),
Foreign Key (artifact_id)
references Artifacts (artifact_id),
Foreign Key (location_id)
references Locations (location_id)
)
-----------------------------------------------
--procedure 1
go
CREATE or Alter Procedure sp_starting_attack
@EntityID INT = NULL, -- since not selected yet
@HunterID INT,
@LocationID INT,
@sessionid int output
as 
begin 
    set NOCOUNT ON;
    update ATTACKER_GAME_LOG 
    set is_active  = 0
    where hunter_id = @HunterID and is_active = 1;

    insert into ATTACKER_GAME_LOG (entity_id, hunter_id, location_id, is_active) 
    values (@EntityID,@HunterID, @LocationID,  1);

    select @sessionid = SCOPE_IDENTITY(); --we are avoiding race condition
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
GO
CREATE OR ALTER PROCEDURE Get_Artifacts_At_Location_GamsPlay
    @SessionID INT
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @LocID int;
    Declare @HunID int;
    select @LocID = location_id, @HunID = hunter_id 
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
            artifact_id AS [ID],
            artifact_name AS [Artifact Name],
            artifact_type AS [Classification],
            origin AS [Origin Point],
            status AS [Current Status]
        FROM Artifacts
        WHERE location_id = @LocID
        and status = 'Active'
        ORDER BY artifact_name ASC;
     
END
-----------------------------------------
--procedure 4
GO
CREATE OR ALTER PROCEDURE sp_artifactselection 
@sessionid int,
@artifact_id int
AS 
BEGIN 
    update ATTACKER_GAME_LOG
    set artifact_id  = @artifact_id
    where session_id = @sessionid
END;
