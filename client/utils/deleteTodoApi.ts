import axios from "axios";
import { Auth } from "aws-amplify";

const deleteTodoApi = async (id: number) => {
  try {
    const graphqlEndpoint = `${process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL}`;
    const response = await axios.post(
      graphqlEndpoint,
      {
        query: `
              mutation DeleteTodoOne($id: Int!) {
                DeleteTodoOne(id: $id) {
                  id
                }
              }
            `,
        variables: { id },
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
    return response?.data?.data?.DeleteTodoOne;
  } catch (error: any) {
    throw new Error(error);
  }
};

export default deleteTodoApi;
