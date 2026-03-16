FROM node:20

WORKDIR /usr/src/app

# Устанавливаем зависимости (npm ci установит из package.json внутри volume)
RUN npm ci

EXPOSE 3000

CMD ["npm", "run", "start:dev"]