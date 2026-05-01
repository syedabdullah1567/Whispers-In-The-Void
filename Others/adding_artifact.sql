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
            WHEN status = 'Active' THEN 'Available in Field'
            WHEN status = 'Used' THEN 'Already Collected'
        END AS lifecycleState

    FROM Artifacts
    WHERE location_id = @LocationID
    ORDER BY artifact_name ASC;
END;
