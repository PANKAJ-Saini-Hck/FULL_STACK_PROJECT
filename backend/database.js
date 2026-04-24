const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'ctf_toolkit.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to SQLite database.');
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    // Audit log for all tool usage
    db.run(`CREATE TABLE IF NOT EXISTS tool_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tool_name TEXT NOT NULL,
      category TEXT NOT NULL,
      input_params TEXT,
      output_text TEXT,
      error_text TEXT,
      status TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Store references to uploaded files
    db.run(`CREATE TABLE IF NOT EXISTS uploads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      original_name TEXT NOT NULL,
      stored_name TEXT NOT NULL,
      file_path TEXT NOT NULL,
      file_type TEXT,
      size INTEGER,
      upload_time DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    console.log('Database tables initialized.');
  });
}

module.exports = db;
