const axios = require("axios");
const { apiResponse } = require("../helpers/apiResponse");

module.exports.handler = async (event) => {
  const { title, description, completed, dueDate } = JSON.parse(event.body);

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
        mutation InsertTodosOne($completed: Boolean = false, $description: String = "", $dueDate: String = "", $title: String = "") {
          insert_todos_one(object: {completed: $completed, description: $description, dueDate: $dueDate, title: $title}){
            id
            completed
            description
            title
            dueDate
          }
        }
        `,
        variables: { description, dueDate, title, completed },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
        },
      }
    );
    return apiResponse._200(response?.data?.data?.insert_todos_one);
  } catch (error) {
    return apiResponse._400({
      message: "Graphql add todo error",
      error: error?.response?.data || error.message,
    });
  }
};
