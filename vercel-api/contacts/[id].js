// Simple API endpoint for individual contact operations
const contacts = [
  { id: 1, name: "John Doe", email: "john@example.com", phone: "1234567890" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "0987654321" }
];

export default function handler(req, res) {
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
      const index = contacts.findIndex(contact => contact.id === parseInt(id));
      
      if (index === -1) {
        return res.status(404).json({ error: 'Contact not found' });
      }

      contacts.splice(index, 1);
      return res.status(204).end();
    }

    if (req.method === 'PUT') {
      const { name, email, phone } = req.body;
      
      if (!name || !email || !phone) {
        return res.status(400).json({ error: 'name, email and phone are required' });
      }

      const index = contacts.findIndex(contact => contact.id === parseInt(id));
      
      if (index === -1) {
        return res.status(404).json({ error: 'Contact not found' });
      }

      contacts[index] = { ...contacts[index], name, email, phone };
      return res.json(contacts[index]);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
