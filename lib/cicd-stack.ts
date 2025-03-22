import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

export class CicdStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create DynamoDB table
    const table = new dynamodb.Table(this, 'ItemsTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      pointInTimeRecovery: true,
    });

    // Create Lambda function
    const handler = new lambda.Function(this, 'ItemsHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'items.handler',
      environment: {
        TABLE_NAME: table.tableName,
        REGION: 'us-east-1',
      },
    });

    // Grant Lambda function read/write permissions to DynamoDB table
    table.grantReadWriteData(handler);

    // Create API Gateway
    const api = new apigateway.RestApi(this, 'ItemsApi', {
      restApiName: 'Items Service',
      description: 'This is a simple API Gateway with Lambda integration.',
    });

    const items = api.root.addResource('items');
    const getAllIntegration = new apigateway.LambdaIntegration(handler);
    items.addMethod('GET', getAllIntegration);  // GET /items
    items.addMethod('POST', getAllIntegration);  // POST /items

    const singleItem = items.addResource('{id}');
    const getSingleIntegration = new apigateway.LambdaIntegration(handler);
    singleItem.addMethod('GET', getSingleIntegration);  // GET /items/{id}
    singleItem.addMethod('PUT', getSingleIntegration);  // PUT /items/{id}
    singleItem.addMethod('DELETE', getSingleIntegration);  // DELETE /items/{id}

    // Output the API Gateway URL
    new cdk.CfnOutput(this, 'apiUrl', {
      value: api.url,
      description: 'API Gateway endpoint URL',
    });
  }
} 