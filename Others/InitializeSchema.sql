DROP TABLE IF EXISTS Operations;
DROP TABLE IF EXISTS Hunter_Abilities;
DROP TABLE IF EXISTS Abilities;
DROP TABLE IF EXISTS Weaknesses;
DROP TABLE IF EXISTS Artifacts;
DROP TABLE IF EXISTS Hunters;
DROP TABLE IF EXISTS Entities;
DROP TABLE IF EXISTS Locations;
DROP TABLE IF EXISTS Bloodlines;

CREATE TABLE Bloodlines (
    bloodline_id INT IDENTITY(1,1) PRIMARY KEY,
    bloodline_name VARCHAR(100) NOT NULL,
    origin_realm VARCHAR(100),
    dominant_trait VARCHAR(100),
    legacy_threat_modifier INT NOT NULL
);

CREATE TABLE Locations (
    location_id INT IDENTITY(1,1) PRIMARY KEY,
    location_name VARCHAR(100) NOT NULL,
    location_type VARCHAR(50),
    capacity INT CHECK (capacity >= 0),
    risk_level INT CHECK (risk_level BETWEEN 1 AND 10)
);

CREATE TABLE Entities (
    entity_id INT IDENTITY(1,1) PRIMARY KEY,
    true_name VARCHAR(100) NOT NULL,
    entity_species VARCHAR(50) NOT NULL,
    terror_index INT CHECK (terror_index BETWEEN 1 AND 10),
    existence_state VARCHAR(20) NOT NULL
        CHECK (existence_state IN ('active', 'neutralized', 'archived')),
    current_lair_id INT,
    bloodline_id INT,
    FOREIGN KEY (current_lair_id)
        REFERENCES Locations(location_id)
        ON DELETE SET NULL,
    FOREIGN KEY (bloodline_id)
        REFERENCES Bloodlines(bloodline_id)
        ON DELETE SET NULL
);

CREATE TABLE Hunters (
    hunter_id INT IDENTITY(1,1) PRIMARY KEY,
    hunter_name VARCHAR(100) NOT NULL,
    rank VARCHAR(50) NOT NULL,
    type VARCHAR(20) NOT NULL,
    faction VARCHAR(100),
    CONSTRAINT CHK_HunterType CHECK (type IN ('Scout', 'Collector', 'Attacker'))
);

CREATE TABLE Artifacts (
    artifact_id INT IDENTITY(1,1) PRIMARY KEY,
    artifact_name VARCHAR(100) NOT NULL,
    artifact_type VARCHAR(50),
    origin VARCHAR(100),
    location_id INT,
    status VARCHAR(20) NOT NULL DEFAULT 'Unlocated',
    CONSTRAINT CHK_ArtifactState CHECK (status IN ('Unlocated', 'Discovered', 'Active', 'Used')),
    FOREIGN KEY (location_id)
        REFERENCES Locations(location_id)
        ON DELETE SET NULL
);

CREATE TABLE Weaknesses (
    weakness_id INT IDENTITY(1,1) PRIMARY KEY,
    weakness_name VARCHAR(100) NOT NULL,
    description VARCHAR(MAX),
    entity_type VARCHAR(50) NOT NULL,
    artifact_id INT,
    FOREIGN KEY (artifact_id)
        REFERENCES Artifacts(artifact_id)
        ON DELETE SET NULL
);

CREATE TABLE Operations (
    operation_id INT IDENTITY(1,1) PRIMARY KEY,
    hunter_id INT NOT NULL,
    entity_id INT,
    location_id INT NOT NULL,
    artifact_id INT,
    weakness_id INT,
    operation_date DATE NOT NULL,
    outcome VARCHAR(20) NOT NULL
        CHECK (outcome IN ('Scouting', 'Collection', 'Attacking')),
    FOREIGN KEY (hunter_id)
        REFERENCES Hunters(hunter_id)
        ON DELETE CASCADE,
    FOREIGN KEY (entity_id)
        REFERENCES Entities(entity_id)
        ON DELETE CASCADE,
    FOREIGN KEY (location_id)
        REFERENCES Locations(location_id)
        ON DELETE CASCADE,
    FOREIGN KEY (artifact_id)
        REFERENCES Artifacts(artifact_id)
        ON DELETE CASCADE,
    FOREIGN KEY (weakness_id)
        REFERENCES Weaknesses(weakness_id)
        ON DELETE CASCADE
);









