FROM node:14.10.1-alpine3.12 AS dev

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

# Needs to be during `yarn build`. Will be an empty string in circleci
# and gets an actual value when building prod image.
ARG API_URL

COPY --chown=user:user . .

CMD yarn lint \
    && yarn type-check \
    && yarn build


FROM circleci as prod

RUN yarn build

CMD ["yarn", "start"]
