import axios from "axios";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { apiResponse } from "../helpers/apiResponse";

const HASURA_OPERATION = `
  mutation UpdateTodoOne($id: Int!, $completed: Boolean = false, $description: String = "", $dueTime: timestamptz = "", $title: String = "") {
    update_todos_by_pk(pk_columns: {id: $id}, _set: {completed: $completed, description: $description, dueTime: $dueTime, title: $title}) {
      completed
      description
      dueTime
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
    const message = {
      message:
        error?.message ||
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Update Todo One Backend Error",
    };
    console.log(JSON.stringify(message));
    return apiResponse._400(message);
  }
};
