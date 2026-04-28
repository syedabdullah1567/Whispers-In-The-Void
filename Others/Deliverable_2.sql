-- INSERT Statements

INSERT INTO Locations (location_name, location_type, capacity, risk_level) VALUES 
('The Sunken Cathedral', 'Ruins', 12, 9),
('Sector 7 Outpost', 'Military', 50, 3),
('Ironwood Forest', 'Forest', 100, 6),
('Echoing Catacombs', 'Underground', 15, 7),
('Aether Lab 4', 'Laboratory', 8, 5);

INSERT INTO Bloodlines (bloodline_name, origin_realm, dominant_trait, legacy_threat_modifier) VALUES 
('The Crimson Brood', 'Underworld', 'Vampirism', 3),
('Frost-Walkers', 'Niflheim', 'Cryokinesis', 4),
('Silver-Tongued', 'Ethereal Plane', 'Mind Control', 5),
('Obsidian Guard', 'Abyssal Deep', 'Durability', 2);

INSERT INTO Entities (true_name, entity_species, terror_index, existence_state, current_lair_id, bloodline_id) VALUES 
('Valerius the Cruel', 'Vampire', 8, 'active', 3, 3),
('Glacia', 'Wraith', 6, 'active', 2, 4),
('Korg the Breaker', 'Ogre', 5, 'archived', 1, 2),
('Xylo-Thul', 'Void Horror', 10, 'active', 1, 2),
('Morana Prime', 'Lich', 9, 'neutralized', 4, 1),
('Morana Echo', 'Lich', 5, 'neutralized', 4, 1),
('Whisper-in-Walls', 'Poltergeist', 3, 'active', 2, 2);

INSERT INTO Artifacts (artifact_name, artifact_type, origin, location_id, isFound) VALUES 
('Sun-Forged Blade', 'Weapon', 'Solar Forge', 5, 0),
('Cloak of Displacement', 'Charm', 'Elven Realm', 1, 0),
('Codex Gigas', 'Tome', 'Monastery', 3, 0),
('Eye of Horus', 'Relic', 'Ancient Egypt', 2, 0);

INSERT INTO Weaknesses (weakness_name, description, entity_type, artifact_id) VALUES 
('Holy Water Burn', 'Concentrated holy water causes acidic reactions.', 'Vampire', 3),
('High-Frequency Sound', 'Disrupts the physical form of spectral beings.', 'Poltergeist', 4),
('Iron-Salt Circle', 'Prevents movement across the boundary.', 'Wraith', 1);

INSERT INTO Abilities (ability_name, description, artifact_id) VALUES 
('Banishment', 'Sends a low-level entity back to its origin realm.', 3),
('True Sight', 'Reveals invisible or phased entities.', 2),
('Flame Burst', 'Engulfs the weapon in holy fire.', 4);

INSERT INTO Hunters (hunter_name, rank, specialization, faction) VALUES 
('Zane Miller', 'Rookie', 'Tracking', 'Vanguard'), 
('Elena Vance', 'Elite', 'Pyromancy', 'The Silent Order'), 
('Kaelen Highwind', 'Master', 'Sealing Arts', 'Independent');

INSERT INTO Hunter_Abilities (hunter_id, ability_id, unlock_date) VALUES 
(1, 2, '2026-01-15'),
(1, 1, '2026-03-01'),
(3, 2, '2026-03-20');

INSERT INTO Operations (hunter_id, entity_id, location_id, artifact_id, weakness_id, operation_date, outcome) VALUES 
(1, 4, 4, 3, 3, '2026-02-15', 'neutralized'),
(2, 1, 1, 4, 2, '2026-03-10', 'archived'),
(3, 7, 1, 2, 2, '2026-03-12', 'recorded'),
(2, 5, 5, 1, 1, '2026-03-18', 'neutralized'),
(3, 2, 4, 2, 3, '2026-03-22', 'recorded');

-- UPDATE and DELETE Queries

-- Carried out a successful operation and eliminated an entity from location 3
Update Locations 
Set capacity = capacity - 1
where location_id = 3;

-- Eliminated all entities that start with G
Delete From Entities
where true_name like 'G%'

-- SELECT FROM WHERE Queries

-- Display all locations
Select * from locations

-- Display all discovered entities
Select * from Entities

-- Group entities based on their terror index
Select terror_index as TerrorIndex, count(terror_index) as NumberOfEntities
from Entities
Group by terror_index
having count(*) > 0;

-- Display locations that contain both artifacts and entities
SELECT 
    l.location_id, 
    l.location_name
FROM Locations l
WHERE l.location_id IN (
    SELECT location_id FROM Locations
    INTERSECT
    SELECT location_id FROM Artifacts
    INTERSECT
    SELECT current_lair_id FROM Entities
)
ORDER BY l.location_id

-- Locations that have either artifacts or entities
Select location_id from Artifacts 
union
Select current_lair_id from Entities

-- Display locations that have just artifacts
SELECT 
    l.location_id, 
    l.location_name
FROM Locations l
WHERE l.location_id IN (
    SELECT location_id FROM Artifacts
    EXCEPT
    SELECT current_lair_id FROM Entities
);

-- Simple join clauses

SELECT 
    E.entity_species, 
    B.bloodline_name
FROM Entities E
JOIN Bloodlines B ON E.bloodline_id = B.bloodline_id
WHERE E.existence_state = 'active';



SELECT 
    E.entity_species, 
    B.bloodline_name
FROM Entities E
Left JOIN Bloodlines B ON E.bloodline_id = B.bloodline_id
WHERE E.existence_state = 'archived';



SELECT 
    E.entity_species, 
    B.bloodline_name
FROM Entities E
Right JOIN Bloodlines B ON E.bloodline_id = B.bloodline_id
WHERE E.existence_state = 'neutralized';


SELECT 
*
FROM Entities E
Full JOIN Bloodlines B ON E.bloodline_id = B.bloodline_id
WHERE E.existence_state = 'neutralized';

-- Nested query with aggregate functions to show locations with capacity more than average capacity

Select *
from Locations
where capacity >
(
Select AVG(capacity)
from Locations
)


-- SOME COMPLEX QUERIES

--

-- Activate found artifact
UPDATE Artifacts
SET isFound = 1
WHERE artifact_id = 3;

UPDATE Artifacts
SET isFound = 1
WHERE artifact_id = 2;

-- Give hunter 2 all abilities from unlocked artifacts, because he is about to be sent to perform an operation
INSERT INTO Hunter_Abilities (hunter_id, ability_id, unlock_date)
SELECT 2, a.ability_id, '2026-03-28'
FROM Abilities a
JOIN Artifacts ar ON a.artifact_id = ar.artifact_id
WHERE ar.isFound = 1

--
  
-- Details on how to defeat active entities
SELECT 
    E.entity_species, 
    B.bloodline_name, 
    W.entity_type, 
    W.weakness_name AS how_to_kill
FROM Entities E
JOIN Bloodlines B ON E.bloodline_id = B.bloodline_id
JOIN Operations O ON E.entity_id = O.entity_id
JOIN Weaknesses W ON O.weakness_id = W.weakness_id
WHERE E.existence_state = 'active';


-- For each bloodline and location type, how difficult were the hunts?
SELECT 
    B.bloodline_name,
    L.location_type,
    COUNT(E.entity_id) AS total_neutralized,
    MAX(E.terror_index) AS highest_threat_slain,
    AVG(E.terror_index) AS average_difficulty
FROM Entities E
JOIN Bloodlines B ON E.bloodline_id = B.bloodline_id
JOIN Locations L ON E.current_lair_id = L.location_id
WHERE E.existence_state = 'neutralized'
GROUP BY B.bloodline_name, L.location_type
HAVING COUNT(E.entity_id) > 0
ORDER BY average_difficulty DESC;