-------------------------------------------
alter table Hunters 
add rank_level int default 1 
alter table Artifacts 
add artifact_power int
select * from Artifacts
------------------------------------------------------------------------
--artifact changes 
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
        inner join Weaknesses W on A.artifact_id = W.artifact_id
        inner join Entities E on E.entity_species = W.entity_type
        where E.entity_id = @entity_id and  
        A.location_id = @LocID
        and A.status = 'Active'
        ORDER BY A.artifact_name ASC;
     
END

-------------------------------------------------------------------------
-- final attack procedure 

GO
CREATE OR ALTER PROCEDURE LaunchAttack
@SessionID int
AS 
BEGIN
--variables that were updated  
    DECLARE @LocID int;
    Declare @HunID int;
    Declare @entity_id int;
    Declare @artifact_id int;
    Declare @riddle_solved int;
 
 -- variables for calculations 
    declare @hunterrank int;
    declare @artifact_power int;
    declare @resistance float;
    declare @win_ratio float = 0;
    declare @attackpower float = 0;


 -- basic data needed for computation
    select @LocID = location_id, 
    @HunID = hunter_id , 
    @entity_id = entity_id, 
    @artifact_id = artifact_id,
    @riddle_solved = riddle_solved
    from ATTACKER_GAME_LOG 
    where session_id = @SessionID;

    select @artifact_power = ISNULL(artifact_power,0) 
    from artifacts 
    where artifact_id = @artifact_id

    select @hunterrank = ISNULL(rank_level,0) 
    from Hunters 
    where hunter_id = @HunID

    select @resistance = CAST(ISNULL(terror_index,0) as FLOAT) * 5 -- kjust scaling for correct prob
    from Entities
    where entity_id = @entity_id
    
--formula computation 
    
    if @artifact_id is NULL
        begin
            set @attackpower = 30.0 -- avoiding zero 
            if @hunterrank < 5
            begin 
                set @resistance = @resistance * 1.5;
            end 
        end 
    else 
        begin
            --compute formula 
            set @attackpower = CAST(@artifact_power as float) + (@hunterrank * 2);          
        end
    -- riddle check
    if @riddle_solved = 1
        begin 
            set @attackpower = @attackpower * 1.5;
        end

    --probabilty
    SET @win_ratio = ISNULL(@attackpower / NULLIF(@attackpower + @resistance, 0), 0);

    --decison
    --
    if @win_ratio > 0.5
    begin 
        update artifacts
        set status = 'Used'
        where artifact_id = @artifact_id
        
       
        update Hunters
        set rank_level = rank_level + 1
        where hunter_id = @HunID;
        
        insert into Operations (hunter_id, entity_id, location_id, artifact_id, operation_date, outcome)
        values (@HunID, @entity_id, @LocID, @artifact_id, GETDATE(), 'neutralized');

        select '[SUCCESSFUL MISSION]' as Result,
        ROUND(@win_ratio, 3) as Win_Probability,
        'Hunter Promoted' as message;

    END 
    ELSE
    BEGIN
        insert into Operations (hunter_id, entity_id, location_id, artifact_id, operation_date, outcome)
        values (@HunID, @entity_id, @LocID, @artifact_id, GETDATE(), 'archived');

        delete from Hunters where hunter_id = @HunID;

        select 'FAILURE' as Result,
        ROUND(@win_ratio, 3) as Win_Probability,
        'Hunter is now a monster as you failed to safe him - Status: In Resurrection' as message;
     END
END



