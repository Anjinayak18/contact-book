const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database setup
const dbFile = path.join(process.cwd(), 'backend', 'contacts.db');
const db = new sqlite3.Database(dbFile, (err) => {
  if (err) console.error('DB open error:', err.message);
  else console.log('Connected to SQLite DB:', dbFile);
});

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;

  try {
    if (req.method === 'DELETE') {
      // Delete contact
      const result = await new Promise((resolve, reject) => {
        db.run('DELETE FROM contacts WHERE id = ?', [id], function(err) {
          if (err) reject(err);
          else resolve(this.changes);
        });
      });

      if (result === 0) {
        return res.status(404).json({ error: 'Contact not found' });
      }

      return res.status(204).end();
    }

    if (req.method === 'PUT') {
      // Update contact
      const { name, email, phone } = req.body;
      
      if (!name || !email || !phone) {
        return res.status(400).json({ error: 'name, email and phone are required' });
      }

      const result = await new Promise((resolve, reject) => {
        const sql = 'UPDATE contacts SET name = ?, email = ?, phone = ? WHERE id = ?';
        db.run(sql, [name, email, phone, id], function(err) {
          if (err) reject(err);
          else resolve(this.changes);
        });
      });

      if (result === 0) {
        return res.status(404).json({ error: 'Contact not found' });
      }

      const updatedContact = await new Promise((resolve, reject) => {
        db.get('SELECT * FROM contacts WHERE id = ?', [id], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });

      return res.json(updatedContact);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
