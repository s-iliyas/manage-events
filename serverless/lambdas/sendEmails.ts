import axios from "axios";
import { SQSEvent } from "aws-lambda";

export const handler = async (event: SQSEvent): Promise<void> => {
  try {
    console.log(event?.Records?.length, "records length: ");
    if (event?.Records?.length > 0) {
      for (const record of event.Records) {
        const todo = JSON.parse(record.body);
        const variables = {
          todoId: todo.id,
          time: new Date().toISOString(),
          userId: todo.userId,
        };
        await axios.post(
          `${process.env.HASURA_GRAPHQL_URL}`,
          {
            query: `
              mutation InsertNotificationsOne($time: timestamptz!, $todoId: Int!, $userId: String!) {
                insert_notifications_one(object: {time: $time, todoId: $todoId, userId: $userId}) {
                  id
                  time
                  todo {
                    description
                    dueTime
                    title
                    id
                    user {
                      id
                      username
                    }
                  }
                }
              }
            `,
            variables,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET,
            },
          }
        );
      }
    }
  } catch (error: any) {
    console.error("Error processing messages:", error.message);
    throw error;
  }
};
