const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'ctf_toolkit.db');
const db = new Database(dbPath);

console.log('Connected to SQLite database.');

function initializeDatabase() {
  // Audit log table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS tool_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tool_name TEXT NOT NULL,
      category TEXT NOT NULL,
      input_params TEXT,
      output_text TEXT,
      error_text TEXT,
      status TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  // Uploads table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS uploads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      original_name TEXT NOT NULL,
      stored_name TEXT NOT NULL,
      file_path TEXT NOT NULL,
      file_type TEXT,
      size INTEGER,
      upload_time DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  console.log('Database tables initialized.');
}

initializeDatabase();

module.exports = db;