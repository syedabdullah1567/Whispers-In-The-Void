
USE [Whispers-in-the-void]

DROP TABLE IF EXISTS PenaltyTypes;
DROP TABLE IF EXISTS Penalties;
DROP TABLE IF EXISTS Decryption_Attempts;
DROP TABLE IF EXISTS Weaknesses;



CREATE TABLE Weaknesses (
    weakness_id INT IDENTITY(1,1) PRIMARY KEY,
    weakness_name VARCHAR(100) NOT NULL,
    description VARCHAR(MAX),
    entity_type VARCHAR(50) NOT NULL,
    artifact_id INT,
    is_decrypted BIT DEFAULT 0,
    FOREIGN KEY (artifact_id)
        REFERENCES Artifacts(artifact_id)
        ON DELETE SET NULL
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




------------------------ WEAKNESSS TABBBBBBBB -----------


CREATE OR ALTER PROCEDURE sp_FireRandomPenalty
    @hunter_id INT
AS
BEGIN
    DECLARE @random INT = FLOOR(RAND() * 3) + 1

    IF @random = 1
        EXEC sp_PenaltyLoseArtifact @hunter_id
    ELSE IF @random = 2
        EXEC sp_PenaltySpawnEntity @hunter_id
    ELSE
        EXEC sp_PenaltyResurrectEntity @hunter_id
END



----------- Penalty Type 1 Artifact Reset

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




----------- Penalty Type 2 Spawn Entity

CREATE OR ALTER PROCEDURE sp_PenaltySpawnEntity
    @hunter_id INT
AS
BEGIN
    DECLARE @Loc_id INT = NULL
    DECLARE @Entity_Species VARCHAR(50) = ''
    DECLARE @Terror_Index INT = NULL
    DECLARE @Bloodline INT = NULL

    DECLARE @count INT = 0
    SELECT @count = COUNT(*) FROM Entities WHERE true_name LIKE 'Manifested Anomaly%'


    DECLARE @entity_name VARCHAR(100) = 
    CASE 
        WHEN @count = 0 THEN 'Manifested Anomaly'
        ELSE 'Manifested Anomaly ' + CAST(@count + 1 AS VARCHAR)
    END

    -- Location of Anomaly
    SELECT TOP 1 @Loc_id = location_id
    FROM Locations
    WHERE risk_level >= 6
    ORDER BY NEWID()


    IF @Loc_id IS NULL
    BEGIN
            SELECT TOP 1 @Loc_id = location_id
            FROM Locations
            ORDER BY risk_level DESC
    END

    -- Species of the Anomaly
    SELECT TOP 1 @Entity_Species = entity_species
    FROM Entities
    ORDER BY NEWID()

    -- Terror Index of Anomaly
    SET @Terror_Index = FLOOR(RAND() * 5) + 6

    -- BloodLine of Anomaly
    SELECT TOP 1 @Bloodline = bloodline_id
    FROM Bloodlines
    ORDER BY NEWID()



    BEGIN TRANSACTION

    -- Insertion of Entity

    INSERT INTO Entities (true_name, entity_species, terror_index, existence_state, current_lair_id, bloodline_id) VALUES 
    (@entity_name , @Entity_Species, @Terror_Index, 'active', @Loc_id, @Bloodline)

    DECLARE @Entity_id INT = SCOPE_IDENTITY();

    INSERT INTO Penalties (hunter_id, penalty_type, penalty_description, affected_id)
    SELECT @hunter_id, penalty_type, description, @Entity_id
    FROM PenaltyTypes
    WHERE penalty_type = 'EntitySpawned'

    COMMIT


    SELECT 'Anomaly spawned: ' + @Entity_Species + ' with terror index ' + CAST(@Terror_Index AS VARCHAR) AS message


END


EXEC sp_PenaltySpawnEntity @hunter_id = 2

-- check new entity was created
SELECT * FROM Entities 

-- check penalty was logged
SELECT * FROM Penalties



---------- Penalty Type 3 Entity Resurruction
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

    SELECT 'SYSTEM CORRUPTED — ' + E.true_name + ' RESURRECTED // Artifact destroyed' AS message
    FROM Entities E WHERE E.entity_id = @entity_id
END


EXEC sp_PenaltyResurrectEntity @hunter_id = 1

SELECT entity_id, true_name, existence_state FROM Entities
SELECT artifact_id, artifact_name, status FROM Artifacts
SELECT * FROM Penalties



---------------------------- Encryption System -----------

-- Genration of ENcryption of Weakness name of the selected entity (based on entity_specie of the selected Entity 
DROP PROCEDURE sp_GenerateShift
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
        SELECT 'LOCKED — Try again after: ' + CAST(@locked_until AS VARCHAR) AS message
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
            SET @EncryptedText = @EncryptedText
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
    'Cipher generated — crack the code' AS message


END

-- Checking of decryption
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
GO


-- generate cipher for Vampire weakness for hunter 1
EXEC sp_GenerateShift @Entity_species = 'Vampire', @hunter_id = 2

-- try wrong answer
EXEC sp_CheckDecryption @hunter_id = 1, @Shift = 5, @Entity_species = 'Vampire'

-- try correct shift (use whatever shift was generated)
EXEC sp_CheckDecryption @hunter_id = 1, @Shift = 4, @Entity_species = 'Vampire'

-- verify
SELECT * FROM Decryption_Attempts
SELECT * FROM Weaknesses


