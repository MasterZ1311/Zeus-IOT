const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, 'zeus.db');
const db = new sqlite3.Database(DB_PATH);

db.serialize(() => {
  // 1. Create Users Table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `);

  // Seed default admin if not exists
  db.get("SELECT * FROM users WHERE username = 'admin'", (err, row) => {
    if (err) console.error("Error checking users table:", err);
    if (!row) {
      const hashedPassword = bcrypt.hashSync('zeuspass', 10);
      db.run("INSERT INTO users (username, password) VALUES (?, ?)", ['admin', hashedPassword], (err) => {
        if (err) console.error("Error seeding default admin:", err);
        else console.log("Default admin seeded successfully: admin / zeuspass");
      });
    }
  });

  // 2. Create Projects Table
  db.run(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      subtitle TEXT NOT NULL,
      cat TEXT NOT NULL,
      status TEXT NOT NULL,
      nodesOnline INTEGER DEFAULT 0,
      nodesTotal INTEGER DEFAULT 1,
      icon TEXT NOT NULL
    )
  `);

  // Seed default projects if empty
  db.get("SELECT COUNT(*) AS count FROM projects", (err, row) => {
    if (err) console.error("Error checking projects table:", err);
    if (row && row.count === 0) {
      const initialProjects = [
        { id: '1', title: 'Smart Irrigation', subtitle: 'Sector 7G Node Cluster', cat: 'IoT', status: 'ACTIVE', nodesOnline: 24, nodesTotal: 24, icon: 'bolt' },
        { id: '2', title: 'RFID Attendance', subtitle: 'Main Campus Gate', cat: 'Hardware', status: 'BETA', nodesOnline: 3, nodesTotal: 4, icon: 'sensors' },
        { id: '3', title: 'HVAC Monitor V1', subtitle: 'Legacy System', cat: 'IoT', status: 'ARCHIVED', nodesOnline: 0, nodesTotal: 12, icon: 'inventory_2' }
      ];

      const stmt = db.prepare("INSERT INTO projects (id, title, subtitle, cat, status, nodesOnline, nodesTotal, icon) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
      initialProjects.forEach(p => {
        stmt.run(p.id, p.title, p.subtitle, p.cat, p.status, p.nodesOnline, p.nodesTotal, p.icon);
      });
      stmt.finalize();
      console.log("Initial projects pre-seeded successfully.");
    }
  });

  // 3. Create Contacts Table
  db.run(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      contact_no TEXT NOT NULL,
      institution TEXT,
      deadline TEXT NOT NULL,
      description TEXT,
      perf_expectation TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 4. Create Reports Table
  db.run(`
    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      contact_no TEXT NOT NULL,
      institution TEXT,
      deadline TEXT NOT NULL,
      description TEXT,
      format TEXT NOT NULL,
      way_to_make TEXT NOT NULL,
      performance_tier TEXT NOT NULL,
      file_path TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = db;
