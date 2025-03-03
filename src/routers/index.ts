import { Router } from "express";
import { AuthController } from "../controllers/auth-controller";
import { FileController } from "../controllers/file-controller";
import { UserController } from "../controllers/user-controller";
import AuthMiddleware from "../middlewares/auth-middleware";

const router: Router = Router();

router.post("/signup", AuthController.SignUp);
router.post("/signin", AuthController.SignIn);
router.post("/signin/new_token", AuthController.NewToken);
router.post("/file/upload", FileController.UploadFile);

router.get("/file/:id", FileController.FileInfo);
router.get("/file/list", FileController.FileList);
router.get("/info", AuthMiddleware, UserController.UserInfo);
router.get("/logout", AuthController.Logut);
// router.get("/test", AuthMiddleware, AuthController.Test);

router.get("/file/download/:id", FileController.FileDownload);
router.delete("/file/delete/:id", FileController.FileDelete);
router.put("/file/update/:id", FileController.FileUpdate);

export default router;
