import axios from "axios";
import { Auth } from "aws-amplify";

import { TodoFormInput } from "@/types";

const editTodoApi = async (
  { description, dueDate, title, completed = false }: TodoFormInput,
  todoId: number
) => {
  try {
    const graphqlEndpoint = `${process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL}`;
    const response = await axios.post(
      graphqlEndpoint,
      {
        query: `
          mutation editTodo($todoId: Int!, $completed: Boolean = false, $description: String = "", $dueDate: String = "", $title: String = "") {
            update_todos_by_pk(pk_columns: {id: $todoId}, _set: {completed: $completed, description: $description, dueDate: $dueDate, title: $title}){
              completed
              description
              dueDate
              userId
              id
              title
            }
          }
        `,
        variables: { description, dueDate, title, completed, todoId },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${(await Auth.currentSession())
            .getIdToken()
            .getJwtToken()}`,
        },
      }
    );
    return response?.data?.data?.update_todos_by_pk;
  } catch (error: any) {
    throw new Error(error);
  }
};

export default editTodoApi;
