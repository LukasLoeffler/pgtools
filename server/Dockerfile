FROM node:lts-alpine as build-stage

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig*.json ./
COPY ./src ./src
RUN npm ci --quiet && npm run build



FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --quiet --only=production

EXPOSE 5000

## We just need the build to execute the command
COPY --from=build-stage /usr/src/app/build ./build

RUN mkdir output
RUN mkdir temp
RUN npm install pm2 -g


CMD [ "pm2-runtime", "./build/index.js" ]