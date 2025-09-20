const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database setup
const dbFile = path.join(process.cwd(), 'backend', 'contacts.db');
const db = new sqlite3.Database(dbFile, (err) => {
  if (err) console.error('DB open error:', err.message);
  else console.log('Connected to SQLite DB:', dbFile);
});

// Initialize database
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL
  )`);
});

// Helpers
function isValidEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email);
}

function isValidPhone(phone) {
  return /^\d{10}$/.test(phone);
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      // Get contacts with pagination
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.max(1, parseInt(req.query.limit) || 10);
      const offset = (page - 1) * limit;
      
      const rows = await new Promise((resolve, reject) => {
        db.all('SELECT * FROM contacts LIMIT ? OFFSET ?', [limit, offset], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });

      const countRow = await new Promise((resolve, reject) => {
        db.get('SELECT COUNT(*) AS total FROM contacts', (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });

      return res.json({ data: rows, page, limit, total: countRow.total });
    }

    if (req.method === 'POST') {
      // Create new contact
      const { name, email, phone } = req.body;
      
      if (!name || !email || !phone) {
        return res.status(400).json({ error: 'name, email and phone are required' });
      }
      
      if (!isValidEmail(email) || !isValidPhone(phone)) {
        return res.status(400).json({ error: 'invalid email or phone format' });
      }

      const result = await new Promise((resolve, reject) => {
        const sql = 'INSERT INTO contacts (name, email, phone) VALUES (?, ?, ?)';
        db.run(sql, [name, email, phone], function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        });
      });

      const newContact = await new Promise((resolve, reject) => {
        db.get('SELECT * FROM contacts WHERE id = ?', [result], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });

      return res.status(201).json(newContact);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
