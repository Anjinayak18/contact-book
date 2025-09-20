const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Database
const dbFile = path.join(__dirname, 'contacts.db');
const db = new sqlite3.Database(dbFile, (err) => {
  if (err) console.error('DB open error:', err.message);
  else console.log('Connected to SQLite DB:', dbFile);
});

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

// Routes
app.post('/contacts', (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'name, email and phone are required' });
  }
  if (!isValidEmail(email) || !isValidPhone(phone)) {
    return res.status(400).json({ error: 'invalid email or phone format' });
  }
  const sql = 'INSERT INTO contacts (name, email, phone) VALUES (?, ?, ?)';
  db.run(sql, [name, email, phone], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    db.get('SELECT * FROM contacts WHERE id = ?', [this.lastID], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json(row);
    });
  });
});

app.get('/contacts', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, parseInt(req.query.limit) || 10);
  const offset = (page - 1) * limit;
  db.all('SELECT * FROM contacts LIMIT ? OFFSET ?', [limit, offset], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    db.get('SELECT COUNT(*) AS total FROM contacts', (err, countRow) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ data: rows, page, limit, total: countRow.total });
    });
  });
});

app.delete('/contacts/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM contacts WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'not found' });
    res.sendStatus(204);
  });
});

// Health
app.get('/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
