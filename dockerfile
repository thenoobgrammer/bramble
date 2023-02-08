FROM node:latest as builder

WORKDIR /app

COPY package.json .
COPY tsconfig.json .
COPY .env .

RUN ls -a
RUN npm install
RUN npm install ts-node -g

COPY . .

EXPOSE 80

CMD ["npm", "start"]