import axios from "axios";
import { Auth } from "aws-amplify";
import { TodoFormInput } from "@/types";

const customAction = async ({
  description,
  dueDate,
  title,
  completed = false,
}: TodoFormInput) => {
  try {
    const token = (await Auth.currentSession()).getIdToken().getJwtToken();
    const graphqlEndpoint = `${process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL}`;
    const response = await axios.post(
      graphqlEndpoint,
      {
        query: `
          mutation CustomAction($dueDate: String = "", $description: String = "", $title: String = "", $completed: Boolean = false) {
            CustomAction(data: { dueDate: $dueDate, description: $description, title: $title, completed: $completed }) {
                userId
            }
          }
        `,
        variables: { description, dueDate, title, completed },
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

export default customAction;
