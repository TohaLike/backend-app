import { NextFunction, Response } from "express";
import { ApiError } from "../exceptions/api-error";
import { TokenService } from "../services/token-service";
import { IGetUserAuthInfoRequest } from "../types";

export default async function authMiddleware(req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) {
  try {
    const authorizationHeader = req.headers.authorization;
    const accessToken = authorizationHeader?.split(" ")[1];

    if (!accessToken) return next(ApiError.UnauthorizedError());

    const isBlackListed = await TokenService.isTokenBlacklisted(accessToken);

    if (isBlackListed) return next(ApiError.UnauthorizedError());

    const userData = TokenService.validateAccessToken(accessToken);

    if (!userData) return next(ApiError.UnauthorizedError());

    req.user = userData;
    next()
  } catch (e) {
    return next(ApiError.UnauthorizedError())
  }
}