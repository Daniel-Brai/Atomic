FROM node:18-alpine

ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "pnpm-lock.yaml", "./"]

RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
