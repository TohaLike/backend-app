import { Router } from "express";
import { AuthController } from "../controllers/auth-controller";
import { FileController } from "../controllers/file-controller";
import { UserController } from "../controllers/user-controller";
import authMiddleware from "../middlewares/auth-middleware";
import { validatePhoneOrEmail } from "./validate";

const router: Router = Router();

router.post("/signup", validatePhoneOrEmail, AuthController.signUp);
router.post("/signin", validatePhoneOrEmail, AuthController.signIn);
router.post("/signin/new_token", AuthController.newToken);
router.post("/file/upload", authMiddleware, FileController.uploadFile);

router.get("/file/list", authMiddleware, FileController.fileList);
router.get("/info", authMiddleware, UserController.userInfo);
router.get("/logout", AuthController.logout);
// router.get("/test", authMiddleware, AuthController.Test);

router.delete("/file/delete/:id", authMiddleware, FileController.fileDelete);
router.put("/file/update/:id", authMiddleware, FileController.fileUpdate);
router.get("/file/download/:id", authMiddleware, FileController.fileDownload);

router.get("/file/:id", authMiddleware, FileController.fileInfo);

export default router;
