import { Router } from "express";
import { AuthController } from "../controllers/auth-controller";

const router: Router = Router();

router.post("/signup", AuthController.SignUp); // регистрация нового пользователя
router.post("/signin", AuthController.SignIn); // запрос jwt-токена по id и паролю
router.post("/signin/new_token", AuthController.NewToken); // обновление jwt-токена по refresh токену

router.post("/file/upload");
// добавление нового файла в систему
// и запись параметров файла в базу: название, расширение, MIME type, размер, дата загрузки;

router.get("/info"); // возвращает id пользователя
router.get("/logout", AuthController.Logut); // выйти из системы

router.get("/file/list");
// выводит список файлов и их параметров из базы
// с использованием пагинации с размером страницы,
// указанного в передаваемом параметре list_size,
// по умолчанию 10 записей на страницу,
// если параметр пустой. Номер страницы указан в параметре page,
// по умолчанию 1, если не задан

router.get("/file/:id"); // вывод информации о выбранном файле
router.get("/file/download/:id"); // скачивание конкретного файла

router.delete("/file/delete/:id"); //удаляет документ из базы и локального хранилища

router.put("/file/update/:id"); // обновление текущего документа на новый в базе и локальном хранилище

export default router;
