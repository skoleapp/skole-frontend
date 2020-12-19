FROM node:14.10.1-alpine3.12 AS base

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


FROM dev AS circleci

COPY --chown=user:user . .

CMD yarn lint \
    && yarn type-check \
    && API_URL= yarn build


FROM circleci as build

ARG API_URL
ARG FRONTEND_URL
ARG SA_URL

ENV NODE_ENV=production 

# Build with dev dependencies installed so e.g. typescript transpiling works.
RUN yarn build

# Get rid of all dev dependencies.
RUN yarn install --production --ignore-scripts --prefer-offline


FROM base as prod

ENV NODE_ENV=production 
ENV PATH="/home/user/app/node_modules/.bin:${PATH}"

# The production app needs exactly these and nothing more.
COPY --from=build --chown=user:user /home/user/app/.next .next
COPY --from=build --chown=user:user /home/user/app/node_modules node_modules
COPY --from=build --chown=user:user /home/user/app/next.config.js next.config.js
COPY --from=build --chown=user:user /home/user/app/i18n.json i18n.json
COPY --from=build --chown=user:user /home/user/app/public public

CMD ["next", "start", "-p", "3001"]
