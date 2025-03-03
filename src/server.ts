import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import router from "./routers";
import { prisma } from "./services/prisma-service";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import errorMiddleware from "./middlewares/error-middleware";

dotenv.config();

async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to MySQL");
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}

main();

const app = express();
const PORT = process.env.PORT || 4000;

const fileConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync("files")) fs.mkdirSync("files");
    cb(null, "files/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${Date.now()}${ext}`);
  },
});

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "*" }));

app.use(
  multer({
    storage: fileConfig,
    limits: { fileSize: 2 * 1024 * 1024 * 1024 },
    // fileFilter: fileFilter
  }).single("file")
);

app.use(router);
app.use(errorMiddleware);

app.listen(PORT, () => console.log(`Server has been started on port ${PORT}`));
