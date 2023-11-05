import { Auth } from "aws-amplify";

const awsConfig = {
  Auth: {
    identityPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID,
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USERPOOL_ID,
    userPoolWebClientId:
      process.env.NEXT_PUBLIC_AWS_COGNITO_USERPOOL_CLIENT_ID,
  },
  API: {
    endpoints: [
      {
        name: process.env.NEXT_PUBLIC_AWS_API_GATEWAY_API_NAME,
        endpoint: process.env.NEXT_PUBLIC_AWS_API_GATEWAY_API_ENDPOINT,
        region: process.env.NEXT_PUBLIC_AWS_REGION,
        custom_header: async () => {
          return {
            Authorization: `Bearer ${(await Auth.currentSession())
              .getIdToken()
              .getJwtToken()}`,
          };
        },
      },
    ],
  },
};

export default awsConfig;
