Backend API Service ErpAero

🚀 Развертывание локально

1. Клонирование репозитория
```sh
git clone https://github.com/TohaLike/backend-app.git
```
cd backend-app

2. Установка зависимостей
```sh
npm install
```
3. Конфигурация окружения

Создайте .env файл на основе .env.example и укажите переменные окружения:
```sh
cp .env.example .env
```
Отредактируйте .env, указав настройки для базы данных, JWT и других сервисов.

4. Запуск проекта
```sh
docker compose up -d --build
```
📌 API Документация

Postman коллекция доступна в файле docs/postman/collection.json. Для импорта в Postman:

Открыть Postman

Нажать Import → Upload Files

Выбрать ErpAero.postman_collection.json


