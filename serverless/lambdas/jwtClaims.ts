export const handler = (event: any, _: any, callback: any) => {
  console.log(
    "ok working ********************************************************************************"
  );
  event.response = {
    claimsOverrideDetails: {
      claimsToAddOrOverride: {
        "https://hasura.io/jwt/claims": JSON.stringify({
          "x-hasura-user-id": event.request.userAttributes.sub,
          "x-hasura-default-role": "user",
          "x-hasura-allowed-roles": ["user"],
        }),
      },
    },
  };
  callback(null, event);
};
