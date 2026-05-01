-- For Entity Registry
CREATE PROCEDURE sp_EntityRegistry
AS 
BEGIN

    Select E.true_name,E.entity_species,E.terror_index,E.existence_state,L.location_name,B.bloodline_name from Entities As E
    left join Locations as L on L.location_id = E.current_lair_id
    left join Bloodlines as B on B.bloodline_id = E.bloodline_id

END

EXEC sp_EntityRegistry
