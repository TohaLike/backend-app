import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user-service";
import { IGetUserAuthInfoRequest } from "../types";

export class UserController {
  static async UserInfo(req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) {
    try {
      res.json(req.user);
    } catch (e) {
      next(e);
    }
  }
}
