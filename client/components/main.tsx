"use client";

import React from "react";
import { Amplify } from "aws-amplify";

import awsConfig from "@/aws-config";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { AuthProvider } from "@/hooks/useAuth";
import TodoProvider from "@/contexts/TodoProvider";

Amplify.configure(awsConfig);

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
