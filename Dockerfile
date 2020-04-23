FROM node:14.0.0-alpine3.11

USER node
RUN mkdir /home/node/app
RUN mkdir /home/node/app/.next
WORKDIR /home/node/app

COPY --chown=node:node package.json .
COPY --chown=node:node yarn.lock .
RUN yarn install
