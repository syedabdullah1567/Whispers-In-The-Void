CREATE PROCEDURE sp_DashBoard_cards
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


