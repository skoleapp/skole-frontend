FROM node:12.13.0-alpine

RUN mkdir /app
WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN yarn install

CMD [ "yarn", "dev" ]
