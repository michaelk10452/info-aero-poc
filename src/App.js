import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { signOut } from 'aws-amplify/auth';
import { Authenticator, Button, View, Flex, Text } from '@aws-amplify/ui-react';

import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';


import config from './aws-exports';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth'; // Ensure these are correctly imported

import SitaApplications from './SitaApplications';
import RegistrantApplications from './RegistrantApplications';
import Home from './Home';
Amplify.configure(config);


function App() {
  const [userDetails, setUserDetails] = useState({
    username: '',
    email: '',
    group: ''
  });

  useEffect(() => {
    getAuthenticatedUser().then((userInfo) => {
      if (userInfo) {
        setUserDetails(userInfo);
      }
    });
  }, []);

  const getAuthenticatedUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      const { idToken } = (await fetchAuthSession()).tokens ?? {};
      console.log(idToken);
      const groups = idToken.payload['cognito:groups'] ? idToken.payload['cognito:groups'] : 'No group';

      return {
        username: currentUser.username,
        email: idToken.payload.email,
        group: groups[0]
      };
    } catch (error) {
      console.error('Error fetching user:', error);
      return {
        username: '',
        email: '',
        group: 'No group'
      };
    } 
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.reload(); // Optionally force a reload to clear all user data
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <Authenticator>
      {({ user }) => (
        <Router>
          <Flex as="header" justifyContent="space-between" padding="15px" alignItems="center" backgroundColor="var(--amplify-colors-neutral-10)">
            <Flex gap="10px">
              <NavLink to="/" style={{ textDecoration: 'none' }}>
                <Text color="var(--amplify-colors-brand-primary)">Home</Text>
              </NavLink>
              {userDetails.group === 'SITA' && (
                <NavLink to="/sita-applications" style={{ textDecoration: 'none' }}>
                  <Text color="var(--amplify-colors-brand-primary)">SITA Applications</Text>
                </NavLink>
              )}
              {userDetails.group === 'Registrant' && (
                <NavLink to="/registrant-applications" style={{ textDecoration: 'none' }}>
                  <Text color="var(--amplify-colors-brand-primary)">My Applications</Text>
                </NavLink>
              )}
            </Flex>
            <Button variation="primary" onClick={handleSignOut}>Sign Out</Button>
          </Flex>
          <View as="main" padding="15px">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sita-applications" element={<SitaApplications />} />
              <Route path="/registrant-applications" element={<RegistrantApplications />} />
            </Routes>
            <Flex as="footer" justifyContent="center" padding="15px">
              <Text>Group: {userDetails.group} </Text>
              <Text>User: {userDetails.email}</Text>
            </Flex>
          </View>
        </Router>
      )}
    </Authenticator>
  );
}

export default App;


