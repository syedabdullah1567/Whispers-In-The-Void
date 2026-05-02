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
('Xylo-Thul', 'Void Horror', 10, 'active', 1, 4),
('Morana Prime', 'Lich', 9, 'active', 4, 4),
('Valerius the Cruel', 'Vampire', 8, 'active', 1, 1),
('Glacia', 'Wraith', 6, 'active', 3, 2),
('Korg the Breaker', 'Ogre', 5, 'active', 3, 3),
('Morana Echo', 'Lich', 5, 'active', 4, 4),
('Whisper-in-Walls', 'Poltergeist', 3, 'active', 2, 2),
('Ignis the Scorched', 'Fire Elemental', 7, 'active', 15, 5),
('Cthulian Scout', 'Deep One', 6, 'active', 10, 6),
('Titania''s Shadow', 'Dark Fae', 8, 'active', 3, 7),
('Unit 734-Omega', 'Cyber-Demon', 9, 'active', 8, 8),
('The Weeping Lady', 'Banshee', 7, 'active', 6, 2),
('Goliath Prime', 'Behemoth', 9, 'active', 12, 3),
('Silas the Flayer', 'Vampire Lord', 9, 'active', 6, 1),
('Abyssal Leviathan', 'Sea Terror', 10, 'active', 10, 6),
('Chernobog Aspect', 'Radiation Demon', 9, 'active', 14, 4),
('The Skinwalker', 'Shapeshifter', 6, 'active', 11, 7),
('Astro-Lich Kel''Thuz', 'Space Lich', 10, 'active', 9, 4),
('Yeti King', 'Frost Giant', 7, 'active', 7, 2),
('Automaton Zeta', 'Rogue AI', 6, 'active', 5, 8),
('Blood-Baron Vane', 'Vampire', 7, 'active', 13, 1),
('Magma Wyrm', 'Dragon', 9, 'active', 12, 5),
('Void-Spawn Alpha', 'Void Horror', 8, 'active', 9, 4),
('The Rat King', 'Mutant Swarm', 5, 'active', 8, 6),
('Eldritch Eye', 'Watcher', 8, 'active', 13, 4);


-- 4. ARTIFACTS (The Arsenal)
INSERT INTO Artifacts (artifact_name, artifact_type, origin, location_id, status) VALUES 
('Sun-Forged Blade', 'Weapon', 'Solar Forge', 1, 'Unlocated'),         
('Void Anchor', 'Relic', 'The Far Realm', 5, 'Unlocated'),         
('Silver Stake', 'Tool', 'Vanguard Labs', 2, 'Unlocated'),              
('Iron-Salt Urn', 'Utility', 'Old World', 3, 'Unlocated'),             
('Cryo-Blaster MK IV', 'Weapon', 'Aether Labs', 5, 'Unlocated'),        
('EMP Grenade', 'Utility', 'Sector 7', 2, 'Unlocated'),                 
('Cold-Iron Shackles', 'Tool', 'The Crucible', 12, 'Unlocated'),      
('Abyssal Pearl', 'Relic', 'Ocean Floor', 10, 'Unlocated'),            
('Lead-Lined Amulet', 'Charm', 'Chernobyl', 14, 'Unlocated'),           
('Banshee''s Gag', 'Tool', 'Blackwood', 6, 'Unlocated'),                
('Null-Gravity Field', 'Utility', 'Orbital Station', 9, 'Unlocated'),  
('Dragon-Bone Spear', 'Weapon', 'Hollow Earth', 13, 'Unlocated'),      
('True-Sight Goggles', 'Tool', 'Neo-Tokyo', 8, 'Unlocated'),            
('Phylactery Breaker', 'Weapon', 'Catacombs', 4, 'Unlocated'),         
('Thermal Lance', 'Weapon', 'Glass Desert', 15, 'Unlocated');         


-- 5. WEAKNESSES (The Tactical Data)
INSERT INTO Weaknesses (weakness_name, description, entity_type, artifact_id) VALUES 
('Solar Exposure', 'Sun-Forged energy incinerates undead flesh.', 'Vampire', 1),
('Dimensional Anchoring', 'Stabilizes reality to weaken void entities.', 'Void Horror', 2),
('Heart Piercing', 'Standard silver penetration protocol.', 'Vampire', 3),
('Physical Manifestation', 'Forces spectral entities into a tangible state.', 'Wraith', 4),
('Salt-Circle Entrapment', 'Blocks poltergeist movement.', 'Poltergeist', 4),
('Endothermic Shock', 'Rapid freezing shatters elemental cores.', 'Fire Elemental', 5),
('Circuit Fry', 'Overloads neural and mechanical pathways.', 'Cyber-Demon', 6),
('Circuit Fry', 'Overloads artificial intelligence matrices.', 'Rogue AI', 6),
('Fae-Bane', 'Cold iron burns and binds twilight beings.', 'Dark Fae', 7),
('Dehydration Ward', 'Siphons moisture from aquatic mutants.', 'Deep One', 8),
('Radiation Dampening', 'Strips the demon of its irradiated aura.', 'Radiation Demon', 9),
('Sonic Nullification', 'Silences the deadly scream of the spirit.', 'Banshee', 10),
('Mass Displacement', 'Renders heavy targets immobile and helpless.', 'Behemoth', 11),
('Scale Puncture', 'The only material hard enough to pierce dragon scales.', 'Dragon', 12),
('Form Lock', 'Forces shapeshifters back into their true, vulnerable form.', 'Shapeshifter', 13),
('Soul Severance', 'Shatters the arcane link to their phylactery.', 'Lich', 14),
('Core Melt', 'Melts through glacial armor instantly.', 'Frost Giant', 15);


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