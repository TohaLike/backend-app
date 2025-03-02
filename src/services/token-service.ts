import jwt from "jsonwebtoken";
import { JwtResponse, TokenProps, UserProps, MyJwt} from "../types";
import { prisma } from "./prisma-service";

export class TokenService {
  static GenerateTokens(payload: object) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, { expiresIn: "1m" });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: "30d" });

    return { accessToken, refreshToken }
  }

  static ValidateAccessToken(token: string): JwtResponse {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET!)
      return userData;
    } catch (e) {
      return null;
    }
  }

  static ValidateRefreshToken(token: string)  {
    try {
      const userData = MyJwt.verify<UserProps>(token, process.env.JWT_REFRESH_SECRET!)
      return userData;
    } catch (e) {
      return null;
    }
  }

  static async SaveToken(userId: string, refreshToken: string) {
    const tokenData = await prisma.token.findUnique({ where: { userId } })

    if (tokenData) {
      const savedToken = await prisma.token.update({ where: { userId }, data: { refreshToken } });
      return savedToken;
    }

    const token = await prisma.token.create({ data: { userId, refreshToken }});
    return token;
  }

  static async DeleteToken(refreshToken: string) {
    const tokenData = await prisma.token.delete({ where: { refreshToken } });
    return tokenData;
  }

  static async FindToken(refreshToken: string) {
    const tokenData = await prisma.token.findUnique({ where: { refreshToken } });
    return tokenData;
  }
}
