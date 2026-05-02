INSERT INTO Locations (location_name, location_type, capacity, risk_level) VALUES 
('The Sunken Cathedral', 'Ruins', 12, 9),     
('Sector 7 Outpost', 'Military', 50, 3),      
('Ironwood Forest', 'Forest', 100, 6),         
('Echoing Catacombs', 'Underground', 15, 7),   
('Aether Lab 4', 'Laboratory', 8, 5);      

INSERT INTO Bloodlines (bloodline_name, origin_realm, dominant_trait, legacy_threat_modifier) VALUES 
('The Crimson Brood', 'Underworld', 'Vampirism', 3),     -- ID 1
('Frost-Walkers', 'Niflheim', 'Cryokinesis', 4),        -- ID 2
('Obsidian Guard', 'Abyssal Deep', 'Durability', 2),    -- ID 3
('Void-Born', 'The Far Realm', 'Reality Warping', 5);   -- ID 4

INSERT INTO Entities (true_name, entity_species, terror_index, existence_state, current_lair_id, bloodline_id) VALUES 
('Xylo-Thul', 'Void Horror', 10, 'active', 1, 4),
('Morana Prime', 'Lich', 9, 'active', 4, 4),
('Valerius the Cruel', 'Vampire', 8, 'active', 1, 1),
('Glacia', 'Wraith', 6, 'active', 3, 2),
('Korg the Breaker', 'Ogre', 5, 'active', 3, 3),
('Morana Echo', 'Lich', 5, 'active', 4, 4),
('Whisper-in-Walls', 'Poltergeist', 3, 'active', 2, 2);

INSERT INTO Artifacts (artifact_name, artifact_type, origin, location_id, status) VALUES 
('Sun-Forged Blade', 'Weapon', 'Solar Forge', 1, 'Unlocated'),     -- ID 1 (For Valerius)
('Void Anchor', 'Relic', 'The Far Realm', 5, 'Unlocated'),         -- ID 2 (For Xylo-Thul)
('Silver Stake', 'Tool', 'Vanguard Labs', 2, 'Unlocated'),         -- ID 3 (For Vampires)
('Iron-Salt Urn', 'Utility', 'Old World', 3, 'Unlocated');         -- ID 4 (For Spectral)

INSERT INTO Weaknesses (weakness_name, description, entity_type, artifact_id) VALUES 
('Solar Exposure', 'Sun-Forged energy incinerates undead flesh.', 'Vampire', 1),
('Dimensional Anchoring', 'Stabilizes reality to weaken void entities.', 'Void Horror', 2),
('Heart Piercing', 'Standard silver penetration protocol.', 'Vampire', 3),
('Physical Manifestation', 'Forces spectral entities into a tangible, vulnerable state.', 'Wraith', 4),
('Salt-Circle Entrapment', 'Blocks poltergeist movement.', 'Poltergeist', 4);

INSERT INTO Hunters (hunter_name, rank, type, faction) VALUES 
('Zane Miller', 'Rookie', 'Scout', 'Vanguard'), 
('Elena Vance', 'Elite', 'Collector', 'The Silent Order'), 
('Kaelen Highwind', 'Master', 'Attacker', 'Independent');