import { NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface ControllerProps {
  req: Request;
  res: Response;
  next: NextFunction;
}


export interface UserProps {
  id: string;
}

export type JwtResponse = JwtPayload | string | null | undefined 