import axios from "axios";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { apiResponse } from "../helpers/apiResponse";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log(event.body, "edit todo body");
  console.log(event.headers, "edit todo headers");

  return apiResponse._200({ message: "Edit todo working" });

};
