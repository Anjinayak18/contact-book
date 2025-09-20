const db = require('./db');

// Helpers
function isValidEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email);
}

function isValidPhone(phone) {
  return /^\d{10}$/.test(phone);
}

module.exports = async function handler(req, res) {
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
      
      const result = db.getContacts(page, limit);
      return res.json(result);
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

      const newContact = db.createContact({ name, email, phone });
      return res.status(201).json(newContact);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
