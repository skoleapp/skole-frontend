FROM node:15.10.0-buster-slim@sha256:2a351dd6e7236d277f51f00266cc1807791b217837392cfd39fa64c01cb6c094 AS base

RUN apt-get update && \
  apt-get install --no-install-recommends --assume-yes \
  libgtk2.0-0 \
  libgtk-3-0 \
  libnotify-dev \
  libgconf-2-4 \
  libgbm-dev \
  libnss3 \
  libxss1 \
  libasound2 \
  libxtst6 \
  xauth \
  xvfb

RUN adduser --disabled-password user
WORKDIR /home/user/app
RUN chown user:user /home/user/app

USER user

ENV NEXT_TELEMETRY_DISABLED=1


FROM base as dev

ENV NODE_ENV=development

COPY --chown=user:user package.json .
COPY --chown=user:user yarn.lock .

RUN yarn install
RUN mkdir .next

CMD ["yarn", "dev"]


FROM dev AS ci

# https://stackoverflow.com/a/35562189/10504286
ARG GITHUB_RUN_NUMBER
ARG CYPRESS_RECORD_KEY
ENV GITHUB_RUN_NUMBER ${GITHUB_RUN_NUMBER}
ENV CYPRESS_RECORD_KEY ${CYPRESS_RECORD_KEY}

COPY --chown=user:user . .

CMD yarn lint \
    && yarn type-check \
    && API_URL=http://localhost:8000 yarn build \
    && yarn start & yarn wait-on http://localhost:3001 \
    # TODO: Enable recording and parallelism on Apr 1, 2021
    # && yarn cypress:run --record --parallel --ci-build-id=${GITHUB_RUN_NUMBER}
    && yarn cypress:run

FROM ci as build

ARG API_URL
ARG FRONTEND_URL
ARG SA_URL
ARG EMAIL_ADDRESS

ENV NODE_ENV=production

# Build with dev dependencies installed so e.g. typescript transpiling works.
RUN yarn build

# Get rid of all dev dependencies.
RUN yarn install --production --ignore-scripts --prefer-offline


FROM base as prod

ENV NODE_ENV=production
ENV PATH="/home/user/app/node_modules/.bin:${PATH}"

# The production app needs exactly these and nothing more.
COPY --from=build --chown=user:user /home/user/app/src src
COPY --from=build --chown=user:user /home/user/app/markdown markdown
COPY --from=build --chown=user:user /home/user/app/.next .next
COPY --from=build --chown=user:user /home/user/app/node_modules node_modules
COPY --from=build --chown=user:user /home/user/app/next.config.js next.config.js
COPY --from=build --chown=user:user /home/user/app/i18n.js i18n.js
COPY --from=build --chown=user:user /home/user/app/public public

CMD ["next", "start", "-p", "3001"]
