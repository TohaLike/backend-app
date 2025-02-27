import { Router } from "express";
import { AuthController } from "../controllers/auth-controller";

const router: Router = Router();

router.post("/signin") // запрос jwt-токена по id и паролю;
router.post("/signin/new_token") // обновление jwt-токена по refresh токену;
router.post("/auth/signup", AuthController.SignUp) // регистрация нового пользователя;

export default router;
