FROM node:lts

WORKDIR /iot-app/frontend

COPY ./package*.json .

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
