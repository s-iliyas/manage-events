import request from "request";

export const handler = (event: any, context: any, callback: any) => {
  const userId = event.request.userAttributes.sub;
  const userName = event.userName;
  const hasuraAdminSecret = `${process.env.HASURA_ADMIN_SECRET}`;
  const url = `${process.env.HASURA_GRAPHQL_URL}`;

  const upsertUserQuery = `
    mutation($userId: String!, $userName: String!){
      insert_users(objects: [{ id: $userId, username: $userName }], on_conflict: { constraint: users_pkey, update_columns: [] }) {
        affected_rows
      }
    }`;

  const graphqlReq = {
    query: upsertUserQuery,
    variables: { userId: userId, userName: userName },
  };

  request.post(
    {
      headers: {
        "content-type": "application/json",
        "x-hasura-admin-secret": hasuraAdminSecret,
      },
      url: url,
      body: JSON.stringify(graphqlReq),
    },
    function (error, response, body) {
      console.log(body);
      callback(null, event, context);
    }
  );
};
