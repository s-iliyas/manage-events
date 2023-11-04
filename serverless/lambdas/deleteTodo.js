const axios = require("axios");
const { apiResponse } = require("../helpers/apiResponse");

module.exports.handler = async (event) => {
  // const token = event.headers.Authorization;

  if (!event.pathParameters.ID) {
    return apiResponse._400({
      message: "Todo ID is required in URL.",
    });
  }

  const todoId = event.pathParameters.ID;

  try {
    const graphqlEndpoint = process.env.HASURA_GRAPHQL_URL;
    const response = await axios.post(
      graphqlEndpoint,
      {
        query: `
        mutation deleteTodo($todoId: Int!) {
          delete_todos_by_pk(id: $todoId){
            id
          }
        }
        `,
        variables: { todoId },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
        },
      }
    );
    return apiResponse._200(response.data?.data?.delete_todos_by_pk);
  } catch (error) {
    return apiResponse._400({
      message: "Graphql delete todo error",
      error: error?.response?.data || error.message,
    });
  }
};
