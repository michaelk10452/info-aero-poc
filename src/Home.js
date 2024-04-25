import React, { useState } from 'react';
import { post } from 'aws-amplify/api';
import {
  fetchAuthSession,
  getCurrentUser
} from 'aws-amplify/auth';
import { 
  View, 
  Flex, 
  Heading, 
  TextField, 
  Button 
} from '@aws-amplify/ui-react';

function Home() {

    const [input, setInput] = useState({
        organization: '',
        contactName: '',
        telephone: '',
        email: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setInput({ ...input, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const getAuthenticatedUser = async () => {
                const {
                  username,
                  signInDetails
                } = await getCurrentUser();
              
                const {
                  tokens: session
                } = await fetchAuthSession();
              
                // Note that session will no longer contain refreshToken and clockDrift
                return {
                  username,
                  session,
                  authenticationFlowType: signInDetails.authFlowType
                };
              }
        
              const user = await getAuthenticatedUser();
              console.log('USER', user);
              const token = user.session.idToken;
              console.log({ token })
        
              const sendInfo = {
                body: input,
                headers: {Authorization: token}
            };
        
            // Make sure 'formApi' is the name you used when you ran 'amplify add api'
            const response = await post({
                apiName:'formApi', 
                path:'/applications',
                options: sendInfo
            });
      
        
            console.log('POST call succeeded:', response );
            

            console.log('POST call succeeded:', response);
            alert('Application submitted successfully');
            setInput({
                organization: '',
                contactName: '',
                telephone: '',
                email: ''
            }); // Reset the form after successful submission
            return response;
        } catch (error) {
            console.error('Error submitting application:', error);
            alert('Failed to submit application');
            console.error('POST call failed:', error);
            // Parsing the error response body if it's in JSON string format
            const errorBody = error.response && JSON.parse(error.response.data);
            console.error('POST details:', errorBody);
            throw error; // Rethrow the error for further handling
        }
    };

    return (
        <View padding="20px">
          <Heading level={1}>Submit New Application</Heading>
          <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}>
            <Flex direction="column" gap="15px">
              <TextField
                label="Organization"
                name="organization"
                value={input.organization}
                onChange={handleChange}
                isRequired
              />
              <TextField
                label="Contact Name"
                name="contactName"
                value={input.contactName}
                onChange={handleChange}
                isRequired
              />
              <TextField
                label="Telephone"
                name="telephone"
                value={input.telephone}
                onChange={handleChange}
                isRequired
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={input.email}
                onChange={handleChange}
                isRequired
              />
              <Button type="submit" variation="primary">Submit</Button>
            </Flex>
          </form>
        </View>
      );
}

export default Home;