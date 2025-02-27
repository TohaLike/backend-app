import jwt, { JwtPayload } from "jsonwebtoken";
import { JwtResponse } from "../types";

export class TokenService {
  generateTokens(payload: object) {
    if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) return;

    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: "10m" });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" });

    return { accessToken, refreshToken }
  }

  validateAccessToken(token: string): JwtResponse {
    try {
      if (!process.env.JWT_ACCESS_SECRET) return;

      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)

      return userData;
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token: string): JwtResponse {
    try {
      if (!process.env.JWT_REFRESH_SECRET) return;

      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)

      return userData;
    } catch (e) {
      return null;
    }
  }
}
