import axios from "axios";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { apiResponse } from "../helpers/apiResponse";

const HASURA_OPERATION = `
  mutation UpdateTodoOne($title: String, $dueDate: String, $description: String, $completed: Boolean, $id: Int!) {
    update_todos_by_pk(pk_columns: {id: $id}, _set: {completed: $completed, description: $description, dueDate: $dueDate, title: $title}) {
      completed
      description
      dueDate
      id
      title
      userId
    }
  }
`;

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const data = JSON.parse(`${event?.body}`);
    const variables = {
      ...data?.input,
      userId: data?.["session_variables"]?.["x-hasura-user-id"],
    };
    const res = await axios.post(
      "https://hip-shad-68.hasura.app/v1/graphql",
      JSON.stringify({
        query: HASURA_OPERATION,
        variables,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${event?.headers?.Authorization}`,
        },
      }
    );
    return apiResponse._200(res?.data?.data?.update_todos_by_pk);
  } catch (error: any) {
    return apiResponse._400({
      message:
        error?.message ||
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Update Todo One Backend Error",
    });
  }
};
