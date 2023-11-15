import axios from "axios";
import { Auth } from "aws-amplify";
import { TodoFormInput } from "@/types";

const customAction = async ({
  description,
  dueTime,
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
          mutation InsertTodoOne($dueTime: String = "", $description: String = "", $title: String = "", $completed: Boolean = false) {
            InsertTodoOne(dueTime: $dueTime, description: $description, title: $title, completed: $completed ) {
              completed
              description
              dueTime
              userId
              id
              title
            }
          }
        `,
        variables: { description, dueTime, title, completed },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response?.data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export default customAction;
