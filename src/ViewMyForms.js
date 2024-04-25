import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getCurrentUser, signOut, fetchAuthSession } from '@aws-amplify/auth';
import { Auth } from 'aws-amplify';



function ViewMyForms() {
    const [forms, setForms] = useState([]);

    useEffect(() => {
        const fetchForms = async () => {
            try {
                const { data } = await axios.get('https://ysgfvbkbka.execute-api.us-west-1.amazonaws.com/dev/myforms', {
                    headers: {
                        Authorization: `Bearer ${(await fetchAuthSession()).idToken.jwtToken}`
                    }
                });
                setForms(data.forms);
            } catch (error) {
                alert("Failed to fetch forms: " + error.message);
            }
        };

        fetchForms();
    }, []);

    return (
        <div>
            <h2>My Submitted Forms</h2>
            {forms.length > 0 ? (
                forms.map(form => (
                    <div key={form.formId} style={{ margin: '20px', padding: '10px', border: '1px solid #ccc' }}>
                        <p><strong>Organization:</strong> {form.organization}</p>
                        <p><strong>Contact Name:</strong> {form.contactName}</p>
                        <p><strong>Telephone:</strong> {form.telephone}</p>
                        <p><strong>Email:</strong> {form.email}</p>
                        <p><strong>Status:</strong> {form.status}</p>
                        <p><strong>Submitted At:</strong> {new Date(form.submittedAt).toLocaleString()}</p>
                    </div>
                ))
            ) : (
                <p>No forms submitted yet.</p>
            )}
        </div>
    );
}

export default ViewMyForms;
