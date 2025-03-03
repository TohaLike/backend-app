Backend API Service

Описание

Этот проект представляет собой backend-сервис, разработанный на Node.js с использованием Express.js и Prisma для работы с базой данных MySQL. Включает аутентификацию через JWT, поддержку Docker и хранение файлов.

Развертывание локально

1. Клонирование репозитория

git clone https://github.com/your-repo.git
cd your-repo

2. Установка зависимостей

npm install

3. Конфигурация окружения

Создайте .env файл на основе .env.example и укажите переменные окружения:

cp .env.example .env

Отредактируйте .env, указав настройки для базы данных, JWT и других сервисов.

4. Запуск проекта

docker compose up -d --build


Postman коллекция доступна в файле docs/postman/collection.json. Для импорта в Postman:

Открыть Postman

Нажать Import → Upload Files

Выбрать ErpAero.postman_collection.json
