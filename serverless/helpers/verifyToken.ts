import * as jwt from "jsonwebtoken";

export const validateToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, "todo-app-secret-key");
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
};
