import { ApiError } from "../exceptions/api-error";
import { prisma } from "./prisma-service";
import { FileMulter } from "../types";
import { rimraf } from "rimraf";
import path from "path";
import fs from "fs";

export class FileService {
  static async UploadFile(file?: FileMulter) {
    if (!file) throw ApiError.BadRequest("Файл не выбран");

    const extension = path.extname(file?.originalname);

    const uploadFile = await prisma.file.create({
      data: {
        name: file?.fieldname,
        mimeType: file?.mimetype,
        size: file?.size,
        extension: extension,
        path: file?.path,
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

  static async FileInfo(id: number) {
    if (!id) throw ApiError.BadRequest("Файл не выбран");

    const fileData = await prisma.file.findUnique({ where: { id } });

    if (!fileData) throw ApiError.FileNotFound();

    return fileData;
  }

  static async FileDownload(id: number) {
    const fileData = await prisma.file.findUnique({ where: { id } });

    if (!fileData) throw ApiError.FileNotFound();

    const filePath = fileData?.path;

    if (!fs.existsSync(filePath))
      throw ApiError.BadRequest("Файл отсутствует на сервере");

    const fileStream = fs.createReadStream(filePath);

    return { fileData, fileStream };
  }

  static async FileUpdate(id: number, file?: FileMulter) {
    const fileData = await prisma.file.findUnique({ where: { id } });

    console.log(fileData)

    if (!fileData || !file) throw ApiError.FileNotFound();

    const oldFilePath = path.join(__dirname, "../files", fileData?.path);
    const extension = path.extname(file?.originalname);

    rimraf(oldFilePath);

    const fileUpdate = prisma.file.update({
      where: { id: id },
      data: {
        name: file?.fieldname,
        mimeType: file?.mimetype,
        size: file?.size,
        extension: extension,
        path: file?.path,
      },
    });

    return fileUpdate;
  }
}
