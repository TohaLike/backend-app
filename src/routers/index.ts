import { Router } from "express";
import { AuthController } from "../controllers/auth-controller";
import { FileController } from "../controllers/file-controller";
import { UserController } from "../controllers/user-controller";
import AuthMiddleware from "../middlewares/auth-middleware";
import { validatePhoneOrEmail } from "./validate";

const router: Router = Router();

router.post("/signup", validatePhoneOrEmail, AuthController.SignUp);
router.post("/signin", validatePhoneOrEmail, AuthController.SignIn);
router.post("/signin/new_token", AuthController.NewToken);
router.post("/file/upload", AuthMiddleware, FileController.UploadFile);

router.get("/file/list", AuthMiddleware, FileController.FileList);
router.get("/info", AuthMiddleware, UserController.UserInfo);
router.get("/logout", AuthController.Logout);
// router.get("/test", AuthMiddleware, AuthController.Test);

router.get("/file/download/:id", AuthMiddleware, FileController.FileDownload);
router.delete("/file/delete/:id", AuthMiddleware, FileController.FileDelete);
router.put("/file/update/:id", AuthMiddleware, FileController.FileUpdate);

router.get("/file/:id", AuthMiddleware, FileController.FileInfo);

export default router;
