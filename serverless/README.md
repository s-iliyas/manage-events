# Serverless Todo App with AWS Cognito Authentication

This is a serverless Todo application built using the Serverless Framework and AWS Cognito for authentication. Follow the steps below to set up and deploy the project.

## Prerequisites

Before you begin, make sure you have the following installed and configured on your system:

- [Node.js](https://nodejs.org/) (v18.x or higher)
- [Serverless Framework](https://www.serverless.com/)
- [AWS CLI](https://aws.amazon.com/cli/)
- [AWS Account](https://aws.amazon.com/)

## Installation and Deployment

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Install dependencies:**

   ```bash
   yarn
   ```

3. **Configure AWS Credentials:**

   Ensure you have your AWS credentials set up. You can configure your AWS credentials using the AWS CLI:

   ```bash
   aws configure
   ```

   Follow the prompts to enter your AWS Access Key ID, Secret Access Key, default region, and output format.

4. **Create `env.yml` file:**

   Create an `env.yml` file in the project root directory and add the values to the keys present in the example.env.yml file:

   ```yaml
   HASURA_GRAPHQL_URL: <your-hasura-graphql-endpoint>
   HASURA_ADMIN_SECRET: <your-hasura-admin-secret>
   ```

   Replace `<your-hasura-graphql-endpoint>` with the URL of your Hasura GraphQL endpoint and `<your-hasura-admin-secret>` with your Hasura admin secret.

5. **Deploy the Serverless application:**

   ```bash
   sls deploy --stage <stage-name(example: prod)>
   ```

   This will deploy your Serverless application along with the necessary AWS Cognito User Pool, User Pool Client, Identity Pool, and API Gateway Authorizer.

6. **Configure CORS in your frontend application:**

   If you have a frontend application that needs to interact with this API, ensure you configure CORS settings appropriately. For development purposes, the CORS settings in the `serverless.yml` file allow requests from `http://localhost:3000`. Modify the `origins` array under `addTodo`, `editTodo`, and `deleteTodo` functions in the `serverless.yml` file to match your frontend application's domain.
