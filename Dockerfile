FROM node:lts

RUN mkdir -p /usr/src/app && \
    chown -R node:node /usr/src/app
WORKDIR /usr/src/app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

COPY --chown=node:node package.json /usr/src/app/package.json

USER node

RUN npm config rm proxy && \
    npm install --only=prod && \
    npm cache clean --force


COPY --chown=node:node . /usr/src/app

ENV NODE_ENV=development \
    daemon=false \
    silent=false

EXPOSE 7000

CMD npm start
