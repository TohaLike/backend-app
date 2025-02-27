import { UserDto } from "../dtos/user-gto";
import { prisma } from "./prisma-service";
import bcrypt from "bcrypt";

export class AuthService {
  static async SignUp(id: string, password: string) {
    const candidate = await prisma.user.findUnique({ where: { id } });

    if (candidate) throw new Error("Такой юзер уже есть");

    const hashPassword = await bcrypt.hash(password, 3);

    const userData = await prisma.user.create({ data: { id, password: hashPassword } });

    const userDto = new UserDto(userData)

    return { ...userDto };
  }



}
