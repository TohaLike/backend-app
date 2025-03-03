import { UserDto } from "../dtos/user-dto";
import { prisma } from "./prisma-service";
import { TokenService } from "./token-service";
import { TokenProps, UserProps } from "../types";
import { ApiError } from "../exceptions/api-error";
import bcrypt from "bcrypt";

export class AuthService {
  static async signUp(id: string, password: string, userAgent: any) {
    const candidate = await prisma.user.findUnique({ where: { id } });

    if (candidate) throw ApiError.BadRequest(`Пользователь с таким id: '${id}' уже есть`);

    const hashPassword = await bcrypt.hash(password, 3);
    const userData = await prisma.user.create({ data: { id, password: hashPassword } });
    const userDto = new UserDto(userData);
    const tokens = TokenService.generateTokens({ ...userDto });

    await TokenService.saveToken(userDto?.id, tokens?.refreshToken, userAgent);

    return { ...tokens, user: userDto };
  }


  static async signIn(id: string, password: string, userAgent: any) {
    const candidate = await prisma.user.findUnique({ where: { id } })

    if (!candidate) throw ApiError.BadRequest(`Пользователь с таким id: ${id} не зарегистрирован`)

    const isEqualPassword = await bcrypt.compare(password, candidate?.password);

    if (!isEqualPassword) throw ApiError.BadRequest("Неверный пароль");

    const userDto = new UserDto(candidate);
    const tokens = TokenService.generateTokens({ ...userDto });

    await TokenService.saveToken(userDto?.id, tokens?.refreshToken, userAgent);

    return { ...tokens, user: userDto };
  }


  static async newToken(refreshToken: string, userAgent: any) {
    if (!refreshToken) throw ApiError.UnauthorizedError();
    
    const userData = TokenService.validateRefreshToken(refreshToken);
    const tokenFromDB = await TokenService.findToken(refreshToken);

    if (!userData || !tokenFromDB) throw ApiError.UnauthorizedError();
  
    const candidate = await prisma.user.findUnique({ where: { id: userData.id }})

    if (!candidate) throw ApiError.BadRequest("Пользователь не найден");

    const userDto = new UserDto(candidate);
    const tokens = TokenService.generateTokens({ ...userDto });

    await TokenService.saveToken(userDto?.id, tokens?.refreshToken, userAgent);

    return { ...tokens, user: userDto }
  }

  static async logout(refreshToken: string, accessToken: any) {
    const token = await TokenService.deleteToken(refreshToken);
    
    await TokenService.addToBlackList(accessToken);

    return token;
  }

  static async users() {
    const response = await prisma.user.findMany();
    return response;
  }
}
