FROM node:latest

ADD . /app
WORKDIR /app

RUN npm i

CMD ["npm", "run", "dev"]