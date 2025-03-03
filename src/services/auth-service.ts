import { UserDto } from "../dtos/user-dto";
import { prisma } from "./prisma-service";
import { TokenService } from "./token-service";
import { TokenProps, UserProps } from "../types";
import { ApiError } from "../exceptions/api-error";
import bcrypt from "bcrypt";

export class AuthService {
  static async SignUp(id: string, password: string, userAgent: any) {
    const candidate = await prisma.user.findUnique({ where: { id } });

    if (candidate) throw ApiError.BadRequest(`Пользователь с таким id: '${id}' уже есть`);

    const hashPassword = await bcrypt.hash(password, 3);
    const userData = await prisma.user.create({ data: { id, password: hashPassword } });
    const userDto = new UserDto(userData);
    const tokens = TokenService.GenerateTokens({ ...userDto });

    await TokenService.SaveToken(userDto?.id, tokens?.refreshToken, userAgent);

    return { ...tokens, user: userDto };
  }


  static async SignIn(id: string, password: string, userAgent: any) {
    const candidate = await prisma.user.findUnique({ where: { id } })

    if (!candidate) throw ApiError.BadRequest(`Пользователь с таким id: ${id} не зарегистрирован`)

    const isEqualPassword = await bcrypt.compare(password, candidate?.password);

    if (!isEqualPassword) throw ApiError.BadRequest("Неверный пароль");

    const userDto = new UserDto(candidate);
    const tokens = TokenService.GenerateTokens({ ...userDto });

    await TokenService.SaveToken(userDto?.id, tokens?.refreshToken, userAgent);

    return { ...tokens, user: userDto };
  }


  static async NewToken(refreshToken: string, userAgent: any) {
    if (!refreshToken) throw ApiError.UnauthorizedError();
    
    const userData = TokenService.ValidateRefreshToken(refreshToken);
    const tokenFromDB = await TokenService.FindToken(refreshToken);

    if (!userData || !tokenFromDB) throw ApiError.UnauthorizedError();
  
    const candidate = await prisma.user.findUnique({ where: { id: userData.id }})

    if (!candidate) throw ApiError.BadRequest("Пользователь не найден");

    const userDto = new UserDto(candidate);
    const tokens = TokenService.GenerateTokens({ ...userDto });

    await TokenService.SaveToken(userDto?.id, tokens?.refreshToken, userAgent);

    return { ...tokens, user: userDto }
  }

  static async Logout(refreshToken: string, accessToken: any) {
    const token = await TokenService.DeleteToken(refreshToken);
    
    await TokenService.addToBlackList(accessToken);

    return token;
  }

  static async Users() {
    const response = await prisma.user.findMany();
    return response;
  }
}
