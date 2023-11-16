import axios from "axios";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { apiResponse } from "../helpers/apiResponse";

const HASURA_OPERATION = `
  mutation DeleteTodoOne($id: Int!) {
    delete_todos_by_pk(id: $id) {
      id
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
    return apiResponse._200(res?.data?.data?.delete_todos_by_pk);
  } catch (error: any) {
    const message = {
      message:
        error?.message ||
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Delete Todo One Backend Error",
    };
    console.log(JSON.stringify(message));
    return apiResponse._400(message);
  }
};
