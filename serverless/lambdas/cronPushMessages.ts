import axios from "axios";
import * as AWS from "aws-sdk";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { apiResponse } from "../helpers/apiResponse";

const sqs = new AWS.SQS();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const res = await axios.post(
      `${process.env.HASURA_GRAPHQL_URL}`,
      {
        query: `
          query PastDueTodos($_lt: timestamptz = "", $_eq: Boolean = false) {
            todos(where: {dueTime: {_lt: $_lt}, completed: {_eq: $_eq}}) {
              completed
              description
              dueTime
              id
              title
              userId
            }
          }
        `,
        variables: {
          _eq: false,
          _lt: new Date().toISOString(),
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-hasura-admin-secret": `${process.env.HASURA_ADMIN_SECRET}`,
        },
      }
    );

    if (res?.data?.data?.todos?.length > 0) {
      interface Todo {
        id: number;
        title: string;
        description: string;
        dueTime: string;
        userId: string;
        completed: boolean;
      }
      // Use map with Promise.all to wait for all sendMessage promises to resolve
      await Promise.all(
        res.data.data.todos.map(async (todo: Todo) => {
          const params: AWS.SQS.SendMessageRequest = {
            QueueUrl: `${process.env.SQS_QUEUE_URL}`,
            MessageBody: JSON.stringify(todo),
          };
          await sqs.sendMessage(params).promise();
        })
      );
    }

    return apiResponse._200({
      message: "Cron push messages of past due todos is completed.",
    });
  } catch (error: any) {
    const message = {
      message:
        error?.message ||
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Cron Push Messages Backend Error",
    };
    console.log(JSON.stringify(message));
    return apiResponse._400(message);
  }
};
