const axios = require("axios");
const { apiResponse } = require("../helpers/apiResponse");

module.exports.handler = async (event) => {
  if (!event.pathParameters.ID) {
    return apiResponse._400({
      message: "Todo ID is required in URL.",
    });
  }

  const { title, description, completed, dueDate } = JSON.parse(event.body);

  const todoId = event.pathParameters.ID;

  if (!title) {
    return apiResponse._400({
      message: "Title is required",
    });
  } else if (!description) {
    return apiResponse._400({
      message: "Description is required",
    });
  } else if (!dueDate) {
    return apiResponse._400({
      message: "Due date is required",
    });
  }

  try {
    const graphqlEndpoint = process.env.HASURA_GRAPHQL_URL;
    const response = await axios.post(
      graphqlEndpoint,
      {
        query: `
          mutation editTodo($todoId: Int!, $completed: Boolean = false, $description: String = "", $dueDate: String = "", $title: String = "") {
            update_todos_by_pk(pk_columns: {id: $todoId}, _set: {completed: $completed, description: $description, dueDate: $dueDate, title: $title}){
              completed
              description
              dueDate
              id
              title
            }
          }        
        `,
        variables: { description, dueDate, title, completed, todoId },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
        },
      }
    );
    return apiResponse._200(response.data?.data?.update_todos_by_pk);
  } catch (error) {
    return apiResponse._400({
      message: "Graphql edit todo error",
      error: error?.response?.data || error.message,
    });
  }
};
