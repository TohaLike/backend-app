import { ApiError } from "./api-error";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

export class PrismaError extends ApiError {
  constructor(error: PrismaClientKnownRequestError) {
    let message = "Ошибка базы данных";
    let status = 400;

    switch (error.code) {
      case "P2002": // Нарушение уникальности
        message = "Запись с такими данными уже существует";
        status = 409;
        break;
      case "P2025": // Объект не найден
        message = "Запрашиваемая запись не найдена";
        status = 404;
        break;
      default:
        message = "Неизвестная ошибка базы данных";
        status = 500;
        break;
    }

    super(status, message);
  }
}