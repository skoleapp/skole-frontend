FROM node:14.10.1-alpine3.12 AS dev

RUN adduser --disabled-password user
WORKDIR /home/user/app
RUN chown user:user /home/user/app

USER user

COPY --chown=user:user package.json .
COPY --chown=user:user yarn.lock .
RUN yarn install

RUN mkdir /home/user/app/.next

ENV NEXT_TELEMETRY_DISABLED=1

CMD ["yarn", "dev"]


FROM dev AS circleci

COPY --chown=user:user . .

CMD yarn lint \
    && yarn type-check \
    && API_URL= yarn build


FROM circleci as prod

ARG API_URL

RUN yarn build

CMD ["yarn", "start"]
