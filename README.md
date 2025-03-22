# 🚀 AWS CDK + AWS CodePipeline (CI/CD Pipeline)

## 📌 Overview
This project demonstrates how to use AWS Cloud Development Kit (CDK) to create AWS resources programmatically and configure a CI/CD pipeline using AWS CodePipeline. The setup ensures continuous integration and deployment of AWS resources whenever changes are pushed to the GitHub repository.

## 🎯 Objectives
- ✅ Deploy AWS resources using AWS CDK.
- ✅ Automate deployment with AWS CodePipeline.
- ✅ Ensure seamless CI/CD integration with GitHub.

## 🏗️ AWS Resources Created
The following AWS resources are deployed using AWS CDK:
- 🗄️ **Amazon S3 Bucket** – Stores static files or code artifacts.
- ⚡ **AWS Lambda Function** – Executes code in response to events.
- 📊 **Amazon DynamoDB Table** – Handles simple CRUD operations.

## 📂 Project Structure
```
📦 my-cdk-project
 ┣ 📂 bin
 ┃ ┗ 📜 my-cdk-project.ts
 ┣ 📂 lib
 ┃ ┗ 📜 my-cdk-project-stack.ts
 ┣ 📜 package.json
 ┣ 📜 cdk.json
 ┣ 📜 README.md
 ┣ 📜 buildspec.yml
 ┗ 📜 .gitignore
```

## 🛠️ Setup Instructions
### 1️⃣ Prerequisites
Ensure you have the following installed:
- ✅ AWS CLI configured with credentials
- ✅ AWS CDK installed (`npm install -g aws-cdk`)
- ✅ Node.js installed
- ✅ A GitHub repository for source control

### 2️⃣ Initialize and Deploy CDK Stack
```sh
# Clone the repository
git clone https://github.com/your-repo.git
cd my-cdk-project

# Install dependencies
npm install

# Bootstrap and deploy
cdk bootstrap
cdk synth
cdk deploy
```

### 3️⃣ Configure AWS CodePipeline
- 🏗️ Create a new pipeline in AWS CodePipeline.
- 🔗 Connect it to the GitHub repository.
- ⚙️ Add build and deploy stages.

### 4️⃣ Test the Pipeline
1. Make changes to `my-cdk-project-stack.ts`.
2. Push the changes to GitHub.
3. Watch AWS CodePipeline trigger deployment.

## 📜 Buildspec Configuration
```yaml
version: 0.2
phases:
  install:
    commands:
      - npm install -g aws-cdk
      - npm install
  build:
    commands:
      - cdk synth
      - cdk deploy --require-approval never
artifacts:
  files:
    - '**/*'
```


-
