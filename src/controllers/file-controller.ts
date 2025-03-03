import { NextFunction, Request, Response } from "express";
import { FileService } from "../services/file-service";

export class FileController {
  static async uploadFile(req: Request, res: Response, next: NextFunction) {
    try {
      const file = req.file;

      const uplaodFile = await FileService.UploadFile(file);

      res.json(uplaodFile);
    } catch (e) {
      next(e);
    }
  }

  static async fileList(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, list_size } = req.query;

      const pageNumber = Number(page) || 1;
      const pageSize = Number(list_size) || 10;

      const fileList = await FileService.FileList(pageNumber, pageSize);

      res.json(fileList);
    } catch (e) {
      next(e);
    }
  }

  static async fileInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const fileId = Number(id);

      const fileData = await FileService.FileInfo(fileId);

      res.json(fileData);
    } catch (e) {
      next(e);
    }
  }

  static async fileDownload(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const fileId = Number(id);

      const { fileData, fileStream } = await FileService.FileDownload(fileId);

      res.setHeader("Content-type", fileData?.mimeType || "application/octet-stream");
      res.setHeader("Content-Length", fileData?.size);
      res.setHeader("Content-Disposition", `attachment; filename="${fileData?.name}${fileData.extension}"`);

      fileStream.pipe(res);

      res.on("end", () => {
        res.end();
        console.log(`Файл ${fileData.name}${fileData.extension} успешно передан`);
      });

      fileStream.on("error", (err) => {        
        console.log(`Файл ${fileData.name}${fileData.extension} не загружен`);
      });
    } catch (e) {
      next(e);
    }
  }

  static async fileUpdate(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const file = req.file;

      const fileId = Number(id);

      const fileUpdate = await FileService.FileUpdate(fileId, file);

      res.json(fileUpdate);
    } catch (e) {
      next(e);
    }
  }

  static async fileDelete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const fileId = Number(id);

      const fileDelete = await FileService.FileDelete(fileId)

      res.json(fileDelete);
    } catch (e) {
      next(e);
    }
  }
}
