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

INSERT INTO Artifacts (artifact_name, artifact_type, origin, location_id) VALUES 
('Sun-Forged Blade', 'Weapon', 'Solar Forge', 5),
('Cloak of Displacement', 'Charm', 'Elven Realm', 1),
('Codex Gigas', 'Tome', 'Monastery', 3),
('Eye of Horus', 'Relic', 'Ancient Egypt', 2);

INSERT INTO Weaknesses (weakness_name, description, entity_type, artifact_id) VALUES 
('Holy Water Burn', 'Concentrated holy water causes acidic reactions.', 'Vampire', 3),
('High-Frequency Sound', 'Disrupts the physical form of spectral beings.', 'Poltergeist', 4),
('Iron-Salt Circle', 'Prevents movement across the boundary.', 'Wraith', 1);

INSERT INTO Abilities (ability_name, description, artifact_id) VALUES 
('Banishment', 'Sends a low-level entity back to its origin realm.', 3),
('True Sight', 'Reveals invisible or phased entities.', 2),
('Flame Burst', 'Engulfs the weapon in holy fire.', 4);

INSERT INTO Hunters (hunter_name, rank, type, faction) VALUES 
('Zane Miller', 'Rookie', 'Scout', 'Vanguard'), 
('Elena Vance', 'Elite', 'Collector', 'The Silent Order'), 
('Kaelen Highwind', 'Master', 'Attacker', 'Independent');

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









