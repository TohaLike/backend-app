import { ApiError } from "../exceptions/api-error";
import { TokenService } from "./token-service";

export class UserService {
  static async UserInfo(refreshToken: string) {
    // if (!refreshToken) throw ApiError.UnauthorizedError();

    // const userData = TokenService.ValidateRefreshToken(refreshToken);
    // const tokenFromDB = await TokenService.FindToken(refreshToken);

    // if (!userData || !tokenFromDB) throw ApiError.UnauthorizedError();

    // return userData;
  }
}
