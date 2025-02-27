import { Router } from "express";
import { AuthController } from "../controllers/auth-controller";

const router: Router = Router();

router.post("/signin", AuthController.SignIn) // запрос jwt-токена по id и паролю;
router.post("/signin/new_token", AuthController.NewToken) // обновление jwt-токена по refresh токену;
router.post("/auth/signup", AuthController.SignUp) // регистрация нового пользователя;

export default router;
