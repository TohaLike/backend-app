import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth-service";

export class AuthController {
  static async SignUp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, password } = req.body;

      const userData = await AuthService.SignUp(id, password);
      res.cookie("refreshToken", userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })

      res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  static async SignIn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, password } = req.body;

      const userData = await AuthService.SignIn(id, password)
      res.cookie("refreshToken", userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })

      res.json(userData);
    } catch (e) {
      next(e);
    }
  }


  static async NewToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.cookies;

      const tokenData = await AuthService.NewToken(refreshToken);
      res.cookie("refreshToken", tokenData?.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })

      res.json(tokenData);
    } catch (e) {
      next(e);
    }
  }


  static async Logut(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.cookies;

      const logoutData = await AuthService.Logout(refreshToken)
      res.clearCookie("refreshToken");

      res.json(logoutData);
    } catch (e) {
      next(e);
    }
  }
}
