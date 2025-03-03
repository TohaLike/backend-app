import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth-service";
import { validationResult } from "express-validator";
import { ApiError } from "../exceptions/api-error";

export class AuthController {
  static async SignUp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const message = errors.array().map(err => err.msg).join(", "); 
        return next(ApiError.BadRequest(message))
      };

      const { id, password } = req.body;
      const userAgent = req.headers["user-agent"];

      const userData = await AuthService.SignUp(id, password, userAgent);
      res.cookie("refreshToken", userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })

      res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  static async SignIn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const message = errors.array().map(err => err.msg).join(", "); 
        return next(ApiError.BadRequest(message))
      };
      
      const { id, password } = req.body;
      const userAgent = req.headers["user-agent"];

      const userData = await AuthService.SignIn(id, password, userAgent)
      res.cookie("refreshToken", userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
      res.cookie("accessToken", userData.accessToken, { maxAge: 10 * 60 * 1000 })

      res.json(userData);
    } catch (e) {
      next(e);
    }
  }


  static async NewToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.cookies;
      const userAgent = req.headers["user-agent"];

      const tokenData = await AuthService.NewToken(refreshToken, userAgent);
      res.cookie("refreshToken", tokenData?.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
      res.cookie("accessToken", tokenData?.accessToken, { maxAge: 10 * 60 * 1000 })

      res.json(tokenData);
    } catch (e) {
      next(e);
    }
  }


  static async Logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken, accessToken } = req.cookies;

      const logoutData = await AuthService.Logout(refreshToken, accessToken)
      res.clearCookie("refreshToken");

      res.json(logoutData);
    } catch (e) {
      next(e);
    }
  }


  static async Test(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.Users()

      res.json(result)
    } catch (e) {
      next(e);
    }
  }
}
