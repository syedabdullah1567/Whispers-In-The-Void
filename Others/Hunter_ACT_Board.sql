-- For Displaying hunter info history for Each hunter
CREATE PROCEDURE sp_GetHunterLeaderboard

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

EXEC sp_GetHunterLeaderboard
