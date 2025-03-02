import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import router from "./routers";
import { prisma } from "./services/prisma-service";
import ErrorMiddleware from "./middlewares/error-middleware";
import cors from "cors";
import multer from "multer";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

const fileConfig = multer.diskStorage({
  destination: (req, file, cb) => {
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

app.use(multer({
  storage: fileConfig,
  limits: { fileSize: 2 * 1024 * 1024 * 1024 },
  // fileFilter: fileFilter
}).single("file"))

app.use("/api", router);
app.use(ErrorMiddleware);

async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to MySQL");
    app.listen(PORT, () =>
      console.log(`Server has been started on port ${PORT}`)
    );
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}

main();
