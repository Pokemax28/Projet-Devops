// File: backend/db.js
// Initialize SQLite database and create tables if they don't exist.

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Path to SQLite database file
const dbPath = path.resolve(__dirname, './database/tickets.db');
// Open (or create) the database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('Connected to SQLite database at', dbPath);
});

// Initialize tables
db.serialize(() => {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      mot_de_passe TEXT NOT NULL,
      role TEXT CHECK(role IN ('Employé','Technicien','Admin')) NOT NULL,
      date_inscription TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tickets table
  db.run(`
    CREATE TABLE IF NOT EXISTS tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titre TEXT NOT NULL,
      description TEXT,
      statut TEXT CHECK(statut IN ('Ouvert','En cours','Résolu','Fermé')) NOT NULL DEFAULT 'Ouvert',
      priorite TEXT CHECK(priorite IN ('Faible','Moyenne','Élevée','Critique')) NOT NULL DEFAULT 'Moyenne',
      date_creation TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      date_mise_a_jour TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      id_employe INTEGER NOT NULL,
      id_technicien INTEGER,
      FOREIGN KEY(id_employe) REFERENCES users(id),
      FOREIGN KEY(id_technicien) REFERENCES users(id)
    )
  `);

  // Comments table
  db.run(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticket_id INTEGER NOT NULL,
      auteur_id INTEGER NOT NULL,
      contenu TEXT NOT NULL,
      date_commentaire TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(ticket_id) REFERENCES tickets(id),
      FOREIGN KEY(auteur_id) REFERENCES users(id)
    )
  `);
});

module.exports = db;

