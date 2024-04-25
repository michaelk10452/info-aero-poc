import { get } from 'aws-amplify/api';
import {
    fetchAuthSession,
    getCurrentUser
  } from 'aws-amplify/auth';

async function getApplications() {
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

      const requestInfo = {
        headers: {Authorization: token}
    }

    // Make sure 'formApi' is the name you used when you ran 'amplify add api'
    const restOperation = get({
        apiName:'formApi', 
        path:'/applications',
        options: requestInfo
    });

    const { body } = await restOperation.response;

    const json = await body.json();
    console.log(json.data);
    // console.log('GET call succeeded:', responseData);
    return json; // Ensure this is the array of applications

} catch (error) {
    console.error('GET call failed:', error);
    // Parsing the error response body if it's in JSON string format
    const errorBody = error.response && JSON.parse(error.response.data);
    console.error('Error details:', errorBody);
    throw error; // Rethrow the error for further handling
  }
}

export default getApplications;

