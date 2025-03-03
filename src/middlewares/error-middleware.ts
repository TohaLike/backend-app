import { NextFunction, Request, Response } from "express"
import { ApiError } from "../exceptions/api-error"

export default function ErrorMiddleware(err: Error[], req: Request, res: Response, next: NextFunction): void {
console.log(err)
  if (err instanceof ApiError) {
    res.status(err.status).json({ message: err.message, errors: err.errors })
    return;
  }

  res.status(500).json({ message: "Непредвиденная ошибка" })
}
