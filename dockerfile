# 1. Укажите базовый образ. Мы будем использовать node:lts для Node.js.
FROM node:lts AS build

# 2. Установите рабочую директорию внутри контейнера.
WORKDIR /app

# 3. Скопируйте package.json и package-lock.json в контейнер и установите зависимости.
COPY package*.json ./
RUN npm install

# 4. Скопируйте остальную часть вашего проекта в контейнер.
COPY . .

# 5. Соберите приложение Vue.
RUN npm run build

# 6. Используйте базовый образ для деплоя.
FROM nginx:alpine

# 7. Скопируйте файлы сборки в директорию Nginx.
COPY --from=build /app/dist /usr/share/nginx/html

# 8. Откройте порт 80 для приложения.
EXPOSE 80

# 9. Запустите Nginx.
CMD ["nginx", "-g", "daemon off;"]
