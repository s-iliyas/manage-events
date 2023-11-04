import React from "react";

import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { AuthProvider } from "@/hooks/useAuth";
import TodoProvider from "@/contexts/TodoProvider";

import { Amplify, Auth } from "aws-amplify";

Amplify.configure({
  Auth: {
    identityPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID,
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USERPOOL_ID,
    userPoolWebClientId:
      process.env.NEXT_PUBLIC_AWS_COGNITO_USERPOOL_WEB_CLIENT_ID,
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
});

const Main = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <TodoProvider>
        <Navbar />
        <div className="pt-16 lg:mx-36 md:mx-24 sm:mx-14 mx-3">
          <main>{children}</main>
        </div>
        <Footer />
      </TodoProvider>
    </AuthProvider>
  );
};

export default Main;
