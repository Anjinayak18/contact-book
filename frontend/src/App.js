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
  const [contacts, setContacts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  async function fetchContacts(p=1){
    setLoading(true);
    try{
      const res = await axios.get(`${API_BASE}/contacts?page=${p}&limit=${limit}`);
      setContacts(res.data.data);
      setTotal(res.data.total);
    }catch(err){
      console.error('API Error:', err);
      // Use fallback data if API is not available
      setContacts(fallbackContacts);
      setTotal(fallbackContacts.length);
      console.log('Using fallback data');
    }finally{
      setLoading(false);
    }
  }

  useEffect(()=>{ fetchContacts(page); }, [page]);

  const addContact = async (contact) => {
    // optimistic update: add temp id
    const temp = { ...contact, id: Date.now() };
    setContacts(prev => [temp, ...prev]);
    try{
      const res = await axios.post(`${API_BASE}/contacts`, contact);
      // replace temp with real
      setContacts(prev => prev.map(c => c.id===temp.id ? res.data : c));
      setTotal(prev => prev + 1);
    }catch(err){
      setContacts(prev => prev.filter(c => c.id !== temp.id));
      alert('Failed to add contact');
    }
  };

  const deleteContact = async (id) => {
    const before = contacts;
    setContacts(prev => prev.filter(c => c.id !== id));
    try{
      await axios.delete(`${API_BASE}/contacts/${id}`);
      setTotal(prev => prev - 1);
    }catch(err){
      setContacts(before);
      alert('Failed to delete contact');
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
