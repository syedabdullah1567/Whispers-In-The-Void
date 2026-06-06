CREATE DATABASE [Whispers in the Voiddd]
use [Whispers in the Voiddd]
use master 
drop database  [Whispers in the Voiddd]
drop table if exists ATTACKER_GAME_LOG


DROP TABLE IF EXISTS PenaltyTypes;
DROP TABLE IF EXISTS Penalties;
DROP TABLE IF EXISTS Decryption_Attempts;

DROP TABLE IF EXISTS Operations;
DROP TABLE IF EXISTS Weaknesses;
DROP TABLE IF EXISTS Artifacts;
DROP TABLE IF EXISTS Hunters;
DROP TABLE IF EXISTS Entities;
DROP TABLE IF EXISTS Locations;
DROP TABLE IF EXISTS Bloodlines;

CREATE TABLE Bloodlines (
    bloodline_id INT IDENTITY(1,1) PRIMARY KEY,
    bloodline_name VARCHAR(100) NOT NULL,
    origin_realm VARCHAR(100),
    dominant_trait VARCHAR(100),
    legacy_threat_modifier INT NOT NULL
);

CREATE TABLE Locations (
    location_id INT IDENTITY(1,1) PRIMARY KEY,
    location_name VARCHAR(100) NOT NULL,
    location_type VARCHAR(50),
    capacity INT CHECK (capacity >= 0),
    risk_level INT CHECK (risk_level BETWEEN 1 AND 10)
);

CREATE TABLE Entities (
    entity_id INT IDENTITY(1,1) PRIMARY KEY,
    true_name VARCHAR(100) NOT NULL,
    entity_species VARCHAR(50) NOT NULL,
    terror_index INT CHECK (terror_index BETWEEN 1 AND 10),
    existence_state VARCHAR(20) NOT NULL
        CHECK (existence_state IN ('active', 'neutralized', 'unlocated')),
    current_lair_id INT,
    bloodline_id INT,
    FOREIGN KEY (current_lair_id)
        REFERENCES Locations(location_id)
        ON DELETE SET NULL,
    FOREIGN KEY (bloodline_id)
        REFERENCES Bloodlines(bloodline_id)
        ON DELETE SET NULL
);

CREATE TABLE Hunters (
    hunter_id INT IDENTITY(1,1) PRIMARY KEY,
    hunter_name VARCHAR(100) NOT NULL,
    rank VARCHAR(50) NOT NULL,
    type VARCHAR(20) NOT NULL,
    faction VARCHAR(100),
    rank_level INT DEFAULT 1,
    
    CONSTRAINT CHK_HunterType CHECK (type IN ('Scout', 'Collector', 'Attacker'))
);

CREATE TABLE Artifacts (
    artifact_id INT IDENTITY(1,1) PRIMARY KEY,
    artifact_name VARCHAR(100) NOT NULL,
    artifact_type VARCHAR(50),
    origin VARCHAR(100),
    location_id INT,
    artifact_power INT default 100,
    status VARCHAR(20) NOT NULL DEFAULT 'Unlocated',
    CONSTRAINT CHK_ArtifactState CHECK (status IN ('Unlocated', 'Discovered', 'Active', 'Used')),
    FOREIGN KEY (location_id)
        REFERENCES Locations(location_id)
        ON DELETE SET NULL
);

CREATE TABLE Weaknesses (
    weakness_id INT IDENTITY(1,1) PRIMARY KEY,
    weakness_name VARCHAR(100) NOT NULL,
    description VARCHAR(MAX),
    entity_type VARCHAR(50) NOT NULL,
    artifact_id INT,
    is_decrypted INT,
    FOREIGN KEY (artifact_id)
        REFERENCES Artifacts(artifact_id)
        ON DELETE SET NULL
);

CREATE TABLE Operations (
    operation_id INT IDENTITY(1,1) PRIMARY KEY,
    hunter_id INT,
    entity_id INT,
    location_id INT NOT NULL,
    artifact_id INT,
    weakness_id INT,
    operation_date DATE NOT NULL,
    outcome VARCHAR(20) NOT NULL
        CHECK (outcome IN ('Scouting', 'Collection', 'Attacking', 'archived', 'neutralized')),
    FOREIGN KEY (hunter_id)
        REFERENCES Hunters(hunter_id)
        ON DELETE CASCADE,
    FOREIGN KEY (entity_id)
        REFERENCES Entities(entity_id)
        ON DELETE CASCADE,
    FOREIGN KEY (location_id)
        REFERENCES Locations(location_id)
        ON DELETE CASCADE,
    FOREIGN KEY (artifact_id)
        REFERENCES Artifacts(artifact_id)
        ON DELETE CASCADE,
    FOREIGN KEY (weakness_id)
        REFERENCES Weaknesses(weakness_id)
        ON DELETE CASCADE
);

CREATE TABLE Decryption_Attempts (
    attempt_id    INT IDENTITY(1,1) PRIMARY KEY,
    hunter_id     INT NOT NULL,
    attempts_used INT DEFAULT 0,
    current_shift INT,
    last_attempt  DATETIME,
    locked_until  DATETIME,
    encrypted_text VARCHAR(200),
    entity_species VARCHAR(50),
    FOREIGN KEY (hunter_id) REFERENCES Hunters(hunter_id) ON DELETE CASCADE
);


CREATE TABLE Penalties (
    penalty_id          INT IDENTITY(1,1) PRIMARY KEY,
    hunter_id           INT NOT NULL,
    penalty_type        VARCHAR(50) NOT NULL,
    penalty_description VARCHAR(MAX),
    affected_id         INT,
    penalty_date        DATETIME DEFAULT GETDATE(),
    CONSTRAINT CHK_PenaltyType CHECK (penalty_type IN (
        'ArtifactLost',
        'EntitySpawned',
        'EntityResurrected'
    )),
    FOREIGN KEY (hunter_id) REFERENCES Hunters(hunter_id) ON DELETE CASCADE
);


CREATE TABLE PenaltyTypes (
    penalty_type_id INT IDENTITY(1,1) PRIMARY KEY,
    penalty_type    VARCHAR(50) NOT NULL,
    description     VARCHAR(MAX)
);

CREATE TABLE ATTACKER_GAME_LOG (
session_id int identity(1,1) primary key,
entity_id int,
hunter_id int,
location_id int,
artifact_id int, 
riddle_solved bit default 1,
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

---------------------------------------------------
-- 1. LOCATIONS (The Global & Cosmic Theater)
INSERT INTO Locations (location_name, location_type, capacity, risk_level) VALUES 
('The Sunken Cathedral', 'Ruins', 12, 9),       
('Sector 7 Outpost', 'Military', 50, 3),       
('Ironwood Forest', 'Forest', 100, 6),         
('Echoing Catacombs', 'Underground', 15, 7),     
('Aether Lab 4', 'Laboratory', 8, 5),            
('Blackwood Asylum', 'Urban Ruins', 25, 8),    
('The Howling Peaks', 'Mountain', 40, 7),       
('Neo-Tokyo Grid', 'Cyber-Slum', 200, 6),       
('Abandoned Orbital Station', 'Space', 10, 10),  
('Mariana Trench Facility', 'Underwater', 15, 9),
('The Whispering Wastes', 'Desert', 500, 8),    
('Obsidian Citadel', 'Fortress', 50, 10),        
('Hollow Earth Nexus', 'Subterranean', 100, 9),
('Chernobyl Exclusion Zone', 'Irradiated', 30, 8),
('The Glass Desert', 'Anomalous', 20, 7);       

-- 2. BLOODLINES (The Heritage of Nightmares)
INSERT INTO Bloodlines (bloodline_name, origin_realm, dominant_trait, legacy_threat_modifier) VALUES 
('The Crimson Brood', 'Underworld', 'Vampirism', 3),       -- ID 1
('Frost-Walkers', 'Niflheim', 'Cryokinesis', 4),          -- ID 2
('Obsidian Guard', 'Abyssal Deep', 'Durability', 2),      -- ID 3
('Void-Born', 'The Far Realm', 'Reality Warping', 5),     -- ID 4
('The Ashen Court', 'Plane of Fire', 'Pyrokinesis', 4),   -- ID 5
('The Deep Ones', 'Sunken RL yeh', 'Aquatic Mutation', 3),-- ID 6
('Fae Wilds', 'The Twilight Realm', 'Illusion', 4),       -- ID 7
('Clockwork Legion', 'Mechanus', 'Technomancy', 3);       -- ID 8

-- 3. ENTITIES (The High-Value Targets)
INSERT INTO Entities (true_name, entity_species, terror_index, existence_state, current_lair_id, bloodline_id) VALUES 
-- Location 5 (Hub): 6 Entities
('Xylo-Thul', 'Wraith', 10, 'unlocated', 5, 4),           -- Art 2
('Morana Prime', 'Wraith', 9, 'unlocated', 5, 4),          -- Art 5
('Glacia', 'Wraith', 6, 'unlocated', 5, 2),              -- Art 14
('The Lab-Stalker', 'Wraith', 7, 'unlocated', 5, 4),       -- Art 15
('Alpha Poltergeist', 'Poltergeist', 8, 'unlocated', 5, 8),-- Art 4
('Wraith-Echo', 'Wraith', 4, 'unlocated', 5, 4),           -- Art 16

-- Location 10 (Abyssal): 2 Entities
('Abyssal Leviathan', 'Wraith', 10, 'unlocated', 10, 6),   -- Art 8
('Cthulian Scout', 'Vampire', 6, 'unlocated', 10, 6),      -- Art 7

-- Location 2 (Sector 7): 2 Entities
('Unit 734-Omega', 'Poltergeist', 9, 'unlocated', 2, 8),   -- Art 6
('Sector 7 Deserter', 'Vampire', 5, 'unlocated', 2, 1),    -- Art 3

-- Location 8 (Neo-Tokyo): 2 Entities
('Automaton Zeta', 'Poltergeist', 6, 'unlocated', 8, 8),   -- Art 13
('Eldritch Eye', 'Poltergeist', 8, 'unlocated', 8, 4),      -- Art 13

-- Single Occupancy Locations
('Valerius the Cruel', 'Vampire', 8, 'unlocated', 1, 1),    -- Art 1 (Loc 1)
('Whisper-in-Walls', 'Poltergeist', 3, 'unlocated', 3, 2),  -- Art 17 (Loc 3)
('Astro-Lich Kel''Thuz', 'Wraith', 10, 'unlocated', 9, 4),  -- Art 11 (Loc 9)
('Goliath Prime', 'Vampire', 9, 'unlocated', 12, 3),        -- Art 18 (Loc 12) - NEW
('Blood-Baron Vane', 'Vampire', 7, 'unlocated', 13, 1),      -- Art 12 (Loc 13)
('Ignis the Scorched', 'Wraith', 7, 'unlocated', 15, 5),    -- Art 19 (Loc 15) - NEW
('Chernobyl Stalker', 'Wraith', 8, 'unlocated', 14, 4),     -- Art 9 (Loc 14) - NEW
('The Blackwood Banshee', 'Poltergeist', 7, 'unlocated', 6, 7); -- Art 10 (Loc 6) - NEW

-- 4. ARTIFACTS (The Arsenal)
INSERT INTO Artifacts (artifact_name, artifact_type, origin, location_id, artifact_power, status) VALUES 
('Sun-Forged Blade', 'Weapon', 'Solar Forge', 1, 850, 'Active'),      -- Art 1
('Void Anchor', 'Relic', 'The Far Realm', 5, 1200, 'Active'),        -- Art 2
('Silver Stake', 'Tool', 'Vanguard Labs', 2, 150, 'Active'),         -- Art 3
('Iron-Salt Urn', 'Utility', 'Old World', 5, 200, 'Active'),         -- Art 4
('Cryo-Blaster MK IV', 'Weapon', 'Aether Labs', 5, 650, 'Active'),   -- Art 5
('EMP Grenade', 'Utility', 'Sector 7', 2, 300, 'Active'),            -- Art 6
('Cold-Iron Shackles', 'Tool', 'The Crucible', 10, 400, 'Active'),   -- Art 7
('Abyssal Pearl', 'Relic', 'Ocean Floor', 10, 950, 'Active'),        -- Art 8
('Lead-Lined Amulet', 'Charm', 'Chernobyl', 14, 250, 'Active'),      -- Art 9
('Banshee''s Gag', 'Tool', 'Blackwood', 6, 180, 'Active'),           -- Art 10
('Null-Gravity Field', 'Utility', 'Orbital Station', 9, 500, 'Active'),-- Art 11
('Dragon-Bone Spear', 'Weapon', 'Hollow Earth', 13, 750, 'Active'),  -- Art 12
('True-Sight Goggles', 'Tool', 'Neo-Tokyo', 8, 120, 'Active'),       -- Art 13
('Phylactery Breaker', 'Weapon', 'Catacombs', 5, 880, 'Active'),     -- Art 14
('Thermal Lance', 'Weapon', 'Glass Desert', 5, 700, 'Active'),       -- Art 15
('Spirit Magnet', 'Utility', 'Void Rim', 5, 340, 'Active'),          -- Art 16
('Consecrated Salt', 'Utility', 'Vatican', 3, 100, 'Active'),        -- Art 17
('Heavy Gravity Maul', 'Weapon', 'Deep Core', 12, 920, 'Active'),    -- Art 18 - NEW (Loc 12)
('Solar Flare Rig', 'Weapon', 'Glass Desert', 15, 800, 'Active'),    -- Art 19 - NEW (Loc 15)
('Ecto-Containment Unit', 'Tool', 'Aegis HQ', 6, 450, 'Active');     -- Art 20 - NEW (Loc 6)


-- 5. WEAKNESSES (The Tactical Data)
INSERT INTO Weaknesses (weakness_name, description, entity_type, artifact_id) VALUES 
('Solar Exposure', 'Sun-Forged energy incinerates undead flesh.', 'Vampire', 1),
('Dimensional Anchoring', 'Stabilizes shifting forms.', 'Wraith', 2),
('Heart Piercing', 'Standard silver penetration protocol.', 'Vampire', 3),
('Salt-Circle Entrapment', 'Blocks poltergeist movement.', 'Poltergeist', 4),
('Endothermic Shock', 'Freezes ectoplasmic mist.', 'Wraith', 5),
('EM Pulse', 'Disrupts electrical possession.', 'Poltergeist', 6),
('Iron Binding', 'Cold iron burns ancient Vampire skin.', 'Vampire', 7),
('Ethereal Siphon', 'Drains energy from aquatic Wraiths.', 'Wraith', 8),
('Lead Shielding', 'Blocks radioactive aura.', 'Wraith', 9),
('Acoustic Dampening', 'Mutes kinetic energy.', 'Poltergeist', 10),
('Gravity Well', 'Crushes dense physical forms.', 'Wraith', 11),
('Ancient Bone Piercing', 'Bypasses regenerative shields.', 'Vampire', 12),
('Thermal Sight', 'Tracks heat-signatures of cloaked entities.', 'Poltergeist', 13),
('Soul Shredding', 'Damages the essence of a Wraith.', 'Wraith', 14),
('Molecular Agitation', 'Effective against ice-aligned Wraiths.', 'Wraith', 15),
('Magnetic Trapping', 'Prevents Wraith dispersion.', 'Wraith', 16),
('Consecrated Barrier', 'Repels poltergeists from salt-rich zones.', 'Poltergeist', 17),
('Crushing Force', 'Physical weight overwhelms high durability.', 'Vampire', 18),
('Intense Incineration', 'Concentrated heat burns through ice-wraiths.', 'Wraith', 19),
('Ecto-Extraction', 'Vacuums spiritual energy into a core.', 'Poltergeist', 20);

-- 6. HUNTERS (The Operatives)
INSERT INTO Hunters (hunter_name, rank, type, faction) VALUES 
('Zane Miller', 'Rookie', 'Scout', 'Vanguard'), 
('Elena Vance', 'Elite', 'Collector', 'The Silent Order'), 
('Kaelen Highwind', 'Master', 'Attacker', 'Independent'),
('Jax "Boomer" Taggart', 'Veteran', 'Attacker', 'The Iron Syndicate'),
('Seraphina Thorne', 'Master', 'Attacker', 'The Silent Order'),
('Crosshair', 'Elite', 'Attacker', 'Vanguard'),
('Brother Silas', 'Veteran', 'Attacker', 'The Holy Militant'),
('Maya Lin', 'Rookie', 'Scout', 'Neo-Tokyo Runners'),
('Dr. Aris Thorne', 'Elite', 'Collector', 'Aegis Core'),
('Gunnar Bloodaxe', 'Master', 'Attacker', 'Independent'),
('Nyx', 'Elite', 'Scout', 'The Shadows'),
('Captain Graves', 'Veteran', 'Attacker', 'Vanguard'),
('Subject Zero', 'Unknown', 'Attacker', 'Classified'),
('Finn "Fish" Waters', 'Rookie', 'Collector', 'Aegis Core'),
('Reaper-7', 'Master', 'Attacker', 'The Iron Syndicate');

-- 7

INSERT INTO PenaltyTypes (penalty_type, description) VALUES
('ArtifactLost',      'A discovered artifact is reset back to Unlocated status.'),
('EntitySpawned',     'A new entity is generated by combining attributes of existing entities.'),
('EntityResurrected', 'A neutralized entity is restored to active and its artifact Wasted.');

select * from PenaltyTypes
------------------------------------------
GO
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
drop procedure ScoutingMission
GO
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

---------------------------------------------------------------------------------------------------------------
GO
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
drop procedure Get_Artifacts_At_Location


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
            WHEN status = 'Discovered' THEN 'Available in Field'
            WHEN status = 'Active' THEN 'Ready to be used'
            WHEN status = 'Used' THEN 'Can no longer be used'
        END AS lifecycleState

    FROM Artifacts
    WHERE location_id = @LocationID AND status <> 'Unlocated'
    ORDER BY artifact_name ASC;
END;


DROP PROCEDURE sp_DashBoard_cards

 
GO
CREATE  OR ALTER PROCEDURE sp_DashBoard_cards
  
    @EntityCount INT OUTPUT,
    @ActiveEntity INT OUTPUT,
    @OpCount INT OUTPUT,
    @OpRecorded INT OUTPUT,
    @CountDeployedHunters INT OUTPUT,
    @LocationExplored INT OUTPUT,
    @TotalArtifacts INT OUTPUT,
    @ArtifactsUnlocked INT OUTPUT
      With recompile
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
DROP PROCEDURE sp_EntityRegistry

GO
CREATE OR ALTER PROCEDURE sp_EntityRegistry
AS 
BEGIN

    Select E.true_name,E.entity_species,E.terror_index,E.existence_state,L.location_name,B.bloodline_name from Entities As E
    left join Locations as L on L.location_id = E.current_lair_id
    left join Bloodlines as B on B.bloodline_id = E.bloodline_id
    WHERE E.existence_state <> 'unlocated'

END

---------------------------------------------------------------------------------------------------------------------------------------------
DROP PROCEDURE sp_GettopTerrorEntity

GO
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
DROP PROCEDURE sp_GetHunterLeaderboard

GO
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

-----------------------------------------------------------------------------------------
DROP PROCEDURE sp_starting_attack

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
DROP PROCEDURE sp_addingentity_for_attack

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
DROP PROCEDURE Get_Artifacts_At_Location_GamsPlay

GO
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
DROP PROCEDURE sp_artifactselection

GO
CREATE OR ALTER PROCEDURE sp_artifactselection 
@sessionid int,
@artifact_id int,
@riddle_solved bit
AS 
BEGIN 
    update ATTACKER_GAME_LOG
    set artifact_id  = @artifact_id,
        riddle_solved = @riddle_solved
    where session_id = @sessionid
END;

---------------------------------------------------------------------

-- Launch attack
drop procedure LaunchAttack
CREATE OR ALTER PROCEDURE LaunchAttack
@SessionID int
AS 
BEGIN
    SET NOCOUNT ON;
    DECLARE @LocID int, @HunID int, @entity_id int, @artifact_id int;
    DECLARE @riddle_solved int = 1; 
    DECLARE @hunterrank int, @artifact_power int;
    DECLARE @resistance float, @win_ratio float = 0, @attackpower float = 0;
    DECLARE @EntityName VARCHAR(100), @ArtifactName VARCHAR(100);

    SELECT @LocID = location_id, @HunID = hunter_id, @entity_id = entity_id, 
           @artifact_id = artifact_id, @riddle_solved = riddle_solved
    FROM ATTACKER_GAME_LOG 
    WHERE session_id = @SessionID;

    SELECT @EntityName = true_name FROM Entities WHERE entity_id = @entity_id;
    SELECT @ArtifactName = artifact_name FROM Artifacts WHERE artifact_id = @artifact_id;
    SELECT @artifact_power = ISNULL(artifact_power, 0) FROM Artifacts WHERE artifact_id = @artifact_id;
    SELECT @hunterrank = ISNULL(rank_level, 0) FROM Hunters WHERE hunter_id = @HunID;
    SELECT @resistance = CAST(ISNULL(terror_index, 0) AS FLOAT) * 10 
    FROM Entities WHERE entity_id = @entity_id;
    
    SET @attackpower = CAST(@artifact_power AS FLOAT) + (@hunterrank * 2);           
    SET @win_ratio = ISNULL(@attackpower / NULLIF(@attackpower + @resistance, 0), 0);

    IF @win_ratio > 0.85
    BEGIN 
        UPDATE Artifacts SET status = 'Used' WHERE artifact_id = @artifact_id;
        UPDATE Hunters SET rank_level = rank_level + 1 WHERE hunter_id = @HunID;
        UPDATE Entities SET existence_state = 'neutralized' WHERE entity_id = @entity_id;
        
        INSERT INTO Operations (hunter_id, entity_id, location_id, artifact_id, operation_date, outcome)
        VALUES (@HunID, @entity_id, @LocID, @artifact_id, GETDATE(), 'neutralized');

        SELECT '[SUCCESSFUL MISSION]' AS Result, 
               ROUND(@win_ratio, 3) AS Win_Probability, 
               'Hunter Promoted' AS Message,
               'Target ' + @EntityName + ' neutralized via ' + @ArtifactName AS DetailedMessage;
    END 
    ELSE
    BEGIN
        -- 1. LOG THE OUTCOME
        INSERT INTO Operations (hunter_id, entity_id, location_id, artifact_id, operation_date, outcome)
        VALUES (NULL, @entity_id, @LocID, @artifact_id, GETDATE(), 'archived');

        -- 2. DELETE GAME LOG FIRST (breaks FK reference to hunter)
        DELETE FROM ATTACKER_GAME_LOG WHERE hunter_id = @HunID;

        -- 3. NOW safe to delete hunter
        DELETE FROM Hunters WHERE hunter_id = @HunID;

        SELECT 'FAILURE' AS Result, 
               ROUND(@win_ratio, 3) AS Win_Probability, 
               'Hunter has been eliminated' AS Message,
               'Mission failed. ' + @EntityName + ' remains at large.' AS DetailedMessage;
    END
END
SELECT * FROM Operations


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


select * from ATTACKER_GAME_LOG
------------------------ WEAKNESSS TABBBBBBBB -----------

SELECT * FROM "Weaknesses"
DROP PROCEDURE sp_FireRandomPenalty

go
CREATE OR ALTER PROCEDURE sp_FireRandomPenalty
    @hunter_id INT
AS
BEGIN
    DECLARE @random INT = FLOOR(RAND() * 2) + 1

    IF @random = 1
        EXEC sp_PenaltyLoseArtifact @hunter_id
    ELSE
        EXEC sp_PenaltyResurrectEntity @hunter_id
END


----------- Penalty Type 1 Artifact Reset
DROP PROCEDURE sp_PenaltyLoseArtifact

go
CREATE OR ALTER PROCEDURE sp_PenaltyLoseArtifact
    @hunter_id INT
AS
BEGIN
    DECLARE @artifact_id INT

    SELECT TOP 1 @artifact_id = artifact_id
    FROM Artifacts
    WHERE status = 'Discovered'
    ORDER BY NEWID()


    IF @artifact_id IS NULL
    BEGIN
        SELECT 'No active artifacts to lose' AS message
        RETURN
    END

    BEGIN TRANSACTION

        UPDATE Artifacts
        SET status = 'Unlocated'
        WHERE artifact_id = @artifact_id

        INSERT INTO Penalties (hunter_id, penalty_type, penalty_description, affected_id)
        SELECT @hunter_id, penalty_type, description, @artifact_id
        FROM PenaltyTypes
        WHERE penalty_type = 'ArtifactLost'

    COMMIT

    SELECT 'Artifact lost: ' + artifact_name AS message
    FROM Artifacts WHERE artifact_id = @artifact_id

END

--UPDATE Artifacts SET status = 'Discovered' WHERE artifact_id = 1
--UPDATE Artifacts SET status = 'Discovered' WHERE artifact_id = 2

EXEC sp_PenaltyLoseArtifact @hunter_id = 2


-- check artifact was reset
SELECT artifact_id, artifact_name, status FROM Artifacts

-- check penalty was logged
SELECT * FROM Penalties



---------- Penalty Type 3 Entity Resurruction
DROP PROCEDURE sp_PenaltyResurrectEntity

go
CREATE OR ALTER PROCEDURE sp_PenaltyResurrectEntity
    @hunter_id INT
AS
BEGIN
    DECLARE @entity_id INT
    DECLARE @Entity_Species VARCHAR(50) = ''
    DECLARE @artifact_id INT = NULL

    SELECT TOP 1 
        @entity_id = entity_id,
        @Entity_Species = entity_species
    FROM Entities
    WHERE existence_state = 'neutralized'
    ORDER BY NEWID()

    IF @entity_id IS NULL
    BEGIN
        SELECT 'No neutralized entities available' AS message
        RETURN
    END

    SELECT @artifact_id = artifact_id 
    FROM Weaknesses 
    WHERE entity_type = @Entity_Species

    BEGIN TRANSACTION

        UPDATE Entities
        SET existence_state = 'active'
        WHERE entity_id = @entity_id

        UPDATE Artifacts
        SET status = 'Used'
        WHERE artifact_id = @artifact_id

        INSERT INTO Penalties (hunter_id, penalty_type, penalty_description, affected_id)
        SELECT @hunter_id, penalty_type, description, @entity_id
        FROM PenaltyTypes
        WHERE penalty_type = 'EntityResurrected'

    COMMIT

    SELECT 'SYSTEM CORRUPTED � ' + E.true_name + ' RESURRECTED // Artifact destroyed' AS message
    FROM Entities E WHERE E.entity_id = @entity_id
END


EXEC sp_PenaltyResurrectEntity @hunter_id = 1

SELECT entity_id, true_name, existence_state FROM Entities
SELECT artifact_id, artifact_name, status FROM Artifacts
SELECT * FROM Penalties



---------------------------- Encryption System -----------

-- Genration of ENcryption of Weakness name of the selected entity (based on entity_specie of the selected Entity 
DROP PROCEDURE sp_GenerateShift
go
CREATE OR ALTER PROCEDURE sp_GenerateShift
    @Entity_species VARCHAR(50) = '',
    @hunter_id INT
AS 
BEGIN

    DECLARE @locked_until DATETIME
    SELECT @locked_until = locked_until 
    FROM Decryption_Attempts 
    WHERE hunter_id = @hunter_id

    IF @locked_until IS NOT NULL AND @locked_until > GETDATE()
    BEGIN
        SELECT 'LOCKED � Try again after: ' + CAST(@locked_until AS VARCHAR) AS message
        RETURN
    END

    IF NOT EXISTS(Select 1 from Decryption_Attempts where hunter_id = @hunter_id)
    BEGIN
        
        INSERT INTO Decryption_Attempts (hunter_id, attempts_used, current_shift, last_attempt, locked_until) VALUES
        (@hunter_id, 0, NULL, NULL, NULL);

    END
    
    DECLARE @Weakness_name VARCHAR(50) = ''
    DECLARE @EncryptedText VARCHAR(50) = ''
    DECLARE @Shift INT = FLOOR(RAND() * 5) + 1

    Select @Weakness_name = weakness_name from Weaknesses
    Where entity_type = @Entity_Species

    IF @Weakness_name = ''
    BEGIN
        SELECT 'No weakness found for this entity type' AS message
        RETURN
    END

    DECLARE @i INT = 1 
    DECLARE @curr_Letter VARCHAR(1)
    DECLARE @ascii INT
    DECLARE @new_ascii INT

    WHILE @i <= LEN(@Weakness_name)
    BEGIN
        SET @curr_Letter = SUBSTRING(@Weakness_name, @i, 1)
        SET @ascii = ASCII(@curr_Letter)

        IF @ascii BETWEEN 65 AND 90  -- A-Z
        BEGIN
            SET @new_ascii = ((@ascii - 65 + @Shift) % 26) + 65
            SET @EncryptedText = @EncryptedText + CHAR(@new_ascii)
        END
        ELSE IF @ascii BETWEEN 97 AND 122  -- a-z
        BEGIN
            SET @new_ascii = ((@ascii - 97 + @Shift) % 26) + 97
            SET @EncryptedText = @EncryptedText + CHAR(@new_ascii)
        END
        ELSE  -- space or anything else
        BEGIN
            SET @EncryptedText = @EncryptedText + ' '
        END

        SET @i = @i + 1
    END

    BEGIN TRANSACTION
    UPDATE Decryption_Attempts
    SET encrypted_text = @EncryptedText, current_shift = @Shift ,last_attempt = GETDATE(), entity_species = @Entity_species
    Where @hunter_id = hunter_id

    COMMIT

    SELECT 
    @EncryptedText AS encrypted_text,
    @Shift         AS shift_hint,
    'Cipher generated � crack the code' AS message


END

-- Checking of decryption
drop procedure sp_CheckDecryption
go
CREATE OR ALTER PROCEDURE sp_CheckDecryption
    @hunter_id INT,
    @UserGuess VARCHAR(50),
    @Entity_species VARCHAR(50) = ''
AS
BEGIN

    DECLARE @locked_until DATETIME;

    SELECT @locked_until = locked_until
    FROM Decryption_Attempts
    WHERE hunter_id = @hunter_id;

    IF @locked_until IS NOT NULL AND @locked_until > GETDATE()
    BEGIN
        SELECT 'LOCKED!! Try again after: ' + CAST(@locked_until AS VARCHAR) AS message;
        RETURN;
    END


    DECLARE @attempts INT;
    DECLARE @current_shift INT;
    DECLARE @stored_encrypted VARCHAR(50);

    SELECT 
        @attempts = attempts_used,
        @current_shift = current_shift,
        @stored_encrypted = encrypted_text
    FROM Decryption_Attempts
    WHERE hunter_id = @hunter_id;

    IF @current_shift IS NULL OR @stored_encrypted IS NULL
    BEGIN
        SELECT 'No active cipher to decrypt.' AS message;
        RETURN;
    END


    DECLARE 
        @i INT = 1,
        @curr CHAR(1),
        @ascii INT,
        @new_ascii INT,
        @ReEncrypted VARCHAR(50) = '';

    WHILE @i <= LEN(@UserGuess)
    BEGIN
        SET @curr = SUBSTRING(@UserGuess, @i, 1);
        SET @ascii = ASCII(@curr);

        IF @ascii BETWEEN 65 AND 90       -- A-Z
            SET @new_ascii = ((@ascii - 65 + @current_shift) % 26) + 65;
        ELSE IF @ascii BETWEEN 97 AND 122 -- a-z
            SET @new_ascii = ((@ascii - 97 + @current_shift) % 26) + 97;
        ELSE
            SET @new_ascii = @ascii;

        SET @ReEncrypted += CHAR(@new_ascii);
        SET @i += 1;
    END


    IF @ReEncrypted = @stored_encrypted
    BEGIN
        UPDATE Weaknesses
        SET is_decrypted = 1
        WHERE entity_type = @Entity_species;

        UPDATE Decryption_Attempts
        SET attempts_used = 0,
            current_shift = NULL,
            encrypted_text = NULL,
            locked_until = NULL
        WHERE hunter_id = @hunter_id;

        SELECT 'DECRYPTION SUCCESSFUL!! Weakness unlocked' AS message;
        RETURN;
    END


    UPDATE Decryption_Attempts
    SET attempts_used = attempts_used + 1,
        last_attempt = GETDATE()
    WHERE hunter_id = @hunter_id;

    SET @attempts = @attempts + 1;


    IF @attempts >= 3
    BEGIN
        UPDATE Decryption_Attempts
        SET locked_until = DATEADD(DAY, 1, GETDATE()),
            attempts_used = 0
        WHERE hunter_id = @hunter_id;

        EXEC sp_FireRandomPenalty @hunter_id;

        SELECT 'SECURITY BREACH!! Penalty fired. Locked for 24 hours' AS message;
        RETURN;
    END

    SELECT 'Wrong code!! Attempts remaining: ' 
           + CAST(3 - @attempts AS VARCHAR) AS message;
END


-- generate cipher for Vampire weakness for hunter 1
EXEC sp_GenerateShift @Entity_species = 'Vampire', @hunter_id = 2

-- try wrong answer
EXEC sp_CheckDecryption @hunter_id = 2, @Userguess = 'Garlic', @Entity_species = 'Vampire'

-- try correct shift (use whatever shift was generated)
EXEC sp_CheckDecryption @hunter_id = 2, @Userguess = 'Heart Piercing', @Entity_species = 'Vampire'

-- verify
SELECT * FROM Decryption_Attempts
SELECT * FROM Weaknesses

select * from Artifacts
update artifacts
set status = 'Unlocated'
where status = 'Active' or status = 'Discovered'

select * from hunters 
select * from Locations
select * from Artifacts
select * from Operations
select * from artifacts
update Artifacts
set status = 'Unlocated'
where status = 'Active' or status = 'Discovered' or status = 'Used'

delete from Operations
EXEC ScoutingMission @locationID = 1, @hunterID = 1
SELECT * FROM Operations ORDER BY operation_date DESC
select * from Decryption_Attempts
select * from PenaltyTypes
delete from Decryption_Attempts
delete from Penalties
delete from PenaltyTypes
-- Reset all decryption attempts

-- Reset all weaknesses back to encrypted
UPDATE Weaknesses
SET is_decrypted = 0
WHERE is_decrypted = 1;
delete from ATTACKER_GAME_LOG
select * from ATTACKER_GAME_LOG
EXEC LaunchAttack @SessionID = 1011
-- Run this with your actual session_id
SELECT session_id, location_id, hunter_id, entity_id, artifact_id 
FROM ATTACKER_GAME_LOG 
WHERE session_id = 1011

select * from ATTACKER_GAME_LOG