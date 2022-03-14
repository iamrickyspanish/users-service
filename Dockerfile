FROM node:latest

ADD . /app
WORKDIR /app

CMD ["npm", "run", "dev"]