import { UserDto } from "../dtos/user-dto";
import { prisma } from "./prisma-service";
import { TokenService } from "./token-service";
import { TokenProps } from "../types";
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


  static async Logout(refreshToken: string) {
    const token = await TokenService.DeleteToken(refreshToken);

    console.log(token)

    return token;
  }


}
