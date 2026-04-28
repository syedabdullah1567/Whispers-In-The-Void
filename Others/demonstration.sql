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