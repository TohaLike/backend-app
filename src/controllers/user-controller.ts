import { NextFunction, Request, Response } from "express";
import { IGetUserAuthInfoRequest } from "../types";

export class UserController {
  static async userInfo(req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) {
    try {
      res.json(req.user);
    } catch (e) {
      next(e);
    }
  }
}
