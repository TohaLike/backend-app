import dotenv from "dotenv";
import express from "express";
import cookieOptions from "cookie-parser";
import router from "./routers";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieOptions());



app.use("/api", router);

async function main() {
  try {
    app.listen(PORT, () =>
      console.log(`Server has been started on port ${PORT}`)
    );
  } catch (e) {
    console.log(e);
  }
}

main();
