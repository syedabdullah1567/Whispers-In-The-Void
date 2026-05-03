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
-- Hub: Aether Lab 4 (Location 5) - The "5-and-5" synchronized zone
('Xylo-Thul', 'Wraith', 10, 'unlocated', 5, 4),        -- Weakness: Dimensional Anchoring (Art 2)
('Morana Prime', 'Wraith', 9, 'unlocated', 5, 4),       -- Weakness: Endothermic Shock (Art 5)
('Glacia', 'Wraith', 6, 'unlocated', 5, 2),             -- Weakness: Soul Shredding (Art 14)
('The Lab-Stalker', 'Wraith', 7, 'unlocated', 5, 4),    -- Weakness: Molecular Agitation (Art 15)
('Alpha Poltergeist', 'Poltergeist', 8, 'unlocated', 5, 8), -- Weakness: Physical Manifestation (Art 4)

-- Other Synchronized Locations
('Valerius the Cruel', 'Vampire', 8, 'unlocated', 1, 1), -- Weakness: Solar Exposure (Art 1)
('Unit 734-Omega', 'Poltergeist', 9, 'unlocated', 2, 8), -- Weakness: EM Pulse (Art 6)
('Sector 7 Deserter', 'Vampire', 5, 'unlocated', 2, 1),  -- Weakness: Heart Piercing (Art 3)
('Whisper-in-Walls', 'Poltergeist', 3, 'unlocated', 3, 2), -- Weakness: Salt-Circle (Art 4)
('Automaton Zeta', 'Poltergeist', 6, 'unlocated', 8, 8),   -- Weakness: Thermal Sight (Art 13)
('Eldritch Eye', 'Poltergeist', 8, 'unlocated', 8, 4),    -- Weakness: Thermal Sight (Art 13)
('Astro-Lich Kel''Thuz', 'Wraith', 10, 'unlocated', 9, 4), -- Weakness: Gravity Well (Art 11 - Moved)
('Abyssal Leviathan', 'Wraith', 10, 'unlocated', 10, 6),  -- Weakness: Ethereal Siphon (Art 8)
('Cthulian Scout', 'Vampire', 6, 'unlocated', 10, 6),    -- Weakness: Iron Binding (Art 7 - Moved)
('Goliath Prime', 'Vampire', 9, 'unlocated', 12, 3),     -- Weakness: Iron Binding (Art 7)
('Blood-Baron Vane', 'Vampire', 7, 'unlocated', 13, 1),   -- Weakness: Ancient Bone (Art 12)
('Ignis the Scorched', 'Wraith', 7, 'unlocated', 15, 5); -- Weakness: Molecular Agitation (Art 15)

-- 4. ARTIFACTS (The Arsenal)
INSERT INTO Artifacts (artifact_name, artifact_type, origin, location_id, status) VALUES 
('Sun-Forged Blade', 'Weapon', 'Solar Forge', 1, 'Active'),      -- Vampire Slasher
('Void Anchor', 'Relic', 'The Far Realm', 5, 'Active'),          -- Wraith Anchor
('Silver Stake', 'Tool', 'Vanguard Labs', 2, 'Active'),           -- Vampire Stake
('Iron-Salt Urn', 'Utility', 'Old World', 5, 'Active'),           -- Poltergeist/Wraith Trap (Moved to Loc 5)
('Cryo-Blaster MK IV', 'Weapon', 'Aether Labs', 5, 'Active'),     -- Wraith Freezer
('EMP Grenade', 'Utility', 'Sector 7', 2, 'Active'),               -- Poltergeist Disrupter
('Cold-Iron Shackles', 'Tool', 'The Crucible', 10, 'Active'),     -- Vampire Binder (Moved to Loc 10)
('Abyssal Pearl', 'Relic', 'Ocean Floor', 10, 'Active'),          -- Wraith Siphon
('Lead-Lined Amulet', 'Charm', 'Chernobyl', 14, 'Active'),         -- Wraith Shield
('Banshee''s Gag', 'Tool', 'Blackwood', 6, 'Active'),             -- Poltergeist Mute
('Null-Gravity Field', 'Utility', 'Orbital Station', 9, 'Active'), -- Wraith/Vampire (Moved to Loc 9)
('Dragon-Bone Spear', 'Weapon', 'Hollow Earth', 13, 'Active'),    -- Vampire Regenerator Killer
('True-Sight Goggles', 'Tool', 'Neo-Tokyo', 8, 'Active'),         -- Poltergeist Tracker
('Phylactery Breaker', 'Weapon', 'Catacombs', 5, 'Active'),       -- Wraith Soul Shredder (Moved to Loc 5)
('Thermal Lance', 'Weapon', 'Glass Desert', 5, 'Active');         -- Wraith Heat Lance (Moved to Loc 5)      


-- 5. WEAKNESSES (The Tactical Data)
INSERT INTO Weaknesses (weakness_name, description, entity_type, artifact_id) VALUES 
('Solar Exposure', 'Sun-Forged energy incinerates undead flesh.', 'Vampire', 1),
('Dimensional Anchoring', 'Stabilizes the shifting form of high-tier spirits.', 'Wraith', 2),
('Heart Piercing', 'Standard silver penetration protocol.', 'Vampire', 3),
('Physical Manifestation', 'Forces spectral entities into a tangible state.', 'Wraith', 4),
('Salt-Circle Entrapment', 'Blocks poltergeist movement.', 'Poltergeist', 4),
('Endothermic Shock', 'Freezes the ectoplasmic mist of a Wraith.', 'Wraith', 5),
('EM Pulse', 'Disrupts the electrical possession of Poltergeists.', 'Poltergeist', 6),
('Iron Binding', 'Cold iron burns the skin of ancient Vampires.', 'Vampire', 7),
('Ethereal Siphon', 'Drains the energy from aquatic Wraiths.', 'Wraith', 8),
('Lead Shielding', 'Blocks the radioactive aura of corrupted Wraiths.', 'Wraith', 9),
('Acoustic Dampening', 'Mutes the kinetic energy of a Poltergeist.', 'Poltergeist', 10),
('Gravity Well', 'Crushes the dense physical form of a Vampire Lord.', 'Vampire', 11),
('Ancient Bone Piercing', 'Bypasses the regenerative blood-shield of Vampires.', 'Vampire', 12),
('Thermal Sight', 'Tracks the heat-signature of a cloaked Poltergeist.', 'Poltergeist', 13),
('Soul Shredding', 'Directly damages the essence of a Wraith.', 'Wraith', 14),
('Molecular Agitation', 'Heat-based weapon effective against ice-aligned Wraiths.', 'Wraith', 15);


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