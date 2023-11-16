import axios from "axios";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { apiResponse } from "../helpers/apiResponse";

const HASURA_OPERATION = `
  mutation InsertTodoOne($completed: Boolean = false, $description: String = "", $userId: String = "", $title: String = "", $dueTime: timestamptz = "") {
    insert_todos_one(object: {completed: $completed, description: $description, userId: $userId, title: $title, dueTime: $dueTime}) {
      userId
      title
      id
      dueTime
      description
      completed
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
    const message = {
      message:
        error?.message ||
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Insert Todo One Backend Error",
    };
    console.log(JSON.stringify(message));
    return apiResponse._400(message);
  }
};
