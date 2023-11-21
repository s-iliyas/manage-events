## Prerequisites

Before getting started, make sure you have the following installed:

- Node.js and npm
- Express.js
- Postman or any API testing tool of your choice

## Setup

1. Clone the repository and navigate to the project directory.

```bash
git clone <repository_url>
cd <project_directory>
```

2. Install dependencies.

```bash
npm install
```

3. Create a `.env` file in the project root and add the following content. Replace the placeholder values with your actual database URL and OpenAI API key.

```env
DB_URL="xxxxxxxxxxxxxxxxxxxx"
OPENAI_API_KEY="xx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

## Running the Server

Start the Express.js server.

```bash
npm start
```

The server will be running on `http://localhost:8000`.

## Making the POST Request

Use an API testing tool like Postman to make the POST request.

### Request Details:

- **Method:** POST
- **URL:** `http://localhost:8000/q`
- **Headers:**
  - `Content-Type: application/json`

### Request Body:

```json
{
    "question": "How many past due todos are there for user_id '4dc02817-4e86-4e31-b2fa-5041cb90d034'?"
}
```

### Response:

The server will respond with the relevant information based on the question.
```
"There are 6 past due todos for the user with the user_id '4dc02817-4e86-4e31-b2fa-5041cb90d034'."
```