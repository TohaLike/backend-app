import { NextFunction } from "express";

export interface ControllerProps {
  req: Request;
  res: Response;
  next: NextFunction;
}