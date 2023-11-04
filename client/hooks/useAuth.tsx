"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Auth } from "aws-amplify";
import { User } from "@/types";

const AuthContext = createContext({ username: "", accessToken: "" });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>({ username: "", accessToken: "" });

  const checkUser = async () => {
    try {
      const authenticatedUser = await Auth.currentAuthenticatedUser();
      setUser(authenticatedUser);
    } catch (error) {
      setUser({ username: "", accessToken: "" });
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
