FROM node:lts

WORKDIR /iot-app/backend

COPY ./package*.json .

RUN npm install

EXPOSE 8000

CMD ["node", "server.js"]
