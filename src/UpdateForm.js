import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { getCurrentUser, signOut, fetchAuthSession } from '@aws-amplify/auth';


function UpdateForm() {
    const { formId } = useParams();
    const [status, setStatus] = useState('');

    const updateFormStatus = async () => {
        try {
            const result = await axios.put(`https://ysgfvbkbka.execute-api.us-west-1.amazonaws.com/dev/forms/{proxy+}`, //https://your-api-endpoint/forms/${formId
                { status },
                { headers: { Authorization: `Bearer ${(await fetchAuthSession()).idToken.jwtToken}` } }
            );
            alert('Form status updated successfully: ' + result.data.updatedAttributes.status);
        } catch (error) {
            alert('Failed to update form status: ' + error.message);
        }
    };

    return (
        <div>
            <h2>Update Form Status</h2>
            <div>
                <label htmlFor="status">New Status:</label>
                <select id="status" value={status} onChange={e => setStatus(e.target.value)}>
                    <option value="">Select a Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Denied">Denied</option>
                </select>
            </div>
            <button onClick={updateFormStatus}>Update Status</button>
        </div>
    );
}

export default UpdateForm;
