-- Procedure For Collecting Artifact ANd updating Hunters Ability
CREATE PROCEDURE sp_CollectArtifact
    @Artifact_ID INT,
    @Hunter_ID INT,
    @Returning_Message VARCHAR(50) OUTPUT
AS 
BEGIN
    DECLARE @ART_Name VARCHAR(50) = ''

    UPDATE Artifacts 
    SET isFound = 1 , @ART_Name = artifact_name
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


DECLARE @msg VARCHAR(50)

EXEC sp_CollectArtifact 
    @Artifact_ID = 3, 
    @Hunter_ID = 2, 
    @Returning_Message = @msg OUTPUT

SELECT @msg AS Result


Select * from Hunter_Abilities