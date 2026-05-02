-- Getting Top terror Threat signatures

CREATE PROCEDURE sp_GettopTerrorEntity
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

EXEC sp_GettopTerrorEntity
