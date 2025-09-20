// Simple API endpoint for contacts
const contacts = [
  { id: 1, name: "John Doe", email: "john@example.com", phone: "1234567890" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "0987654321" }
];

let nextId = 3;

export default function handler(req, res) {
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
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.max(1, parseInt(req.query.limit) || 10);
      const offset = (page - 1) * limit;
      
      const data = contacts.slice(offset, offset + limit);
      return res.json({ 
        data, 
        page, 
        limit, 
        total: contacts.length 
      });
    }

    if (req.method === 'POST') {
      const { name, email, phone } = req.body;
      
      if (!name || !email || !phone) {
        return res.status(400).json({ error: 'name, email and phone are required' });
      }

      const newContact = {
        id: nextId++,
        name,
        email,
        phone
      };
      
      contacts.push(newContact);
      return res.status(201).json(newContact);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
