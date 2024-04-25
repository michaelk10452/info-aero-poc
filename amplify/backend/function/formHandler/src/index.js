

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */


const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid'); // Import the uuid module to generate unique identifiers
const tableName = process.env.TABLE_NAME; // Set in your Lambda environment variables


exports.handler = async (event) => {
    console.log("Received event:", JSON.stringify(event, null, 2));

    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*', // Adjust as necessary for production
        "Access-Control-Allow-Headers": "*"
    };

    // Handle CORS preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers, body: '' };
    }

    try {
        // Extract the Cognito User Group from the Lambda authorizer claims
        const userGroups = event.requestContext.authorizer.claims['cognito:groups'];
        
        // Handle different methods
        switch (event.httpMethod) {
            case 'GET':
                return await handleGetRequest(event, userGroups, headers);
            case 'POST':
                return await handlePostRequest(event, headers);
            case 'DELETE':
                return await handleDeleteRequest(event, headers);
            default:
                return { statusCode: 405, headers, body: JSON.stringify({ error: "Method Not Allowed" }) };
        }
    } catch (err) {
        console.error('Error:', err);
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal Server Error', details: err.message }) };
    }
};

// Handle GET requests
async function handleGetRequest(event, userGroups, headers) {

    // Extract the 'sub' and 'email' from the event claims
    const claims = event.requestContext.authorizer.claims;

    const params = {
        TableName: tableName
    };

    if (!userGroups.includes('SITA')) {
        params.FilterExpression = 'ownerId = :ownerId';
        params.ExpressionAttributeValues = { ':ownerId': claims['sub'] };
    }

    const data = await ddb.scan(params).promise();
    return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: "Data retrieved successfully", data: data.Items })
    };
}


// Handle POST requests
async function handlePostRequest(event, headers) {
    // Parse the body from the event
    const requestBody = JSON.parse(event.body);

    // Extract the 'sub' and 'email' from the event claims
    const claims = event.requestContext.authorizer.claims;
    const ownerId = claims['sub']; // The UUID associated with the user, which doesn't change
    const userEmail = claims['email']; // The user's email address

    // Construct the new item with the additional fields
    const item = {
        formId: uuidv4(), // Generate a new UUID for the formId
        ...requestBody,
        ownerId: ownerId, // Use the UUID as ownerId
        userId: userEmail, // Include the user's email address as userId
        status: "Pending", // Set the default status for new submissions
    };

    const params = {
        TableName: tableName,
        Item: item
    };

    await ddb.put(params).promise();
    return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ message: "Application created successfully", item: item })
    };
}


// Handle DELETE requests
async function handleDeleteRequest(event, headers) {
    const id = event.pathParameters.id;
    const ownerId = event.requestContext.identity.cognitoIdentityId;

    const params = {
        TableName: tableName,
        Key: { id: id, ownerId: ownerId },
        ConditionExpression: "ownerId = :ownerId",
        ExpressionAttributeValues: { ":ownerId": ownerId }
    };

    await ddb.delete(params).promise();
    return {
        statusCode: 204,
        headers,
        body: JSON.stringify({ message: "Application deleted successfully" })
    };
}
