FROM node:alpine

WORKDIR /app
COPY package.json .
COPY tsconfig.json .
COPY assets ./assets
COPY client ./client
COPY server ./server
COPY types ./types

RUN yarn install