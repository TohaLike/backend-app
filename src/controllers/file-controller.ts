import { NextFunction, Request, Response } from "express";
import { FileService } from "../services/file-service";

export class FileController {
  static async UploadFile(req: Request<Express.Multer.File>, res: Response, next: NextFunction) {
    try {
      const file = req.file;

      const uplaodFile = await FileService.UploadFile(file);

      res.json(uplaodFile);
    } catch (e) {
      next(e);
    }
  }

  static async FileList(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, list_size } = req.query;


      const pageNumber = Number(page) || 1; 
      const pageSize = Number(list_size) || 10;

      const fileList = await FileService.FileList(pageNumber, pageSize)

      res.json(fileList)
    } catch (e) {
      next(e)
    }
  }
}
