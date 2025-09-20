import React, { useState, useEffect } from 'react';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';
import Pagination from './components/Pagination';
import './App.css';

// Sample data
const defaultContacts = [
  { id: 1, name: "John Doe", email: "john@example.com", phone: "1234567890" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "0987654321" }
];

function App(){
  // Initialize contacts from localStorage or default data
  const getInitialContacts = () => {
    const saved = localStorage.getItem('contacts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing saved contacts:', e);
        return defaultContacts;
      }
    }
    return defaultContacts;
  };

  const [contacts, setContacts] = useState(() => getInitialContacts());
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);

  // Calculate total and current page data
  const total = contacts.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const currentPageContacts = contacts.slice(startIndex, endIndex);

  // Save contacts to localStorage whenever contacts change
  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  const addContact = (contact) => {
    const newId = Math.max(...contacts.map(c => c.id), 0) + 1;
    const newContact = { ...contact, id: newId };
    setContacts(prev => [newContact, ...prev]);
  };

  const deleteContact = (id) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="container">
      <h1>Contact Book</h1>
      <div className="grid">
        <div className="card" style={{flex:'1 1 300px'}}>
          <ContactForm onAdd={addContact} />
        </div>
        <div style={{flex:'2 1 400px'}}>
          <ContactList contacts={currentPageContacts} onDelete={deleteContact} />
          <Pagination page={page} total={total} limit={limit} onChange={setPage} />
        </div>
      </div>
    </div>
  );
}

export default App;
