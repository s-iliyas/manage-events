import axios from "axios";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { apiResponse } from "../helpers/apiResponse";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  return apiResponse._200({ message: "Edit todo working" });

  // try {
  //   const graphqlEndpoint = `${process.env.HASURA_GRAPHQL_URL}`;
  //   const response = await axios.post(
  //     graphqlEndpoint,
  //     {
  //       query: `
  //         mutation editTodo($todoId: Int!, $completed: Boolean = false, $description: String = "", $dueDate: String = "", $title: String = "") {
  //           update_todos_by_pk(pk_columns: {id: $todoId}, _set: {completed: $completed, description: $description, dueDate: $dueDate, title: $title}){
  //             completed
  //             description
  //             dueDate
  //             id
  //             title
  //           }
  //         }
  //       `,
  //       variables: { description, dueDate, title, completed, todoId },
  //     },
  //     {
  //       headers: {
  //         "Content-Type": "application/json",
  //         "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
  //       },
  //     }
  //   );
  //   return apiResponse._200(response.data?.data?.update_todos_by_pk);
  // } catch (error: any) {
  //   return apiResponse._400({
  //     message: "Graphql edit todo error",
  //     error: error?.response?.data || error?.message,
  //   });
  // }
};
