import React, { useState } from 'react';
import axios from 'axios';
import '@aws-amplify/ui-react/styles.css';  // Ensure the Amplify styles are imported if you're using any Amplify components elsewhere in your app

function SubmitForm() {
  const [formData, setFormData] = useState({
    organization: '', contactName: '', telephone: '', email: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://ysgfvbkbka.execute-api.us-west-1.amazonaws.com/dev/form', formData);
      console.log(formData);
      alert('Form Submitted: ' + response.data.formId);
    } catch (error) {
      alert('Failed to submit form: ' + error.message);
    }
  };

  return (
    <div style={{ margin: '0 auto', width: '100%', maxWidth: '500px', padding: '20px', backgroundColor: '#f4f4f4', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h2 style={{ textAlign: 'center' }}>Submit New Form</h2>
        <input
          style={inputStyle}
          type="text"
          name="organization"
          placeholder="Organization"
          value={formData.organization}
          onChange={handleChange}
          required
        />
        <input
          style={inputStyle}
          type="text"
          name="contactName"
          placeholder="Contact Name"
          value={formData.contactName}
          onChange={handleChange}
          required
        />
        <input
          style={inputStyle}
          type="text"
          name="telephone"
          placeholder="Telephone"
          value={formData.telephone}
          onChange={handleChange}
          required
        />
        <input
          style={inputStyle}
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <button type="submit" style={{ padding: '10px', fontSize: '16px', color: 'white', backgroundColor: '#007bff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Submit
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  padding: '10px',
  fontSize: '16px',
  border: '1px solid #ccc',
  borderRadius: '4px',
};

export default SubmitForm;
