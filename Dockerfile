FROM node:14.7.0-alpine3.12 AS dev

RUN adduser --disabled-password user
WORKDIR /home/user/app
RUN chown user:user /home/user/app

USER user

COPY --chown=user:user package.json .
COPY --chown=user:user yarn.lock .
RUN yarn install

RUN mkdir /home/user/app/.next

CMD ["yarn", "dev"]


FROM dev AS circleci

COPY --chown=user:user . .

CMD yarn lint \
    && yarn type-check
