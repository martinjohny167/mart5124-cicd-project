# AWS CDK CI/CD Project

This project implements a CI/CD pipeline using AWS CDK. It deploys a serverless application with the following components:

- API Gateway
- Lambda function
- DynamoDB table
- CodePipeline with GitHub integration

## Prerequisites

- Node.js 18.x or later
- AWS CLI configured with appropriate credentials
- GitHub account with repository access
- AWS CDK CLI installed (`npm install -g aws-cdk`)

## Project Structure

```
.
├── bin/
│   └── cicd_project.ts       # CDK app entry point
├── lib/
│   ├── pipeline-stack.ts     # CI/CD pipeline definition
│   └── cicd-stack.ts         # Main infrastructure stack
├── lambda/
│   └── items.js             # Lambda function code
├── test/
│   └── cicd_project.test.ts # Infrastructure tests
├── cdk.json                 # CDK configuration
└── buildspec.yml           # AWS CodeBuild specification
```

## API Endpoints

The API provides the following endpoints for managing items:

- `GET /items` - List all items
- `POST /items` - Create a new item
- `GET /items/{id}` - Get a specific item
- `PUT /items/{id}` - Update an item
- `DELETE /items/{id}` - Delete an item

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Run tests:
   ```bash
   npm test
   ```

4. Deploy the pipeline:
   ```bash
   npx cdk deploy mart5124-pipeline-stack
   ```

## Testing the API

Example item creation:
```bash
curl -X POST https://your-api-url/prod/items \
  -H "Content-Type: application/json" \
  -d '{"id": "1", "name": "Test Item", "description": "This is a test item"}'
```

## Cleanup

To remove all resources:
```bash
npx cdk destroy mart5124-pipeline-stack mart5124-cicd-stack
```

## Security

- The pipeline uses AWS CodeStar connection for secure GitHub integration
- Lambda function has minimal IAM permissions (only DynamoDB access)
- API Gateway uses AWS IAM for request authorization
