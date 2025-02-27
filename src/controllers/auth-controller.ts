import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth-service";

export class AuthController {
  static async SignUp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, password } = req.body;

      const signUpResponse = await AuthService.SignUp(id, password)

      res.json(signUpResponse)
    } catch (e) {
      next(e);
    }
  }
  
}
