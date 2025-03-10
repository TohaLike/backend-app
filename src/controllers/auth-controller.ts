import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth-service";
import { validationResult } from "express-validator";
import { ApiError } from "../exceptions/api-error";

export class AuthController {
  static async signUp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const message = errors.array().map(err => err.msg).join(", "); 
        return next(ApiError.BadRequest(message))
      };

      const { id, password } = req.body;
      const userAgent = req.headers["user-agent"];

      const userData = await AuthService.signUp(id, password, userAgent);
      res.cookie("refreshToken", userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })

      res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  static async signIn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const message = errors.array().map(err => err.msg).join(", "); 
        return next(ApiError.BadRequest(message))
      };

      const { id, password } = req.body;
      const userAgent = req.headers["user-agent"];

      const userData = await AuthService.signIn(id, password, userAgent)
      res.cookie("refreshToken", userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
      res.cookie("accessToken", userData.accessToken, { maxAge: 10 * 60 * 1000 })

      res.json(userData);
    } catch (e) {
      next(e);
    }
  }


  static async newToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.cookies;
      const userAgent = req.headers["user-agent"];

      const tokenData = await AuthService.newToken(refreshToken, userAgent);
      res.cookie("refreshToken", tokenData?.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
      res.cookie("accessToken", tokenData?.accessToken, { maxAge: 10 * 60 * 1000 })

      res.json(tokenData);
    } catch (e) {
      next(e);
    }
  }


  static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken, accessToken } = req.cookies;

      const logoutData = await AuthService.logout(refreshToken, accessToken)
      res.clearCookie("refreshToken");

      res.json(logoutData);
    } catch (e) {
      next(e);
    }
  }


  static async test(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.users()

      res.json(result)
    } catch (e) {
      next(e);
    }
  }
}
