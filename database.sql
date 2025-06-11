-- Script de création de la base de données
CREATE DATABASE IF NOT EXISTS webcraft_briefs;
USE webcraft_briefs;

-- Table pour stocker les briefs
CREATE TABLE IF NOT EXISTS briefs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    projet_nom VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    whatsapp VARCHAR(50),
    activite TEXT,
    objectif TEXT,
    pages TEXT,
    fonctionnalites TEXT,
    delai VARCHAR(50),
    `precision` TEXT,
    fichiers TEXT,
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_json JSON,
    statut ENUM('nouveau', 'en_cours', 'termine') DEFAULT 'nouveau',
    notes_admin TEXT
);

-- Index pour améliorer les performances
CREATE INDEX idx_email ON briefs(email);
CREATE INDEX idx_date ON briefs(date_creation);
CREATE INDEX idx_statut ON briefs(statut);

-- Table pour les administrateurs (optionnel)
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insérer un admin par défaut (mot de passe: admin123)
INSERT INTO admins (username, password_hash, email) VALUES 
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@webcraft.com');
