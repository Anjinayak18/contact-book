// Simple in-memory database for Vercel deployment
// In production, you should use a proper database service like:
// - Vercel Postgres
// - PlanetScale
// - Supabase
// - MongoDB Atlas

let contacts = [];
let nextId = 1;

// Initialize with some sample data
if (contacts.length === 0) {
  contacts = [
    { id: 1, name: "John Doe", email: "john@example.com", phone: "1234567890" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "0987654321" }
  ];
  nextId = 3;
}

const db = {
  // Get all contacts with pagination
  getContacts: (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    const total = contacts.length;
    const data = contacts.slice(offset, offset + limit);
    
    return {
      data,
      page,
      limit,
      total
    };
  },

  // Get contact by ID
  getContact: (id) => {
    return contacts.find(contact => contact.id === parseInt(id));
  },

  // Create new contact
  createContact: (contactData) => {
    const newContact = {
      id: nextId++,
      name: contactData.name,
      email: contactData.email,
      phone: contactData.phone
    };
    contacts.push(newContact);
    return newContact;
  },

  // Update contact
  updateContact: (id, contactData) => {
    const index = contacts.findIndex(contact => contact.id === parseInt(id));
    if (index === -1) return null;
    
    contacts[index] = {
      ...contacts[index],
      name: contactData.name,
      email: contactData.email,
      phone: contactData.phone
    };
    return contacts[index];
  },

  // Delete contact
  deleteContact: (id) => {
    const index = contacts.findIndex(contact => contact.id === parseInt(id));
    if (index === -1) return false;
    
    contacts.splice(index, 1);
    return true;
  },

  // Get total count
  getCount: () => {
    return contacts.length;
  }
};

module.exports = db;
