import { NextFunction, Request, Response } from "express"
import { ApiError } from "../exceptions/api-error"

export default function errorMiddleware(err: Error[], req: Request, res: Response, next: NextFunction): void {

  if (err instanceof ApiError) {
    res.status(err.status).json({ message: err.message, errors: err.errors })
    return;
  }

  res.status(500).json({ message: "Непредвиденная ошибка" })
}
