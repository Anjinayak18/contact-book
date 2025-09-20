import React, { useState } from 'react';

export default function ContactForm({ onAdd }){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  function validate(){
    if(!name.trim()) return 'Name required';
    if(!/^\S+@\S+\.\S+$/.test(email)) return 'Invalid email';
    if(!/^\d{10}$/.test(phone)) return 'Phone must be 10 digits';
    return null;
  }

  function handleSubmit(e){
    e.preventDefault();
    const err = validate();
    if(err){ alert(err); return; }
    onAdd({ name:name.trim(), email, phone });
    setName(''); setEmail(''); setPhone('');
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <h3>Add Contact</h3>
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input 
          id="name"
          placeholder="Enter full name" 
          value={name} 
          onChange={e=>setName(e.target.value)} 
          required 
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input 
          id="email"
          type="email"
          placeholder="Enter email address" 
          value={email} 
          onChange={e=>setEmail(e.target.value)} 
          required 
        />
      </div>
      <div className="form-group">
        <label htmlFor="phone">Phone</label>
        <input 
          id="phone"
          type="tel"
          placeholder="Enter 10-digit phone number" 
          value={phone} 
          onChange={e=>setPhone(e.target.value)} 
          required 
        />
      </div>
      <button type="submit" className="submit-btn">Add Contact</button>
    </form>
  );
}
