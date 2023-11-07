import * as jwt from "jwt-decode";

const getUserId = (token: string) => {
  try {
    const decodedToken = jwt.jwtDecode(token);
    return decodedToken.sub;
  } catch (error: any) {
    throw new Error(error);
  }
};

export default getUserId;
