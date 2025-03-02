import { NextFunction, Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface ControllerProps {
  req: Request;
  res: Response;
  next: NextFunction;
}

export interface UserProps {
  id: string;
  password: string;
}

export type JwtResponse = JwtPayload | string | null | undefined;

export interface TokenProps {
  accessToken: string;
  refreshToken: string;
}

const verify = <T extends object>(token: string, secret: string): T => {
  return jwt.verify(token, secret) as T;
};

const sign = <T extends object>(payload: T, secret: string): string => {
  return jwt.sign(payload, secret);
};

export const MyJwt = {
  sign,
  verify,
};

export interface IGetUserAuthInfoRequest extends Request {
  user?: string | JwtPayload;
}


export type FileMulter = Express.Multer.File