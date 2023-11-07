import axios from "axios";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { apiResponse } from "../helpers/apiResponse";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log(event.body, "add todo body");
  console.log(event.headers, "add todo headers");
  const data = JSON.parse(`${event?.body}`);
  return apiResponse._200({
    ...data?.input?.data,
    userId: data?.["session_variables"]?.["x-hasura-user-id"],
  });
};
