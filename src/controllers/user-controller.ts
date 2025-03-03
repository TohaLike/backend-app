import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user-service";

export class UserController {
  static async UserInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;

      const userInfo = await UserService.UserInfo(refreshToken);

      res.json(userInfo);
    } catch (e) {
      next(e);
    }
  }
}
