import { ErrorRequestHandler, NextFunction, Request, Response } from "express"
import { ApiError } from "../exceptions/api-error"

export const ErrorMiddleware: ErrorRequestHandler = (err: ApiError | Error, req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof ApiError) {
    res.status(err.status).json({ message: err.message, errors: err.errors })
  }

  res.status(500).json({ message: "Непредвиденная ошибка" })
}
