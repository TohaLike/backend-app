import { UserDto } from "../dtos/user-dto";
import { prisma } from "./prisma-service";
import { TokenService } from "./token-service";
import { TokenProps, UserProps } from "../types";
import bcrypt from "bcrypt";

export class AuthService {
  static async SignUp(id: string, password: string) {
    const candidate = await prisma.user.findUnique({ where: { id } });

    if (candidate) throw new Error("Такой юзер уже есть");

    const hashPassword = await bcrypt.hash(password, 3);

    const userData = await prisma.user.create({ data: { id, password: hashPassword } });

    const userDto = new UserDto(userData);

    const tokens = TokenService.GenerateTokens({ ...userDto });

    await TokenService.SaveToken(userDto?.id, tokens?.refreshToken);

    return { ...tokens, user: userDto };
  }


  static async SignIn(id: string, password: string) {
    const candidate = await prisma.user.findUnique({ where: { id } })

    if (!candidate) throw new Error("Такого пользователя нет");

    const isEqualPassword = await bcrypt.compare(password, candidate?.password);

    if (!isEqualPassword) throw new Error("Неверный пароль");

    const userDto = new UserDto(candidate);

    const tokens = TokenService.GenerateTokens({ ...userDto });

    await TokenService.SaveToken(userDto?.id, tokens?.refreshToken);

    return { ...tokens, user: userDto };
  }


  static async NewToken(refreshToken: string) {
    if (!refreshToken) throw new Error("Пользователь не авторизован");

    const userData = TokenService.ValidateRefreshToken(refreshToken);
    const tokenFromDB = await TokenService.FindToken(refreshToken);

    if (!userData || !tokenFromDB) throw new Error("Пользователь не авторизован");
  
    const candidate = await prisma.user.findUnique({ where: { id: userData.id }})

    if (!candidate) throw new Error("Пользователь не найден");

    const userDto = new UserDto(candidate);
    const tokens = TokenService.GenerateTokens({ ...userDto });

    await TokenService.SaveToken(userDto?.id, tokens?.refreshToken);

    return {...tokens, user: userDto}
  }

  static async Logout(refreshToken: string) {
    const token = await TokenService.DeleteToken(refreshToken);
    return token;
  }


}
