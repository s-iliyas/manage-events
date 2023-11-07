import axios from "axios";
import { Auth } from "aws-amplify";

const deleteTodoApi = async (todoId: number) => {
  try {
    const graphqlEndpoint = `${process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL}`;
    const response = await axios.post(
      graphqlEndpoint,
      {
        query: `
            mutation deleteTodo($todoId: Int!) {
              delete_todos_by_pk(id: $todoId){
                id
              }
            }
            `,
        variables: { todoId },
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
    return response?.data?.data?.delete_todos_by_pk;
  } catch (error: any) {
    throw new Error(error);
  }
};

export default deleteTodoApi;
