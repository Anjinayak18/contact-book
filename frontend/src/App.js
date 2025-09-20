import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';
import Pagination from './components/Pagination';
import './App.css';

const API_BASE = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : (process.env.REACT_APP_API_BASE || 'http://localhost:5000');

// Fallback data for when API is not available
const fallbackContacts = [
  { id: 1, name: "John Doe", email: "john@example.com", phone: "1234567890" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "0987654321" }
];

function App(){
  // Initialize contacts from localStorage or fallback data
  const getInitialContacts = () => {
    const saved = localStorage.getItem('contacts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing saved contacts:', e);
        return fallbackContacts;
      }
    }
    return fallbackContacts;
  };

  const [contacts, setContacts] = useState(getInitialContacts);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [nextId, setNextId] = useState(() => {
    const savedContacts = getInitialContacts();
    return Math.max(...savedContacts.map(c => c.id), 0) + 1;
  });

  // Save contacts to localStorage whenever contacts change
  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
    setTotal(contacts.length);
  }, [contacts]);

  async function fetchContacts(p=1){
    setLoading(true);
    try{
      const res = await axios.get(`${API_BASE}/contacts?page=${p}&limit=${limit}`);
      setContacts(res.data.data);
      setTotal(res.data.total);
    }catch(err){
      console.log('API not available, using localStorage data');
      // Use localStorage data if API is not available
      const currentContacts = getInitialContacts();
      setContacts(currentContacts);
      setTotal(currentContacts.length);
    }finally{
      setLoading(false);
    }
  }

  useEffect(()=>{ fetchContacts(page); }, [page]);

  const addContact = async (contact) => {
    try{
      // Try API first
      const res = await axios.post(`${API_BASE}/contacts`, contact);
      setContacts(prev => [res.data, ...prev]);
      setTotal(prev => prev + 1);
    }catch(err){
      console.log('API not available, using client-side storage');
      // Client-side fallback: add contact locally
      const newContact = { ...contact, id: nextId };
      setContacts(prev => [newContact, ...prev]);
      setTotal(prev => prev + 1);
      setNextId(prev => prev + 1);
    }
  };

  const deleteContact = async (id) => {
    try{
      // Try API first
      await axios.delete(`${API_BASE}/contacts/${id}`);
      setContacts(prev => prev.filter(c => c.id !== id));
      setTotal(prev => prev - 1);
    }catch(err){
      console.log('API not available, using client-side storage');
      // Client-side fallback: delete contact locally
      setContacts(prev => prev.filter(c => c.id !== id));
      setTotal(prev => prev - 1);
    }
  };

  return (
    <div className="container">
      <h1>Contact Book</h1>
      <div className="grid">
        <div className="card" style={{flex:'1 1 300px'}}>
          <ContactForm onAdd={addContact} />
        </div>
        <div style={{flex:'2 1 400px'}}>
          {loading ? <div className="loading">Loading contacts...</div> : <ContactList contacts={contacts} onDelete={deleteContact} />}
          <Pagination page={page} total={total} limit={limit} onChange={setPage} />
        </div>
      </div>
    </div>
  );
}

export default App;
