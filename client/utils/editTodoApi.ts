import axios from "axios";
import { Auth } from "aws-amplify";

import { TodoFormInput } from "@/types";

const editTodoApi = async (
  { description, dueDate, title, completed = false }: TodoFormInput,
  id: number
) => {
  try {
    const token = (await Auth.currentSession()).getIdToken().getJwtToken();
    const graphqlEndpoint = `${process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL}`;
    const variables = { description, dueDate, title, completed, id };
    const response = await axios.post(
      graphqlEndpoint,
      {
        query: `
        mutation UpdateTodoOne($title: String, $dueDate: String, $description: String, $completed: Boolean, $id: Int!) {
          update_todos_by_pk(pk_columns: {id: $id}, _set: {completed: $completed, description: $description, dueDate: $dueDate, title: $title}) {
            completed
            description
            dueDate
            id
            title
            userId
          }
        }
        `,
        variables,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response?.data?.data?.update_todos_by_pk;
  } catch (error: any) {
    throw new Error(error);
  }
};

export default editTodoApi;
