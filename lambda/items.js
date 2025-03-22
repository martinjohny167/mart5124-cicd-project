const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: process.env.REGION });
const TABLE_NAME = process.env.TABLE_NAME;

const createResponse = (statusCode, body) => ({
  statusCode,
  body: JSON.stringify(body),
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  },
});

exports.handler = async (event) => {
  try {
    const { httpMethod, resource, pathParameters, body } = event;
    
    switch (httpMethod) {
      case 'GET':
        if (resource === '/items') {
          const scanResult = await dynamodb.scan({ TableName: TABLE_NAME }).promise();
          return createResponse(200, scanResult.Items);
        } else {
          const getResult = await dynamodb.get({
            TableName: TABLE_NAME,
            Key: { id: pathParameters.id }
          }).promise();
          return createResponse(200, getResult.Item || {});
        }
        
      case 'POST':
        const item = JSON.parse(body);
        await dynamodb.put({
          TableName: TABLE_NAME,
          Item: item
        }).promise();
        return createResponse(201, item);
        
      case 'PUT':
        const updateItem = JSON.parse(body);
        const updateResult = await dynamodb.update({
          TableName: TABLE_NAME,
          Key: { id: pathParameters.id },
          UpdateExpression: 'set #name = :name, #description = :description',
          ExpressionAttributeNames: {
            '#name': 'name',
            '#description': 'description'
          },
          ExpressionAttributeValues: {
            ':name': updateItem.name,
            ':description': updateItem.description
          },
          ReturnValues: 'ALL_NEW'
        }).promise();
        return createResponse(200, updateResult.Attributes);
        
      case 'DELETE':
        await dynamodb.delete({
          TableName: TABLE_NAME,
          Key: { id: pathParameters.id }
        }).promise();
        return createResponse(204, {});
        
      default:
        return createResponse(400, { error: 'Unsupported method' });
    }
  } catch (error) {
    console.error('Error:', error);
    return createResponse(500, { error: 'Internal server error' });
  }
}; 