import React from 'react';

export default function ContactList({ contacts, onDelete }){
  if(!contacts || contacts.length===0) return (
    <div className="contact-list-container">
      <h3>Contacts</h3>
      <p className="no-contacts">No contacts found. Add your first contact above!</p>
    </div>
  );
  
  return (
    <div className="contact-list-container">
      <h3>Contacts ({contacts.length})</h3>
      <table className="contacts-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map(c => (
            <tr key={c.id}>
              <td><strong>{c.name}</strong></td>
              <td>{c.email}</td>
              <td>{c.phone}</td>
              <td>
                <button 
                  onClick={()=>onDelete(c.id)} 
                  className="delete-btn"
                  title="Delete contact"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
