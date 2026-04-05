import jwt from "jsonwebtoken";

type Payload = {
  id: number;
  email: string;
};
export const generateAccessToken = (Data: Payload) => {
  const payload = {
    id: Data.id,
    email: Data.email,
  };
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (Data: Payload) => {
  const payload = {
    id: Data.id,
    email: Data.email,
  };
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: "7d",
  });
};
