import jwt from "jsonwebtoken";
import config from "../config/config.js";

export const getSecretKey = (secretKey: string | undefined) => {
  if (typeof secretKey !== "string") {
    throw new Error("JWT_SECRET_KEY must be a valid string.");
  }
  return secretKey;
};

export const generateAccessToken = (payload: any, expiresIn: any = "15m") => {
  const secretKey = getSecretKey(config.JWT_ACCESS_SECRET_KEY);
  return jwt.sign(payload, secretKey, { expiresIn });
};

export const generateRefreshToken = (payload: any, expiresIn: any = "7d") => {
  const secretKey = getSecretKey(config.JWT_REFRESH_SECRET_KEY);
  return jwt.sign(payload, secretKey, { expiresIn });
};

export const verifyAccessToken = (token: any) => {
  try {
    const secretKey = getSecretKey(config.JWT_ACCESS_SECRET_KEY);
    return jwt.verify(token, secretKey);
  } catch (err) {
    return null;
  }
};

export const verifyRefreshToken = (token: any) => {
  try {
    const secretKey = getSecretKey(config.JWT_REFRESH_SECRET_KEY);
    return jwt.verify(token, secretKey);
  } catch (err) {
    return null;
  }
};
