import axios from "axios";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { apiResponse } from "../helpers/apiResponse";

const HASURA_OPERATION = `
  mutation InsertTodoOne($title: String = "", $dueDate: String = "", $description: String = "", $completed: Boolean = false, $userId: String = "") {
    insert_todos_one(object: {title: $title, dueDate: $dueDate, description: $description, completed: $completed, userId: $userId}) {
      id
      dueDate
      completed
      userId
      description
      title
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
    return apiResponse._200(res?.data?.data?.insert_todos_one);
  } catch (error: any) {
    return apiResponse._400({
      message:
        error?.message ||
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Insert Todo One Backend Error",
    });
  }
};
