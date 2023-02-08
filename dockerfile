FROM node:latest as builder

WORKDIR /app

COPY package.json .
COPY tsconfig.json .
COPY .env .

RUN ls -a
RUN npm install
RUN npm install -g pm2
RUN npm install -g ts-node
RUN pm2 install typescript

COPY . .

EXPOSE 80

CMD ["npm", "start"]