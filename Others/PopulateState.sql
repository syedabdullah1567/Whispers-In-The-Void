-- 1. LOCATIONS (The Global & Cosmic Theater)
INSERT INTO Locations (location_name, location_type, capacity, risk_level) VALUES 
('The Sunken Cathedral', 'Ruins', 12, 9),       
('Sector 7 Outpost', 'Military', 50, 3),       
('Ironwood Forest', 'Forest', 100, 6),         
('Echoing Catacombs', 'Underground', 15, 7),     
('Aether Lab 4', 'Laboratory', 8, 5),            
('Blackwood Asylum', 'Urban Ruins', 25, 8),    
('The Howling Peaks', 'Mountain', 40, 7),       
('Neo-Tokyo Grid', 'Cyber-Slum', 200, 6),       
('Abandoned Orbital Station', 'Space', 10, 10),  
('Mariana Trench Facility', 'Underwater', 15, 9),
('The Whispering Wastes', 'Desert', 500, 8),    
('Obsidian Citadel', 'Fortress', 50, 10),        
('Hollow Earth Nexus', 'Subterranean', 100, 9),
('Chernobyl Exclusion Zone', 'Irradiated', 30, 8),
('The Glass Desert', 'Anomalous', 20, 7);       

-- 2. BLOODLINES (The Heritage of Nightmares)
INSERT INTO Bloodlines (bloodline_name, origin_realm, dominant_trait, legacy_threat_modifier) VALUES 
('The Crimson Brood', 'Underworld', 'Vampirism', 3),       -- ID 1
('Frost-Walkers', 'Niflheim', 'Cryokinesis', 4),          -- ID 2
('Obsidian Guard', 'Abyssal Deep', 'Durability', 2),      -- ID 3
('Void-Born', 'The Far Realm', 'Reality Warping', 5),     -- ID 4
('The Ashen Court', 'Plane of Fire', 'Pyrokinesis', 4),   -- ID 5
('The Deep Ones', 'Sunken RL yeh', 'Aquatic Mutation', 3),-- ID 6
('Fae Wilds', 'The Twilight Realm', 'Illusion', 4),       -- ID 7
('Clockwork Legion', 'Mechanus', 'Technomancy', 3);       -- ID 8

-- 3. ENTITIES (The High-Value Targets)
INSERT INTO Entities (true_name, entity_species, terror_index, existence_state, current_lair_id, bloodline_id) VALUES 
-- Location 5 (Hub): 6 Entities
('Xylo-Thul', 'Wraith', 10, 'unlocated', 5, 4),           -- Art 2
('Morana Prime', 'Wraith', 9, 'unlocated', 5, 4),          -- Art 5
('Glacia', 'Wraith', 6, 'unlocated', 5, 2),              -- Art 14
('The Lab-Stalker', 'Wraith', 7, 'unlocated', 5, 4),       -- Art 15
('Alpha Poltergeist', 'Poltergeist', 8, 'unlocated', 5, 8),-- Art 4
('Wraith-Echo', 'Wraith', 4, 'unlocated', 5, 4),           -- Art 16

-- Location 10 (Abyssal): 2 Entities
('Abyssal Leviathan', 'Wraith', 10, 'unlocated', 10, 6),   -- Art 8
('Cthulian Scout', 'Vampire', 6, 'unlocated', 10, 6),      -- Art 7

-- Location 2 (Sector 7): 2 Entities
('Unit 734-Omega', 'Poltergeist', 9, 'unlocated', 2, 8),   -- Art 6
('Sector 7 Deserter', 'Vampire', 5, 'unlocated', 2, 1),    -- Art 3

-- Location 8 (Neo-Tokyo): 2 Entities
('Automaton Zeta', 'Poltergeist', 6, 'unlocated', 8, 8),   -- Art 13
('Eldritch Eye', 'Poltergeist', 8, 'unlocated', 8, 4),      -- Art 13

-- Single Occupancy Locations
('Valerius the Cruel', 'Vampire', 8, 'unlocated', 1, 1),    -- Art 1 (Loc 1)
('Whisper-in-Walls', 'Poltergeist', 3, 'unlocated', 3, 2),  -- Art 17 (Loc 3)
('Astro-Lich Kel''Thuz', 'Wraith', 10, 'unlocated', 9, 4),  -- Art 11 (Loc 9)
('Goliath Prime', 'Vampire', 9, 'unlocated', 12, 3),        -- Art 18 (Loc 12) - NEW
('Blood-Baron Vane', 'Vampire', 7, 'unlocated', 13, 1),      -- Art 12 (Loc 13)
('Ignis the Scorched', 'Wraith', 7, 'unlocated', 15, 5),    -- Art 19 (Loc 15) - NEW
('Chernobyl Stalker', 'Wraith', 8, 'unlocated', 14, 4),     -- Art 9 (Loc 14) - NEW
('The Blackwood Banshee', 'Poltergeist', 7, 'unlocated', 6, 7); -- Art 10 (Loc 6) - NEW

-- 4. ARTIFACTS (The Arsenal)
INSERT INTO Artifacts (artifact_name, artifact_type, origin, location_id, status) VALUES 
('Sun-Forged Blade', 'Weapon', 'Solar Forge', 1, 'Active'),      -- Art 1
('Void Anchor', 'Relic', 'The Far Realm', 5, 'Active'),          -- Art 2
('Silver Stake', 'Tool', 'Vanguard Labs', 2, 'Active'),          -- Art 3
('Iron-Salt Urn', 'Utility', 'Old World', 5, 'Active'),          -- Art 4
('Cryo-Blaster MK IV', 'Weapon', 'Aether Labs', 5, 'Active'),    -- Art 5
('EMP Grenade', 'Utility', 'Sector 7', 2, 'Active'),             -- Art 6
('Cold-Iron Shackles', 'Tool', 'The Crucible', 10, 'Active'),    -- Art 7
('Abyssal Pearl', 'Relic', 'Ocean Floor', 10, 'Active'),         -- Art 8
('Lead-Lined Amulet', 'Charm', 'Chernobyl', 14, 'Active'),       -- Art 9
('Banshee''s Gag', 'Tool', 'Blackwood', 6, 'Active'),            -- Art 10
('Null-Gravity Field', 'Utility', 'Orbital Station', 9, 'Active'),-- Art 11
('Dragon-Bone Spear', 'Weapon', 'Hollow Earth', 13, 'Active'),   -- Art 12
('True-Sight Goggles', 'Tool', 'Neo-Tokyo', 8, 'Active'),        -- Art 13
('Phylactery Breaker', 'Weapon', 'Catacombs', 5, 'Active'),      -- Art 14
('Thermal Lance', 'Weapon', 'Glass Desert', 5, 'Active'),        -- Art 15
('Spirit Magnet', 'Utility', 'Void Rim', 5, 'Active'),           -- Art 16
('Consecrated Salt', 'Utility', 'Vatican', 3, 'Active'),         -- Art 17
('Heavy Gravity Maul', 'Weapon', 'Deep Core', 12, 'Active'),     -- Art 18 - NEW (Loc 12)
('Solar Flare Rig', 'Weapon', 'Glass Desert', 15, 'Active'),     -- Art 19 - NEW (Loc 15)
('Ecto-Containment Unit', 'Tool', 'Aegis HQ', 6, 'Active');       -- Art 20 - NEW (Loc 6)


-- 5. WEAKNESSES (The Tactical Data)
INSERT INTO Weaknesses (weakness_name, description, entity_type, artifact_id) VALUES 
('Solar Exposure', 'Sun-Forged energy incinerates undead flesh.', 'Vampire', 1),
('Dimensional Anchoring', 'Stabilizes shifting forms.', 'Wraith', 2),
('Heart Piercing', 'Standard silver penetration protocol.', 'Vampire', 3),
('Salt-Circle Entrapment', 'Blocks poltergeist movement.', 'Poltergeist', 4),
('Endothermic Shock', 'Freezes ectoplasmic mist.', 'Wraith', 5),
('EM Pulse', 'Disrupts electrical possession.', 'Poltergeist', 6),
('Iron Binding', 'Cold iron burns ancient Vampire skin.', 'Vampire', 7),
('Ethereal Siphon', 'Drains energy from aquatic Wraiths.', 'Wraith', 8),
('Lead Shielding', 'Blocks radioactive aura.', 'Wraith', 9),
('Acoustic Dampening', 'Mutes kinetic energy.', 'Poltergeist', 10),
('Gravity Well', 'Crushes dense physical forms.', 'Wraith', 11),
('Ancient Bone Piercing', 'Bypasses regenerative shields.', 'Vampire', 12),
('Thermal Sight', 'Tracks heat-signatures of cloaked entities.', 'Poltergeist', 13),
('Soul Shredding', 'Damages the essence of a Wraith.', 'Wraith', 14),
('Molecular Agitation', 'Effective against ice-aligned Wraiths.', 'Wraith', 15),
('Magnetic Trapping', 'Prevents Wraith dispersion.', 'Wraith', 16),
('Consecrated Barrier', 'Repels poltergeists from salt-rich zones.', 'Poltergeist', 17),
('Crushing Force', 'Physical weight overwhelms high durability.', 'Vampire', 18),
('Intense Incineration', 'Concentrated heat burns through ice-wraiths.', 'Wraith', 19),
('Ecto-Extraction', 'Vacuums spiritual energy into a core.', 'Poltergeist', 20);


-- 6. HUNTERS (The Operatives)
INSERT INTO Hunters (hunter_name, rank, type, faction) VALUES 
('Zane Miller', 'Rookie', 'Scout', 'Vanguard'), 
('Elena Vance', 'Elite', 'Collector', 'The Silent Order'), 
('Kaelen Highwind', 'Master', 'Attacker', 'Independent'),
('Jax "Boomer" Taggart', 'Veteran', 'Attacker', 'The Iron Syndicate'),
('Seraphina Thorne', 'Master', 'Attacker', 'The Silent Order'),
('Crosshair', 'Elite', 'Attacker', 'Vanguard'),
('Brother Silas', 'Veteran', 'Attacker', 'The Holy Militant'),
('Maya Lin', 'Rookie', 'Scout', 'Neo-Tokyo Runners'),
('Dr. Aris Thorne', 'Elite', 'Collector', 'Aegis Core'),
('Gunnar Bloodaxe', 'Master', 'Attacker', 'Independent'),
('Nyx', 'Elite', 'Scout', 'The Shadows'),
('Captain Graves', 'Veteran', 'Attacker', 'Vanguard'),
('Subject Zero', 'Unknown', 'Attacker', 'Classified'),
('Finn "Fish" Waters', 'Rookie', 'Collector', 'Aegis Core'),
('Reaper-7', 'Master', 'Attacker', 'The Iron Syndicate');

-- 7

INSERT INTO PenaltyTypes (penalty_type, description) VALUES
('ArtifactLost',      'A discovered artifact is reset back to Unlocated status.'),
('EntitySpawned',     'A new entity is generated by combining attributes of existing entities.'),
('EntityResurrected', 'A neutralized entity is restored to active and its artifact Wasted.');