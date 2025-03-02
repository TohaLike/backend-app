import { ApiError } from "../exceptions/api-error";
import { prisma } from "./prisma-service";
import path from "path";

export class FileService {
  static async UploadFile(file?: Express.Multer.File) {
    if (!file) throw ApiError.BadRequest("Файл не выбран");

    const extension = path.extname(file?.originalname);
    const uploadFile = await prisma.file.create({
      data: {
        name: file?.fieldname,
        mimeType: file?.mimetype,
        size: file?.size,
        extension: extension,
      },
    });

    return uploadFile;
  }

  static async FileList(page: number, list_size: number) {
    const startIndex = (page - 1) * list_size;

    const fileData = await prisma.file.findMany({
      skip: startIndex,
      take: list_size,
      orderBy: { uploadedAt: "desc" },
    });

    return fileData;
  }
}
