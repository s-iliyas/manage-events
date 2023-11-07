import axios from "axios";
import { Auth } from "aws-amplify";

import { TodoFormInput } from "@/types";
import getUserId from "./helpers/getUserId";

const addTodoApi = async ({
  description,
  dueDate,
  title,
  completed = false,
}: TodoFormInput) => {
  try {
    const token = (await Auth.currentSession()).getIdToken().getJwtToken();
    const userId = getUserId(token);
    const graphqlEndpoint = `${process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL}`;
    const response = await axios.post(
      graphqlEndpoint,
      {
        query: `
          mutation InsertTodosOne(
            $completed: Boolean = false,
            $description: String = "",
            $dueDate: String = "",
            $title: String = "",
            $userId: String = ""
          ) {
            insert_todos_one(object: {
              completed: $completed,
              description: $description,
              dueDate: $dueDate,
              title: $title,
              userId: $userId
            }) {
              id
              completed
              description
              userId
              title
              dueDate
            }
          }
        `,
        variables: { description, dueDate, title, completed, userId },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response?.data?.data?.insert_todos_one;
  } catch (error: any) {
    throw new Error(error);
  }
};

export default addTodoApi;
