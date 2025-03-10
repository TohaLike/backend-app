import { ApiError } from "../exceptions/api-error";
import { prisma } from "./prisma-service";
import { FileMulter } from "../types";
import { rimraf } from "rimraf";
import path from "path";
import fs from "fs";

export class FileService {
  static async uploadFile(file?: FileMulter) {
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

  static async fileList(page: number, list_size: number) {
    const startIndex = (page - 1) * list_size;

    const fileData = await prisma.file.findMany({
      skip: startIndex,
      take: list_size,
    });

    return fileData;
  }

  static async fileInfo(id: number) {
    if (!id) throw ApiError.BadRequest("Файл не выбран");

    const fileData = await prisma.file.findUnique({ where: { id } });

    if (!fileData) throw ApiError.FileNotFound();

    return fileData;
  }

  static async fileDownload(id: number) {
    const fileData = await prisma.file.findUnique({ where: { id } });

    if (!fileData) throw ApiError.FileNotFound();

    const filePath = fileData?.path;

    if (!fs.existsSync(filePath)) throw ApiError.BadRequest("Файл отсутствует на сервере");

    const fileStream = fs.createReadStream(filePath);

    return { fileData, fileStream };
  }

  static async fileUpdate(id: number, file?: FileMulter) {
    const fileData = await prisma.file.findUnique({ where: { id } });

    if (!fileData || !file) {
      rimraf(String(file?.path));
      throw ApiError.FileNotFound();
    }

    rimraf(fileData?.path);

    const extension = path.extname(file?.originalname);

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

  static async fileDelete(id: number) {
    const fileData = await prisma.file.findUnique({ where: { id } });

    if (!fileData) throw ApiError.FileNotFound();

    const deletedFile = await prisma.file.delete({ where: { id } });

    rimraf(fileData?.path);

    return deletedFile;
  }
}
