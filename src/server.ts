import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import router from "./routers";
import { prisma } from "./services/prisma-service";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "*" }))



app.use("/api", router);

async function main() {
  try {
    await prisma.$connect();
    console.log("✅ Connected to MySQL");
    app.listen(PORT, () => console.log(`Server has been started on port ${PORT}`));
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}

main();
