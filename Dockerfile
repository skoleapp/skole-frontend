FROM node:10.16.0

RUN mkdir /app
WORKDIR /app

COPY package*.json ./
RUN yarn install

CMD [ "yarn", "dev" ]
