const db = require('../db');

module.exports = async function handler(req, res) {
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
      const success = db.deleteContact(id);
      
      if (!success) {
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

      const updatedContact = db.updateContact(id, { name, email, phone });
      
      if (!updatedContact) {
        return res.status(404).json({ error: 'Contact not found' });
      }

      return res.json(updatedContact);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
